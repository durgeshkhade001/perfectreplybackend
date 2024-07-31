console.clear();

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const chatRoutes = require("./routes/chatRoutes");
const agentRoutes = require("./routes/agentRoutes");
const teamRoutes = require("./routes/teamRoutes");
const attributeRoutes = require("./routes/attributeRoutes");
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
app.use("/agent", agentRoutes);
app.use("/team", teamRoutes);
app.use("/attribute", attributeRoutes);

app.use((req, res) => {
  res.status(404).send("Route not found");
});
