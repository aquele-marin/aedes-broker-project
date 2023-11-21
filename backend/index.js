const express = require("express");
require("./src/database/mongoose");
const Test = require("./src/models/test");
const cors = require("cors");

const PORT = 3000;
const HOST = "0.0.0.0";

const app = express();
app.use(cors());

// API
app.get("/", async (req, res) => {
  console.log("Received request for URL: " + req.url);

  const test = await Test.find();
  console.log(test);

  return res.send(test);
});

app.listen(PORT, HOST);
