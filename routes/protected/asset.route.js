const express = require("express");
const router = express.Router();
const verifyUserType = require("../../middleware/verifyUserType");
const assetsController = require("../../controllers/protected/asset.controller");
const upload = require("../../utils/imageUpload")();

router.get("/", assetsController.getAllAssets);
// GET / - Get all assets
// Authorization: Set the access token in the Authorization header as a Bearer token
// Success: 200 OK, Response body: [Asset]
// No assets found: 204 No Content
// Error: 403 Forbidden (invalid access token)

router.post(
	"/",
	verifyUserType("agent"),
	upload.array("asset_photos", 5),
	assetsController.createNewAsset
);
// POST / - Create a new asset (agent only)
// Authorization: Set the access token in the Authorization header as a Bearer token
// Attach optional images
// Body parameters: title, address, number_of_rooms (optional)
// Success: 201 Created, Response body: Asset
// Error: 403 Forbidden (invalid access token), 400 Bad Request (missing body parameters)

router.get("/agency/:id", assetsController.getAssetsByAgency);
// GET /agency/:id - Get all assets of the agency with id :id
// Authorization: Set the access token in the Authorization header as a Bearer token
// Success: 200 OK, Response body: [Asset]
// No assets found: 204 No Content
// Error: 403 Forbidden (invalid access token), 404 Not Found (agency not found), 400 Bad Request (missing url parameters)

router.get(
	"/myApplieds",
	verifyUserType("candidate"),
	assetsController.getUserAssets
);
// GET /myApplieds - Get all assets applied by the user (candidate only)
// Authorization: Set the access token in the Authorization header as a Bearer token
// Success: 200 OK, Response body: [Asset]
// No assets found: 204 No Content
// Error: 403 Forbidden (invalid access token)

router.put(
	"/apply/:id",
	verifyUserType("candidate"),
	assetsController.applyToAssetId
);
// PUT /apply/:id - Apply to the asset with id in url params (candidate only)
// Authorization: Set the access token in the Authorization header as a Bearer token
// Success: 200 OK, Response body: { message: String }

router.get("/myAssets", verifyUserType("agent"), assetsController.getUserAssets);
// GET /myAssets - Get all assets created by the user (agent only)
// Authorization: Set the access token in the Authorization header as a Bearer token
// Success: 200 OK, Response body: [Asset]
// No assets found: 204 No Content
// Error: 403 Forbidden (invalid access token)

router.get("/:id", assetsController.getAssetById);
// GET /:id - Get the asset with a specific id
// Authorization: Set the access token in the Authorization header as a Bearer token
// Success: 200 OK, Response body: Asset
// Error: 403 Forbidden (invalid access token), 404 Not Found (asset not found), 400 Bad Request (missing url parameters)

router.delete(
	"/:id",
	verifyUserType("agent"),
	assetsController.deleteAssetById
);
// DELETE /:id - Delete the asset with a specific id (agent only)
// Authorization: Set the access token in the Authorization header as a Bearer token
// Success: 200 OK, Response body: { message: String }
// Error: 403 Forbidden (invalid access token or not the asset creator), 404 Not Found (asset not found), 400 Bad Request (missing url parameters)

router.put("/:id", verifyUserType("agent"), assetsController.modifyAssetById);
// PUT /:id - Modify the asset with a specific id (agent only)
// Authorization: Set the access token in the Authorization header as a Bearer token
// Attach multiple optional images
// Body parameters: title (optional), address (optional), number_of_rooms (optional)
// Success: 200 OK, Response body: Asset
// Error: 403 Forbidden (invalid access token or not the asset creator), 404 Not Found (asset not found), 400 Bad Request (missing url parameters)

module.exports = router;
