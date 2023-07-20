require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 3200;

// create the express server, 
const app = express();

app.listen(port, () => console.log(`Server listening on port ${port}`));