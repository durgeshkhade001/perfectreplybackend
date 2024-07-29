const Chat = require("../models/chat");

const create_new_chat = (req, res) => { 
  const { message } = req.body;
  console.log(message);
  res.send("Chat created");
};

module.exports = {
  create_new_chat,
};
