const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
	data: { type: Buffer, required: true },
	mime_type: { type: String, required: true },
});

module.exports = ImageSchema;