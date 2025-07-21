import VoiceTest from "../components/VoiceTest.js";

const VoiceSimulator = () => {
    return (
        <div className="voice-simulator">
            <div className="simulator-header">
                <h1>Voice Agent Simulator</h1>
                <p>Test the voice agent functionality using browser-based Web Speech API</p>
            </div>
            
            <div className="simulator-info">
                <div className="info-card">
                    <h3>How it works</h3>
                    <ul>
                        <li>Click "Start Voice Test" to begin the conversation</li>
                        <li>The agent will greet you and ask predefined questions</li>
                        <li>Speak clearly when prompted</li>
                        <li>The system will extract entities like CTC, notice period, and availability</li>
                        <li>Review the conversation log and extracted data</li>
                    </ul>
                </div>
                
                <div className="info-card">
                    <h3>Browser Requirements</h3>
                    <ul>
                        <li>Chrome/Edge: Full support for Speech Recognition & Synthesis</li>
                        <li>Firefox: Limited support</li>
                        <li>Safari: Speech Synthesis only</li>
                        <li>Microphone permission required</li>
                    </ul>
                </div>
            </div>

            <VoiceTest />
        </div>
    );
};

export default VoiceSimulator;