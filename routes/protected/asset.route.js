const express = require("express");
const router = express.Router();
const assetController = require("../../controllers/protected/asset.controller");
const multer = require("multer");
const path = require("path");

router.get("/", assetController.getAllAssets);

router.get("/my", assetController.getUserAssets);

router.get("/:id", assetController.getAssetById);

const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "img"),
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
})

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
  },
  limits: {
    fileSize: 1024 * 1024
  }
})

router.post(
	"/",
	upload.array("asset_images", 10),
	assetController.createNewAsset
);

module.exports = router;