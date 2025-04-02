import { useState } from "react";

const VoiceTest = () => {
    const [log, setLog] = useState([]);

    const startVoiceTest = async () => {
        const speechRecognition = new window.SpeechRecognition();
        speechRecognition.start();
        speechRecognition.onresult = (event) => {
            const userSpeech = event.results[0][0].transcript;
            setLog((prev) => [...prev, {user: userSpeech}]);

            const botResponse = "We have scheduled your interview. Is that correct?";
            setLog((prev) => [...prev, {bot: botResponse}]);

            const speech = new SpeechSynthesisUtterance(botResponse);
            window.speechSynthesis.speak(speech);
        };
    };

    return (
        <div>
            <h2>Voice Test</h2>
            <button onClick={startVoiceTest}>Start voice test</button>
            <div>
                {log.map((entry, index) => (
                    <p key={index}>{entry.user ? `User: ${entry.user}` : `Bot: ${entry.bot}`}</p>
                ))}
            </div>
        </div>
    );
};

export default VoiceTest;
