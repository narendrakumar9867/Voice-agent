const fs = require('fs');
const { Readable } = require('stream');
const vosk = require('vosk');
const record = require('node-record-lpcm16');

const MODEL_PATH = 'vosk-model-small-en-us-0.15';
vosk.setLogLevel(0);

const model = new vosk.Model(MODEL_PATH);
const recognizer = new vosk.Recognizer({ model: model, sampleRate: 16000 });

const speechText = () => {
    return new Promise((resolve) => {
        const mic = record.start({
            sampleRate: 16000,
            threshold: 0,
            verbose: false,
            recordProgram: 'sox',
        });

        mic.on("data", (chunk) => {
            if(recognizer.acceptWaveform(chunk)) {
                const result = JSON.parse(recognizer.result());
                resolve(result.text);
                record.stop();
            }
        });
    });
}

module.exports = {
    speechText
};
