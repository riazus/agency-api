const express = require("express");
const router = express.Router();
const verifyUserType = require("../../middleware/verifyUserType");
const agencyController = require("../../controllers/protected/agency.controller");
const upload = require("../../utils/imageUpload")();

router.get("/", agencyController.getAllAgencies);
// GET / - Get all agencies
// Authorization: Set the access token in the Authorization header as a Bearer token
// Success: 200 OK, Response body: [Agency]
// No agencies found: 204 No Content
// Error: 403 Forbidden (invalid access token)

router.post(
	"/",
	verifyUserType("agent"),
	upload.single("logo"),
	agencyController.createNewAgency
);
// POST / - Create a new agency (agent only)
// Authorization: Set the access token in the Authorization header as a Bearer token
// Attach an optional single image
// Body parameters: name
// Success: 201 Created, Response body: Agency
// Error: 403 Forbidden (invalid access token), 400 Bad Request (missing body parameters)

router.post(
	"/register/:id",
	verifyUserType("agent"),
	agencyController.registerToAgencyId
);
// POST /register/:id - Register to the agency with id in url params (agent only)
// Authorization: Set the access token in the Authorization header as a Bearer token
// Success: 200 OK, Response body: { message: String }
// Error: 403 Forbidden (invalid access token), 404 Not Found (agency not found), 400 Bad Request (missing url parameters)

router.get("/my", verifyUserType("agent"), agencyController.getMyAgency);
// GET /my - Get the agency of the user (agent only)
// Authorization: Set the access token in the Authorization header as a Bearer token
// Success: 200 OK, Response body: Agency
// Error: 403 Forbidden (invalid access token), 404 Not Found (agency not found)

router.get("/:id", agencyController.getAgencyById);
// GET /:id - Get the agency with a specific id
// Authorization: Set the access token in the Authorization header as a Bearer token
// Success: 200 OK, Response body: Agency
// Error: 403 Forbidden (invalid access token), 404 Not Found (agency not found), 400 Bad Request (missing url parameters)

router.delete(
	"/:id",
	verifyUserType("agent"),
	agencyController.deleteAgencyById
);
// DELETE /:id - Delete the agency with a specific id (agent only)
// Authorization: Set the access token in the Authorization header as a Bearer token
// Success: 200 OK, Response body: { message: String }
// Error: 403 Forbidden (invalid access token or not the agency creator), 404 Not Found (agency not found), 400 Bad Request (missing url parameters)

router.put("/:id", verifyUserType("agent"), agencyController.modifyAgencyById);
// PUT /:id - Modify the agency with a specific id (agent only)
// Authorization: Set the access token in the Authorization header as a Bearer token
// Attach an optional single image
// Body parameters: name (optional)
// Success: 200 OK, Response body: Agency
// Error: 403 Forbidden (invalid access token or not the agency creator), 404 Not Found (agency not found), 400 Bad Request (missing url parameters)

module.exports = router;
