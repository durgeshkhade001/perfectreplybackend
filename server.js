console.clear();

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const fs = require('fs');
const path = require('path');
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("Server is running");
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
