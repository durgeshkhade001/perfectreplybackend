// server.js
console.clear();

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const chatRoutes = require("./routes/chatRoutes");
const socketManager = require("./utils/socketManager");

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
const server = http.createServer(app);
socketManager.init(server);

const dbURI = process.env.MONGODB_URI;
mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(3000, () => {
      console.log("Server is running on port 3000\n" + "-".repeat(30));
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/chat", chatRoutes);

app.use((req, res) => {
  res.status(404).send("Page not found");
});
