const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const createNewUser = async (req, res, user_type) => {
	const { email, password } = req.body;
	if (!email || !password)
		return res
			.status(400)
			.json({ message: "Email and password are required." });

	//check if the user doesn't already exist
	const userAlreadyExist = await User.findOne({ email: email }).exec();
	if (userAlreadyExist) {
		return res.sendStatus(409); //Conflict	
	}
	
	try {
		// hash and salt the password before we write it on the database
		const hashedSaltPwd = await bcrypt.hash(password, 10);
		const result = await User.create({
			email: email,
			password: hashedSaltPwd,
			user_type: user_type,
		});
		return res.status(201).json({
			success: `New ${user_type} with email: ${email} created!`,
		});
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			return res.status(400).json({ message: err.message });
		} else {
			return res.status(500).json({ message: err.message });
		}
	}
};

const createNewCandidate = async (req, res) => {
	return await createNewUser(req, res, "candidate");
};

const createNewAgent = async (req, res) => {
	return await createNewUser(req, res, "agent");
};

module.exports = { createNewCandidate, createNewAgent };
