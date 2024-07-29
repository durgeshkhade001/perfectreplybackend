const Chat = require("../models/chat");
const { emitEvent } = require("../utils/socketManager");


const create_new_chat = (req, res) => { 
  // 
  const chat = new Chat();
  const chatId = chat._id;
  res.send({ chatId });
};

const create_chat_reply = (req, res) => {
  const { chatId, message } = req.body;
  emitEvent("chat_"+chatId, message);
  res.send("Message sent");
};

module.exports = {
  create_new_chat,
  create_chat_reply
};
