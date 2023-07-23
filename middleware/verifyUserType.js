const verifyUserType = (...allowedUserTypes) => {
	return (req, res, next) => {
		if (!req?.user_type) return res.sendStatus(401);

		if ([...allowedUserTypes].includes(String(req?.user_type))) {
		} else {
			return res.sendStatus(401);
		}
		next();
	};
};

module.exports = verifyUserType;
