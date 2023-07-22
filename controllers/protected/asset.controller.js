const User = require("../../models/User");
const Asset = require("../../models/Asset");

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
	const { title, address, number_of_rooms, images } = req?.body;
	if (!title || !number_of_rooms || !address || !images)
		return res.status(400).json({
			// Invalid
			message:
				"title, address, number_of_rooms, images attributes are required for this request.",
		});
  
	const newAsset = {
		title: title,
		address: address,
		number_of_rooms: Number(number_of_rooms),
		created_by: req.id,
		images: images,
	};
  
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
	return res.status(201).send(result);
};

module.exports = {
  getAllAssets,
  getUserAssets,
  getAssetById,
  createNewAsset
};