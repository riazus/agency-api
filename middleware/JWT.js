const jwt = require("jsonwebtoken");

const handleJWT = (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;

	if (!authHeader){
    return res.sendStatus(403);
  }

	const token = authHeader.split(" ")[1];
  
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) {
			return res.sendStatus(403);
		}

		req.email = decoded.UserInfo.username;
		req.id = decoded.UserInfo.id;
		req.user_type = decoded.UserInfo.user_type;

		next();
	});
};

module.exports = handleJWT;
