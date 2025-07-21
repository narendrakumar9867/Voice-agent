const { validateCTC, validateNoticePeriod } = require("./validate.js");
const chrono = require("chrono-node");

const processInput = async (userInput, step, userName, job) => {
    let nextStep = step;
    let response = "";

    switch (step) {
        case 0:
            response = `Hello ${userName}, this is XYZ company regarding a ${job.title} opportunity. Are you interested in this role?`;
            nextStep = 1;
            break;
        case 1:
            if(userInput.toLowerCase().includes("yes")) {
                response = "What is your current notice period?";
                nextStep = 2;
            } else {
                response = "Okay, have a nice day!";
                nextStep = -1;
            }
            break;
        case 2:
            const noticePeriod = validateNoticePeriod(userInput);
            if(noticePeriod) {
                response = "Can you share your current and expected CTC?";
                nextStep = 3;
            } else {
                response = "Sorry, I didn't understand. Can you repeat your notice period?";
            }
            break;
        case 3:
            const { currentCTC, expectedCTC } = validateCTC(userInput);
            if(currentCTC && expectedCTC) {
                response = "Thank you! When are you available for an interview next week?";
                nextStep = 4;
            } else {
                response = "Could you repeat that? I need both current and expected CTC.";
            }
            break;
        case 4:
            const interviewDate = chrono.parseDate(userInput);
            if(interviewDate) {
                response = `We've scheduled your interview on ${interviewDate.toDateString()}. Is that correct?`;
                nextStep = 5;
            } else {
                response = "Can you specify a date for your interview next week?";
            }
            break;
        case 5:
            if(userInput.toLowerCase().includes("yes")) {
                response = "Your interview is confirmed! Thank you.";
                nextStep = -1;
            } else {
                response = "Okay, let's reschedule. When would you like the interview?";
                nextStep = 4;
            }
            break;

        default:
            response = "I didn't understand that. Can you please repeat?";
    }

    return { response, nextStep };
};

module.exports = processInput;