const mongoose = require("mongoose");
const Agency = require("../../models/Agency");
const User = require("../../models/User");

const createNewAgency = async (req, res) => {
	const { name } = req?.body;
	if (!name)
		return res.status(400).json({
			// Invalid
			message: "name are required for this request.",
		});

	const newAgency = {
		name: name,
		agents: [req.id],
		created_by: req.id,
		logo: undefined,
	};

	if (req?.file) {
		const image = {
			mime_type: req.file.mimetype,
			data: req.file.buffer,
		};
		newAgency.logo = image;
	}

	try {
		const result = await Agency.create(newAgency);
		return res.status(201).json(result);
	} catch (err) {
		console.error(err.message);
		if (err instanceof mongoose.Error.ValidationError) {
			console.log(err.message);
			return res.status(400).json({ message: err.message }); // Invalid
		} else {
			console.log("err", err.message);
			return res.status(500).json({ message: err.message });
		}
	}
};

const getAllAgencies = async (req, res) => {
	const agencies = await Agency.find({});
	if (!agencies) {
    return res.status(204).json({ message: "No agency found." });
  }
	res.json(agencies);
};

const getAgencyById = async (req, res) => {
	if (!req?.params?.id) {
		return res.status(400).json({ message: "ID is required" }); // Invalid
	}
	const foundAgency = await Agency.findOne({ _id: req.params.id }).exec();
	if (!foundAgency) {
		return res
			.status(404)
			.json({ message: `Agency ID ${req.params.id} not found` });
	}
	res.json(foundAgency);
};

const deleteAgencyById = async (req, res) => {
	if (!req?.params?.id) {
		return res.status(400).json({ message: "ID is required" }); // Invalid
	}
	const foundAgency = await Agency.findOne({ _id: req.params.id }).exec();
	if (!foundAgency) {
		return res
			.status(404) //Not found
			.json({ message: `Agency ID ${req.params.id} not found` });
	}
	if (foundAgency.created_by != req.id) {
		return res
			.status(403) //Forbidden
			.json({ message: `this user cannot delete this agency` });
	}
	const result = await Agency.deleteOne({ _id: req?.params?.id });
	res.json(result);
};

const registerToAgencyId = async (req, res) => {
	if (!req?.params?.id) {
		return res.status(400).json({ message: "ID is required" }); // Invalid
	}
	const foundAgency = await Agency.findOne({ _id: req.params.id }).exec();
	if (!foundAgency) {
		return res
			.status(404) //Not found
			.json({ message: `Agency ID ${req.params.id} not found` });
	}
	const foundUser = await User.findById(req.id).exec();
	if (foundAgency.agents.includes(req.id)) {
		foundAgency.agents.push(req.id);
		await foundAgency.save();
		foundUser.agency = foundAgency._id;
		await foundUser.save();
		res.status(200).send({
			message: `Succesfully register to agency ID ${req.params.id}`,
		});
	} else {
		res.status(200).send({
			message: `Already register to agency ID ${req.params.id}`,
		});
	}
};

const getMyAgency = async (req, res) => {
	const foundUser = await User.findById(req.id).exec();

	if (foundUser.agency) {
		const agency = await Agency.findById(foundUser.agency).exec();
		if (!agency) {
			foundUser.agency = undefined;
			foundUser.save();
			return res.status(204).json({ message: "No agency found." });
		} else {
			return res.json(agency);
		}
	}
	return res.status(204).json({ message: "No agency found." });
};

const modifyAgencyById = async (req, res) => {
	if (!req?.params?.id) {
		return res.status(400).json({ message: "ID is required" }); // Invalid
	}
	const foundAgency = await Agency.findOne({ _id: req.params.id }).exec();
	if (!foundAgency) {
		return res
			.status(404) //Not found
			.json({ message: `Agency ID ${req.params.id} not found` });
	}
	if (foundAgency.created_by != req.id) {
		return res
			.status(403) //Forbidden
			.json({ message: `this user cannot delete this agency` });
	}
	if (req?.body?.name) foundAgency.name = req.body.name;

	if (req?.file) {
		const image = {
			mime_type: req.file.mimetype,
			data: req.file.buffer,
		};

		foundAgency.logo = { ...image };
	}
	foundAgency.save();
	res.send(foundAgency);
};

module.exports = {
	getAllAgencies,
	createNewAgency,
	getAgencyById,
	deleteAgencyById,
	registerToAgencyId,
	getMyAgency,
	modifyAgencyById,
};
