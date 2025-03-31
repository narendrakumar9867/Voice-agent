const express = require("express");
const { addJob, listJobs, addCandidate, getCandidates, bookAppointment, addConversations } = require("../controllers/user_controller.js"); 

const router = express.Router();

router.post("/job", addJob);
router.get("/jobs", listJobs);

router.post("/candidate", addCandidate);
router.get("/candidates", getCandidates);

router.post("/appointment", bookAppointment);

router.post("/conversation", addConversations);

module.exports = router;