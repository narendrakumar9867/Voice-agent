const { Job, Candidate, Appointment, Conversation } = require("../models/user_model.js");

const addJob = async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json(job);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

const listJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll(); // Removed req.body - findAll doesn't need it
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addCandidate = async (req, res) => {
    try {
        const { name, phone, current_ctc, expected_ctc, notice_period, experience } = req.body;

        if( !name || !phone || !current_ctc || !expected_ctc || !notice_period || !experience) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const candidate = await Candidate.create({
            name,
            phone,
            current_ctc,
            expected_ctc,
            notice_period,
            experience
        });
        return res.status(201).json({ msg: "candidate added successfully", candidate });
    } catch (err) {
        res.status(500).json({ msg: "error adding candidate", error: err.message});
    }
};

const getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.findAll(); // Removed req.body
        return res.status(200).json(candidates);
    } catch (error) {
        return res.status(500).json({ msg: "error fetching candidates", error: error.message });
    }
}

const bookAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.create(req.body);
        res.status(201).json(appointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addConversations = async (req, res) => {
    try {
        const conversation = await Conversation.create(req.body);
        res.status(201).json(conversation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    addJob,
    listJobs,
    addCandidate,
    getCandidates,
    bookAppointment,
    addConversations
};