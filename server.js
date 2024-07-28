console.clear();

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
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

























const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, 'models', 'customers', '__customer1', 'users.json');
let users = require(usersFilePath);

app.post("/newconversation", (req, res) => {
  const { userid, message } = req.body;
  if (users[userid]) {
    users[userid]["status"] = "online";
    console.log(users[userid]);
    
    // Write the updated users object back to the JSON file
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        res.status(500).send('Error updating user status');
      } else {
        res.send('User status updated successfully');
      }
    });
  } else {
    res.send("User not found");
  }
});






































server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
