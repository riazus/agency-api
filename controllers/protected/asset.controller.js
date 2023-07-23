const mongoose = require("mongoose");
const User = require("../../models/User");
const Asset = require("../../models/Asset");
const Agency = require("../../models/Agency");

const getAllAssets = async (req, res) => {
  const assets = await Asset.find({});

  if (!assets) {
    return res.status(204).json({message: "No asset found"});
  }

  return res.json(assets);
}

const getUserAssets = async (req, res) => {
  const foundUser = await User.findById(req.id).exec();
  const assets = await Asset.find({_id: {$in: foundUser.assets}});

  if (!assets) {
    return res.status(204).json({message: "No asset found"});
  }

  return res.json(assets);
}

const getAssetById = async (req, res) => {
  if (!req.params?.id) {
    return res.status(400).json({ message: "ID is required" }); // Invalid
  }

  const foundAsset = await Asset.findOne({ _id: req.params.id }).exec();
  if (!foundAsset) {
		return res
			.status(404)
			.json({ message: `Asset ID ${req.params.id} not found` });
	}

	res.json(foundAsset);
}

const createNewAsset = async (req, res) => {
	if (!req?.user_type && req.user_type !== "agent") {
    return res.sendStatus(401);
  }
  
  const { title, address, number_of_rooms } = req?.body;
	if (!title || !number_of_rooms || !address)
		return res.status(400).json({
			// Invalid
			message:
				"title, address, number_of_rooms attributes are required for this request.",
		});
  
	const newAsset = {
		title: title,
		address: address,
		number_of_rooms: Number(number_of_rooms),
		created_by: req.id,
		images: [],
	};

  for (let i in req?.files) {
		const image = {
			mime_type: req.files[i].mimetype,
			data: req.files[i].buffer,
		};
		newAsset.images.push(image);
	}
  
	let result;
	try {
		result = await Asset.create(newAsset);
	} catch (err) {
		console.error(err.message);
		if (err instanceof mongoose.Error.ValidationError) {
			return res.status(400).json({ message: err.message }); // Invalid
		} else {
			return res.status(500).json({ message: err.message });
		}
	}
	const foundUser = await User.findById(req.id).exec();

	if (foundUser.agency) {
		const foundAgency = await Agency.findById(foundUser.agency).exec();
		foundAgency.assets.push(result._id);
		foundAgency.save();
	}

	result.images = [];

	return res.status(201).send(result);
};

const modifyAssetById = async (req, res) => {
	if (!req?.params?.id) {
		return res.status(400).json({ message: "ID is required" }); // Invalid
	}

	const foundAsset = await Asset.findOne({ _id: req.params.id }).exec();
	if (!foundAsset) {
		return res
			.status(404) //Not found
			.json({ message: `Asset ID ${req.params.id} not found` });
	}
	if (foundAsset.created_by != req.id) {
		return res
			.status(403) //Forbidden
			.json({ message: `this user cannot modify this asset` });
	}

	if (req?.body?.title) {
    foundAsset.title = req.body.title;
  }
	if (req?.body?.address) {
    foundAsset.address = req.body.address;
  }
	if (req?.body?.number_of_rooms) {
		foundAsset.number_of_rooms = req.body.number_of_rooms;
  }

  if (req?.files?.length >= 1) {
		const imgArray = [];
		for (let i in req?.files) {
			const image = {
				mime_type: req.files[i].mimetype,
				data: req.files[i].buffer,
			};
			imgArray.push(image);
		}
		foundAsset.images = [...imgArray];
	}

	foundAsset.save();
	res.send(foundAsset);
};

const deleteAssetById = async (req, res) => {
	if (!req?.params?.id) {
		return res.status(400).json({ message: "ID is required" }); // Invalid
	}

	const foundAsset = await Asset.findOne({ _id: req.params.id }).exec();
	if (!foundAsset) {
		return res
			.status(404) //Not found
			.json({ message: `Asset ID ${req.params.id} not found` });
	}
	if (foundAsset.created_by != req.id) {
		return res
			.status(403) //Forbidden
			.json({ message: `this user cannot delete this asset` });
	}

	const result = await Asset.deleteOne({ _id: req?.params?.id });
	res.json(result);
};

const applyToAssetId = async (req, res) => {
	if (!req?.params?.id) {
		return res.status(400).json({ message: "ID is required" }); // Invalid
	}
	const foundAsset = await Asset.exists({ _id: req.params.id });
	if (!foundAsset) {
		return res
			.status(404) //Not found
			.json({ message: `Asset ID ${req.params.id} not found` });
	}

	const foundUser = await User.findById(req.id).exec();
	if (!foundUser.assets.includes(req.params.id)) {
		foundUser.assets.push(req.params.id);
		await foundUser.save();
		res.status(200).send({
			message: `Succesfully apply to asset ID ${req.params.id}`,
		});
	} else {
		res.status(200).send({
			message: `Already apply to asset ID ${req.params.id}`,
		});
	}
};

const getAssetsByAgency = async (req, res) => {
	if (!req?.params?.id) {
		return res.status(400).json({ message: "ID is required" }); // Invalid
	}

	const foundAgency = await Agency.findOne({ _id: req.params.id }).exec();
	if (!foundAgency) {
		return res
			.status(404) //Not found
			.json({ message: `Agency ID ${req.params.id} not found` });
	}

	const assets = await Asset.find({ _id: { $in: foundAgency.assets } });
	if (!assets) {
		return res.status(204).json({ message: "No asset found." });
	}

	res.json(assets);
};

module.exports = {
  getAllAssets,
  getUserAssets,
  getAssetById,
  createNewAsset,
  modifyAssetById,
  deleteAssetById,
  applyToAssetId,
	getAssetsByAgency
};