const { speechText } = require("./stt.js");
const processInput = require("./dialogue.js");
const { Candidate, Conversation, Job, Appointment } = require("../models/user_model.js");
const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const { promisify } = require("util");

// Set up Google Cloud TTS
process.env.GOOGLE_APPLICATION_CREDENTIALS = "D:\\Projects\\service-account.json";
const client = new textToSpeech.TextToSpeechClient();

// TTS function
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
        return true;
    } catch (error) {
        console.error("Error in text-to-speech:", error.message);
        throw error;
    }
};

let conversationState = {
    step: 0,
    candidateData: {},
    jobId: null,
    userName: "there" // Default name
};

const voiceAgent = async (jobId = 1, candidateName = "there") => {
    try {
        // Initialize conversation state
        conversationState.jobId = jobId;
        conversationState.userName = candidateName;
        conversationState.step = 0;
        conversationState.candidateData = {};

        console.log("Voice agent started...");
        
        // Get the job details for the conversation
        const job = await Job.findByPk(jobId);
        if (!job) {
            throw new Error("Job not found");
        }

        let isConversationActive = true;
        let conversationTranscript = [];

        while (isConversationActive) {
            // Process current step and get AI response
            const { response, nextStep } = await processInput("", conversationState.step, conversationState.userName, job);
            
            console.log("AI Response:", response);
            conversationTranscript.push({ speaker: "AI", message: response });

            // Convert AI response to speech
            await textToSpeechConvert(response);

            // If conversation ended, break
            if (nextStep === -1) {
                isConversationActive = false;
                break;
            }

            // Get user speech input
            console.log("Listening for user response...");
            const userSpeech = await speechText();
            console.log("User said:", userSpeech);
            conversationTranscript.push({ speaker: "User", message: userSpeech });

            // Process user input and update conversation state
            const processResult = await processInput(userSpeech, conversationState.step, conversationState.userName, job);
            conversationState.step = processResult.nextStep;

            // Extract and store candidate data based on the step
            await extractCandidateData(userSpeech, conversationState.step);

            // If conversation ended, break
            if (conversationState.step === -1) {
                isConversationActive = false;
            }
        }

        // Save conversation and candidate data to database
        await saveConversationData(conversationTranscript);

        console.log("Voice interaction completed successfully.");
        return { success: true, message: "Conversation completed" };

    } catch (error) {
        console.error("Voice agent error:", error);
        throw error;
    }
};

const extractCandidateData = async (userInput, step) => {
    const { validateCTC, validateNoticePeriod } = require("../validate.js");
    const chrono = require("chrono-node");

    switch (step) {
        case 2: // Notice period
            const noticePeriod = validateNoticePeriod(userInput);
            if (noticePeriod) {
                conversationState.candidateData.notice_period = noticePeriod;
            }
            break;
        case 3: // CTC
            const { currentCTC, expectedCTC } = validateCTC(userInput);
            if (currentCTC && expectedCTC) {
                conversationState.candidateData.current_ctc = currentCTC;
                conversationState.candidateData.expected_ctc = expectedCTC;
            }
            break;
        case 4: // Interview date
            const interviewDate = chrono.parseDate(userInput);
            if (interviewDate) {
                conversationState.candidateData.interview_date = interviewDate;
            }
            break;
    }
};

const saveConversationData = async (transcript) => {
    try {
        // Create or find candidate
        let candidate;
        if (conversationState.candidateData.current_ctc && conversationState.candidateData.expected_ctc) {
            candidate = await Candidate.create({
                name: conversationState.userName,
                phone: "N/A", // You might want to collect this
                current_ctc: conversationState.candidateData.current_ctc,
                expected_ctc: conversationState.candidateData.expected_ctc,
                notice_period: conversationState.candidateData.notice_period || 0,
                experience: 0 // You might want to collect this
            });
        }

        // Save conversation
        await Conversation.create({
            candidate_id: candidate ? candidate.id : null,
            transcript: JSON.stringify(transcript),
            entities_extracted: JSON.stringify(conversationState.candidateData)
        });

        // Create appointment if interview date was set
        if (candidate && conversationState.candidateData.interview_date) {
            await Appointment.create({
                job_id: conversationState.jobId,
                candidate_id: candidate.id,
                date_time: conversationState.candidateData.interview_date,
                status: "scheduled"
            });
        }

        console.log("Conversation data saved successfully");
    } catch (error) {
        console.error("Error saving conversation data:", error);
    }
};

module.exports = voiceAgent;
