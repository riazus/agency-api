const express = require("express");
const router = express.Router();
const logoutController = require("../controllers/logout.controller");

router.get("/", logoutController.handleLogout);
// GET / - Logout user, delete refresh token
// Client should delete the access token
// Success: 204 No Content

module.exports = router;