const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const { promisify } = require("util");

process.env.GOOGLE_APPLICATION_CREDENTIALS = "D:\\Projects\\service-account.json";

const client = new textToSpeech.TextToSpeechClient();

const textToSpeechConvert = async (text) => {
  try {
    const request = {
      input: { text },
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MP3" },
    };

    const [response] = await client.synthesizeSpeech(request);
    const writeFile = promisify(fs.writeFile);
    await writeFile("output.mp3", response.audioContent, "binary");

    console.log("Audio content written to file: output.mp3");
  } catch (error) {
    console.error("Error in text-to-speech:", error.message);
  }
};

module.exports = {
    textToSpeechConvert
};

