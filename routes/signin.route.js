const express = require("express");
const router = express.Router();
const signinController = require("../controllers/signin.controller");

router.post("/candidate", signinController.createNewCandidate);
// POST /candidate - Create a new candidate
// Body parameters: email, password
// Success: 201 Created
// Error: 400 Bad Request if the email has an invalid format

router.post("/agent", signinController.createNewAgent);
// POST /agent - Create a new agent
// Body parameters: email, password
// Success: 201 Created
// Error: 400 Bad Request if the email has an invalid format

module.exports = router;
