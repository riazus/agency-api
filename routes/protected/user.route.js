const express = require("express");
const router = express.Router();
const userController = require("../../controllers/protected/user.controller");

router.get("/", userController.getAllUsers);
// GET / - Get all users
// Authorization: Set the access token in the Authorization header as a Bearer token
// Success: 200 OK, Response body: [User] (sensitive data and assets removed)
// No users found: 204 No Content
// Error: 403 Forbidden (invalid access token)

router.get("/me", userController.getMyProfile);
// GET /me - Get my user info
// Authorization: Set the access token in the Authorization header as a Bearer token
// Success: 200 OK, Response body: User (sensitive data removed)
// Error: 403 Forbidden (invalid access token)

router.get("/:id", userController.getUserById);
// GET /:id - Get a user by ID
// Authorization: Set the access token in the Authorization header as a Bearer token
// Success: 200 OK, Response body: User (sensitive data and assets removed)
// User not found: 204 No Content
// Error: 403 Forbidden (invalid access token)

module.exports = router;
