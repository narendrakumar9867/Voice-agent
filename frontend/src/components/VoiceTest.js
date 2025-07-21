import { useState, useRef, useEffect } from "react";

const VoiceTest = () => {
    const [log, setLog] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [candidateData, setCandidateData] = useState({
        name: "John Doe", // This would come from candidate selection
        jobTitle: "Software Developer", // This would come from job selection
        company: "Tech Corp"
    });
    
    const recognitionRef = useRef(null);
    const synthesisRef = useRef(null);

    // Conversation flow questions
    const conversationFlow = [
        `Hello ${candidateData.name}, this is ${candidateData.company} regarding a ${candidateData.jobTitle} opportunity.`,
        "Are you interested in this role?",
        "What is your current notice period?",
        "Can you share your current and expected CTC?",
        "When are you available for an interview next week?",
        "We've scheduled your interview. Is that correct?"
    ];

    useEffect(() => {
        // Initialize speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = handleSpeechResult;
            recognitionRef.current.onerror = handleSpeechError;
            recognitionRef.current.onend = () => setIsListening(false);
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (synthesisRef.current) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const handleSpeechResult = (event) => {
        const userSpeech = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        
        // Add user speech to log
        setLog(prev => [...prev, {
            type: 'user',
            text: userSpeech,
            confidence: confidence,
            timestamp: new Date().toLocaleTimeString()
        }]);

        // Process the response and move to next step
        processUserResponse(userSpeech);
    };

    const handleSpeechError = (event) => {
        console.error('Speech recognition error:', event.error);
        setLog(prev => [...prev, {
            type: 'error',
            text: `Speech recognition error: ${event.error}`,
            timestamp: new Date().toLocaleTimeString()
        }]);
        setIsListening(false);
    };

    const processUserResponse = (userSpeech) => {
        let botResponse = "";
        let extractedData = {};

        // Simple entity extraction and validation
        switch (currentStep) {
            case 1: // Interest confirmation
                if (userSpeech.toLowerCase().includes('yes') || userSpeech.toLowerCase().includes('interested')) {
                    botResponse = conversationFlow[2];
                    setCurrentStep(2);
                } else if (userSpeech.toLowerCase().includes('no')) {
                    botResponse = "Thank you for your time. Have a great day!";
                    setCurrentStep(-1); // End conversation
                } else {
                    botResponse = "Could you please confirm if you're interested in this role? Please say yes or no.";
                }
                break;

            case 2: // Notice period
                extractedData = extractNoticePeriod(userSpeech);
                if (extractedData.noticePeriod) {
                    botResponse = conversationFlow[3];
                    setCurrentStep(3);
                } else {
                    botResponse = "Could you please repeat your notice period? For example, '30 days' or '2 months'.";
                }
                break;

            case 3: // CTC
                extractedData = extractCTC(userSpeech);
                if (extractedData.currentCTC && extractedData.expectedCTC) {
                    botResponse = conversationFlow[4];
                    setCurrentStep(4);
                } else {
                    botResponse = "Could you please share both your current and expected CTC clearly?";
                }
                break;

            case 4: // Interview availability
                extractedData = extractAvailability(userSpeech);
                if (extractedData.availability) {
                    botResponse = `We've scheduled your interview on ${extractedData.availability}. Is that correct?`;
                    setCurrentStep(5);
                } else {
                    botResponse = "Could you please specify when you're available next week? For example, 'Monday afternoon' or 'Wednesday at 2 PM'.";
                }
                break;

            case 5: // Confirmation
                if (userSpeech.toLowerCase().includes('yes') || userSpeech.toLowerCase().includes('correct')) {
                    botResponse = "Perfect! We'll send you a confirmation email shortly. Thank you!";
                    setCurrentStep(-1); // End conversation
                } else {
                    botResponse = "When would be a better time for you next week?";
                    setCurrentStep(4); // Go back to scheduling
                }
                break;

            default:
                botResponse = "I didn't understand that. Could you please repeat?";
        }

        // Add bot response to log
        if (botResponse) {
            setLog(prev => [...prev, {
                type: 'bot',
                text: botResponse,
                timestamp: new Date().toLocaleTimeString(),
                extractedData: extractedData
            }]);

            // Speak the response
            speakText(botResponse);
        }
    };

    // Entity extraction functions
    const extractNoticePeriod = (text) => {
        const noticePeriodRegex = /(\d+)\s*(day|days|week|weeks|month|months)/i;
        const match = text.match(noticePeriodRegex);
        if (match) {
            return { noticePeriod: `${match[1]} ${match[2]}` };
        }
        return {};
    };

    const extractCTC = (text) => {
        const ctcRegex = /(\d+(?:\.\d+)?)\s*(lakh|lakhs|thousand|k|crore)/gi;
        const matches = [...text.matchAll(ctcRegex)];
        if (matches.length >= 2) {
            return {
                currentCTC: `${matches[0][1]} ${matches[0][2]}`,
                expectedCTC: `${matches[1][1]} ${matches[1][2]}`
            };
        } else if (matches.length === 1) {
            // Try to find both current and expected in different formats
            const currentMatch = text.match(/current.*?(\d+(?:\.\d+)?)\s*(lakh|lakhs|thousand|k|crore)/i);
            const expectedMatch = text.match(/expect.*?(\d+(?:\.\d+)?)\s*(lakh|lakhs|thousand|k|crore)/i);
            
            if (currentMatch && expectedMatch) {
                return {
                    currentCTC: `${currentMatch[1]} ${currentMatch[2]}`,
                    expectedCTC: `${expectedMatch[1]} ${expectedMatch[2]}`
                };
            }
        }
        return {};
    };

    const extractAvailability = (text) => {
        const daysRegex = /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i;
        const timeRegex = /(\d{1,2})\s*(am|pm|afternoon|morning|evening)/i;
        
        const dayMatch = text.match(daysRegex);
        const timeMatch = text.match(timeRegex);
        
        if (dayMatch) {
            let availability = dayMatch[1];
            if (timeMatch) {
                availability += ` at ${timeMatch[0]}`;
            }
            return { availability };
        }
        return {};
    };

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Cancel any ongoing speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;
            
            utterance.onend = () => {
                // Auto-start listening for user response (except for ending messages)
                if (currentStep >= 0 && currentStep < conversationFlow.length - 1) {
                    setTimeout(() => {
                        startListening();
                    }, 1000);
                }
            };
            
            window.speechSynthesis.speak(utterance);
            synthesisRef.current = utterance;
        }
    };

    const startVoiceTest = () => {
        setLog([]);
        setCurrentStep(0);
        
        // Start with greeting
        const greeting = conversationFlow[0];
        setLog([{
            type: 'bot',
            text: greeting,
            timestamp: new Date().toLocaleTimeString()
        }]);
        
        speakText(greeting);
        setCurrentStep(1);
    };

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const clearLog = () => {
        setLog([]);
        setCurrentStep(0);
        window.speechSynthesis.cancel();
    };

    return (
        <div className="voice-test">
            <h2>Voice Agent Simulator</h2>
            
            <div className="voice-controls">
                <button onClick={startVoiceTest} disabled={isListening}>
                    Start Voice Test
                </button>
                <button onClick={startListening} disabled={isListening || currentStep <= 0}>
                    {isListening ? 'Listening...' : 'Listen'}
                </button>
                <button onClick={stopListening} disabled={!isListening}>
                    Stop Listening
                </button>
                <button onClick={clearLog}>
                    Clear Log
                </button>
            </div>

            <div className="candidate-info">
                <h4>Test Candidate Info:</h4>
                <p>Name: {candidateData.name}</p>
                <p>Job: {candidateData.jobTitle}</p>
                <p>Company: {candidateData.company}</p>
            </div>

            <div className="conversation-log">
                <h3>Conversation Log</h3>
                <div className="log-container">
                    {log.length === 0 ? (
                        <p>Click "Start Voice Test" to begin the conversation.</p>
                    ) : (
                        log.map((entry, index) => (
                            <div key={index} className={`log-entry ${entry.type}`}>
                                <div className="log-header">
                                    <span className="speaker">
                                        {entry.type === 'user' ? 'Candidate' : entry.type === 'bot' ? 'Voice Agent' : 'System'}
                                    </span>
                                    <span className="timestamp">{entry.timestamp}</span>
                                    {entry.confidence && (
                                        <span className="confidence">
                                            Confidence: {(entry.confidence * 100).toFixed(1)}%
                                        </span>
                                    )}
                                </div>
                                <div className="log-text">{entry.text}</div>
                                {entry.extractedData && Object.keys(entry.extractedData).length > 0 && (
                                    <div className="extracted-data">
                                        <strong>Extracted:</strong>
                                        <pre>{JSON.stringify(entry.extractedData, null, 2)}</pre>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="debug-info">
                <h4>Debug Info</h4>
                <p>Current Step: {currentStep}</p>
                <p>Is Listening: {isListening ? 'Yes' : 'No'}</p>
                <p>Speech Recognition: {recognitionRef.current ? 'Available' : 'Not Available'}</p>
                <p>Speech Synthesis: {'speechSynthesis' in window ? 'Available' : 'Not Available'}</p>
            </div>
        </div>
    );
};

export default VoiceTest;