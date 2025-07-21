const express = require("express");
const voiceAgent = require("../services/voice_agent.js");
const router = express.Router();

router.post("/voice-interaction", async (req, res) => {
    const { jobId, candidateName } = req.body;
    try {
        const result = await voiceAgent(jobId || 1, candidateName || "there");
        res.json({ 
            msg: "Voice interaction completed successfully.",
            result: result
        });
    } catch (error) {
        console.error("Voice interaction error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;