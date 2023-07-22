const User = require("../models/User");

const handleLogout = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204);

	const refresh_token = cookies.jwt;

	const foundUser = await User.findOne({
		refresh_token: refresh_token,
	}).exec();
	if (!foundUser) {
		res.clearCookie("jwt", { httpOnly: true });
		return res.sendStatus(204);
	}
	foundUser.refreshToken = "";

	const result = await foundUser.save();

	res.clearCookie("jwt", {
		httpOnly: true,
		sameSite: "None",
		// secure: true, only serves on https sites
	});
	return res.sendStatus(204);
};

module.exports = { handleLogout };
