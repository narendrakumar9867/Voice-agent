const validateCTC = async (text) => {
    const ctcPattern = /(\d+(\.\d+)?)(\s?(LPA|lacs|lakhs|crores|k))/i;
    const matches = text.match(ctcPattern);

    if(matches) {
        return { currentCTC: matches[0], expectedCTC: matches[1] };
    }
    return {};
};

const validateNoticePeriod = async (text) => {
    const noticePattern = /\b(\d+)\s?(days?|weeks?|months?)\b/i;
    const matches = text.match(noticePattern);

    return matches ? matches[0] : null;
};

module.exports = {
    validateCTC,
    validateNoticePeriod
};

