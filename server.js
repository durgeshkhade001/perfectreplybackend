console.log('\x1Bc');

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const socketManager = require("./utils/socketManager");
const chatRoutes = require("./routes/chatRoutes");
const agentRoutes = require("./routes/agentRoutes");
const teamRoutes = require("./routes/teamRoutes");
const attributeRoutes = require("./routes/attributeRoutes");
const ticketTypeRoutes = require("./routes/ticketTypeRoutes");
const emailAuthRoutes = require("./routes/emailAuthRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const emailChatRoutes = require("./routes/emailChatRoutes");
const articleRoutes = require("./routes/articleRoutes");
const helpCenterRoutes = require("./routes/helpCenterRoutes");
const waChatRoutes = require("./routes/waChatRoutes");
const WaLinkRoutes = require("./routes/waLinkRoutes");
const EmailAuth = require("./models/emailAuth");
const { listenToEmailInfinite } = require("./utils/emailHandler");

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
app.use("/tickettype", ticketTypeRoutes);
app.use("/ticket", ticketRoutes);
app.use("/emailauth", emailAuthRoutes);
app.use("/emailchat", emailChatRoutes);
app.use("/article", articleRoutes);
app.use("/helpcenter", helpCenterRoutes);
app.post("/wachat", waChatRoutes);
app.use("/walink", WaLinkRoutes);

app.use((req, res) => {
  res.status(404).send("Route not found");
});







// rest server initialization

async function startEmailListening() {
  try {
    const emailAuths = await EmailAuth.find({ status: "verified" });
    for (const emailAuth of emailAuths) {
      listenToEmailInfinite(emailAuth);
    }
  } catch (error) {
    console.error("Error starting email listening:", error.message);
  }
}

startEmailListening();