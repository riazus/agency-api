const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
	},
	password: { type: String, required: true },
	user_type: { type: String, enum: ["candidate", "agent"], required: true },
	refresh_token: { type: String, default: "" }
});

module.exports = mongoose.model("User", UserSchema);
