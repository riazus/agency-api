require("dotenv").config();
const express = require("express");
const handleJWT = require("../middleware/JWT");
const cors = require("cors");
const { corsConfig } = require("./corsConfig");
const cookieParser = require("cookie-parser");

const createServer = () => {
	// init the express server
	const server = express();

	// Handle options credentials check and fetch cookies credentials requirement
	server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });

	// Handle Cors middleware
	server.use(cors(corsConfig));

	// middleware to handle urlencoded data, form data:
	server.use(express.urlencoded({ extended: false }));

	// middleware for json
	server.use(express.json());

	// middleware for parse the cookie attach to the request
	server.use(cookieParser());

	//public routes
	server.use("/signin", require("../routes/signin.route"));
	server.use("/auth", require("../routes/auth.route"));
	server.use("/refresh", require("../routes/refresh.route"));
	server.use("/logout", require("../routes/logout.route"));

	//middleware routes
	server.use(handleJWT);

	//protected routes
	server.use("/user", require("../routes/protected/user.route"));
	server.use("/asset", require("../routes/protected/asset.route"));
	server.use("/agency", require("../routes/protected/agency.route"));

	return server;
};

module.exports = createServer;
