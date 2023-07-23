const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Image = require("./Image");

const AgencySchema = new Schema({
	name: { type: String, required: true },
	logo: Image,
	created_by: { 
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	agents: [{ 
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	assets: { type: [{ 
		type: Schema.Types.ObjectId,
		ref: 'Asset'
	}], default: [] },
});

module.exports = mongoose.model("Agency", AgencySchema);
