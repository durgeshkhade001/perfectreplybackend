console.clear();

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const http = require("http"); // Import http module
const { Server } = require("socket.io"); // Import socket.io

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Server is running");
});

const server = http.createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("message", (msg) => {
    console.log("message: " + msg);
    io.emit("message", msg);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
