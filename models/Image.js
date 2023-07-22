const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: { type: String, unique: true, required: true }
});

module.exports = mongoose.model("Image", ImageSchema);