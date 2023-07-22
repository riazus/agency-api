const express = require("express");
const router = express.Router();
const assetController = require("../../controllers/protected/asset.controller");

router.get("/", assetController.getAllAssets);

router.get("/my", assetController.getUserAssets);

router.get("/:id", assetController.getAssetById);

router.post("/", assetController.createNewAsset);

module.exports = router;