const validateCTC = (text) => {
    // Look for two numbers in the text (current and expected CTC)
    const numbers = text.match(/(\d+(?:\.\d+)?)\s*(?:lpa|lakhs?|crores?|k)?/gi);
    
    if (numbers && numbers.length >= 2) {
        return { 
            currentCTC: parseFloat(numbers[0].replace(/[^\d.]/g, '')),
            expectedCTC: parseFloat(numbers[1].replace(/[^\d.]/g, ''))
        };
    } else if (numbers && numbers.length === 1) {
        // If only one number, ask for clarification
        return { currentCTC: null, expectedCTC: null };
    }
    
    return { currentCTC: null, expectedCTC: null };
};

const validateNoticePeriod = (text) => {
    const noticePattern = /\b(\d+)\s*(days?|weeks?|months?)\b/i;
    const matches = text.match(noticePattern);

    if (matches) {
        const number = parseInt(matches[1]);
        const unit = matches[2].toLowerCase();
        
        // Convert to days for consistency
        let days = number;
        if (unit.includes('week')) {
            days = number * 7;
        } else if (unit.includes('month')) {
            days = number * 30;
        }
        
        return days;
    }
    
    return null;
};

module.exports = {
    validateCTC,
    validateNoticePeriod
};