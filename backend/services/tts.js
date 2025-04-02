import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import { promisify } from 'util';

const client = new textToSpeech.TextToSpeechClient();

const TexttoSpeech = async (text) => {
    const request = {
        input: { text },
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request);
    const writeFile = promisify(fs.writeFile);
    await writeFile("output.mp3", response.audioContent, 'binary');

    console.log('Audio content written to file: output.mp3');
};

export default TexttoSpeech;
