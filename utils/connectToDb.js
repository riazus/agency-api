const mongoose = require("mongoose");

const connectMongoDB = async () => {
	try {
		await mongoose.connect(String(process.env.DATABASE_URI), {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	} catch (err) {
		console.error(err);
	}
};

module.exports = connectMongoDB;