const multer = require("multer");

const imageUpload = () => {
	const storage = multer.memoryStorage();
	const upload = multer({
		storage: storage,
		limits: {
			fileSize: 12000000, // 12 MB size limit for a file
		},
		fileFilter(req, file, cb) {
			if (!file.originalname.match(/\.(png|jpg|jpeg|webp)$/)) {
				// upload only png, jpg and webp format
				return cb(new Error("Invalid format image"));
			}
			cb(undefined, true);
		},
	});
	return upload;
};

module.exports = imageUpload;
