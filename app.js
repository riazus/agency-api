const express = require("express");
const connectToDb = require("./utils/connectToDb");
const mongoose = require("mongoose");
require("dotenv").config();
const port = process.env.PORT || 3200;

connectToDb();

// create the express server, 
const app = express();

mongoose.connection.once("open", () => {
  app.listen(port, () => console.log(`Server running on port ${port}`));
})