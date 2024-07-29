console.clear();

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const chatRoutes = require("./routes/chatRoutes");

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
const server = http.createServer(app);

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

























// const io = new Server(server);

// io.on("connection", (socket) => {
//   console.log("a user connected");

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });

//   socket.on("message", (msg) => {
//     console.log("message: " + msg);
//     io.emit
