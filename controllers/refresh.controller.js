const User = require("../models/User");
const jwt = require("jsonwebtoken");

const refreshAccessToken = async (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) {
		return res.sendStatus(401);
	}

	const refresh_token = cookies.jwt;
	const foundUser = await User.findOne({
		refresh_token: refresh_token,
	}).exec();

	if (!foundUser) return res.sendStatus(403);
	jwt.verify(
		refresh_token,
		process.env.REFRESH_TOKEN_SECRET,
		(err, decoded) => {
			if (err || foundUser._id != decoded.id) {
				return res.sendStatus(403);
			} 
			
			const accessToken = jwt.sign(
				{
					UserInfo: {
						id: foundUser._id,
						email: foundUser.email,
						user_type: foundUser.user_type,
					},
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: "2m" }
			);
			res.json({ accessToken });
		}
	);
};

module.exports = { refreshAccessToken };
