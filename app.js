require("dotenv").config();
const express = require("express");
const handleJWT = require("./middleware/JWT");
const connectToDb = require("./utils/connectToDb");
const cors = require("cors");
const { corsConfig } = require("./utils/corsConfig");
const mongoose = require("mongoose");
const port = process.env.PORT || 3200;

connectToDb();

// create the express server, 
const app = express();

app.use(handleJWT);

app.use(cors(corsConfig));

mongoose.connection.once("open", () => {
  app.listen(port, () => console.log(`Server running on port ${port}`));
})