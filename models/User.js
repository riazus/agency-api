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
	refresh_token: { type: String, default: "" },
	assets: { 
		type: [Schema.Types.ObjectId], 
		ref: 'Asset', 
		default: [] },
	agency: { 
		type: Schema.Types.ObjectId,
		ref: 'Agency'
	}
});

module.exports = mongoose.model("User", UserSchema);
