const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/", authController.authUser);
// POST / - Authenticate a user, generate access and refresh tokens.
// Request body parameters: email, password
// On success: 200 OK
// Response body: { accessToken }
// Response cookie: jwt (refresh_token)
// Error: 401 Unauthorized if the user with this email and password is not in the database.
// Error: 400 Bad Request if body parameters are missing.

module.exports = router;
