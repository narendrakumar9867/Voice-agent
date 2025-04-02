const { exec } = require("child_process");
const fs = require("fs");
const { OpenAI } = require("openai");
require("dotenv").config(); // Load API key from .env file

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Set your OpenAI API key
});

const speechText = async () => {
    return new Promise((resolve, reject) => {
        const outputFile = "audio.wav";

        // Start recording from the microphone
        const rec = exec(`sox -d -r 16000 -c 1 ${outputFile}`, (error) => {
            if (error) reject(error);
        });

        setTimeout(async () => {
            rec.kill(); // Stop recording after 5 seconds

            try {
                const response = await openai.audio.transcriptions.create({
                    file: fs.createReadStream(outputFile),
                    model: "whisper-1",
                });

                fs.unlinkSync(outputFile); // Delete file after processing
                resolve(response.text);
            } catch (error) {
                reject(error);
            }
        }, 5000);
    });
};

module.exports = { speechText };
