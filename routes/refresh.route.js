const express = require("express");
const router = express.Router();
const refreshController = require("../controllers/refresh.controller");

router.get("/", refreshController.refreshAccessToken);
// GET / - Refresh access token with a valid refresh token
// Response: 200 OK, Response body: { accessToken }
// Error: 401 Unauthorized if the JWT refresh token is missing in the cookie
// Error: 403 Forbidden if the JWT refresh token is invalid

module.exports = router;
