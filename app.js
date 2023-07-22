require("dotenv").config();
const connectToDb = require("./utils/connectToDb");
const createServer = require("./utils/createServer");
const mongoose = require("mongoose");
const port = process.env.PORT || 3200;

connectToDb();

// create the express server, 
const app = createServer();

mongoose.connection.once("open", () => {
  app.listen(port, () => console.log(`Server running on port ${port}`));
})