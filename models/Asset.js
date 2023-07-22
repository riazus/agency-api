const mongoose = require("mongoose");
const ImageSchema = require("./Image");
const Schema = mongoose.Schema;

const AssetSchema = new Schema({
	title: { type: String, required: true },
	address: { type: String, required: true },
	number_of_rooms: {
		type: Number,
		min: [0, "The numbers of rooms have to be positive"],
		required: true,
	},
	images: [
		{
			type: Schema.Types.ObjectId,
			ref: "Image"
		}
	]
});

module.exports = mongoose.model("Asset", AssetSchema);
