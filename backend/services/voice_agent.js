const textToSpeech = require("./tts.js");
const speechToText = require("./stt.js");
const processInput = require("./dialogue.js");

const voiceAgent = async (audioFilePath) => {
    let step = 0;
    let userResponse = "";

    while (step !== -1) {
        const botReply = await processInput(userResponse, step);
        console.log("Bot: ", botReply.response);

        const ttsFile = await textToSpeech(botReply.response);
        console.log(`Playing ${ttsFile}...`);

        userResponse = await speechToText(audioFilePath);
        console.log("User: ", userResponse);

        step = botReply.nextStep;
    }
};

module.exports = voiceAgent;
