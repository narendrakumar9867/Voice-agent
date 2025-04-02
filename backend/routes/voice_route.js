const express = require("express");
const voiceAgent = require("../services/voice_agent.js");
const router = express.Router();

router.post("/voice-interaction", async (req, res) => {
    const { audioFilePath } = req.body;
    try {
        await voiceAgent(audioFilePath);
        res.json({ msg: "Voice interaction completed successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

module.exports = router;
