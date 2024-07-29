const Chat = require("../models/chat");
const { emitEvent } = require("../utils/socketManager");

function create_contact_reply_message(contactId, message) {
  return {
    contactId,
    type: "ContactReply",
    message,
    created: new Date().toISOString(),
  };
}

function create_agent_reply_message(agentid, message) {
  return {
    agentid,
    type: "AgentReply",
    message,
    created: new Date().toISOString(),
  };
}

const create_new_chat = async (req, res) => {
  const chat = new Chat();
  chat.save();
  const chatId = chat._id;
  res.status(200).send({ chatId });
};

const create_chat_reply = async (req, res) => {
  const { agentToken, contactId, chatId, message } = req.body;

  const chat = await Chat.findById(chatId);
  if (!chat) return res.status(404).send({ error: "Chat not found" });

  let messageObj;
  if (agentToken) {
    messageObj = create_agent_reply_message(agentToken, message);
  } else if (contactId) {
    messageObj = create_contact_reply_message(contactId, message);
  } else {
    return res.status(400).send({ error: "Invalid request" });
  }

  chat.thread.push(messageObj);
  await chat.save();

  emitEvent("chat_" + chatId, messageObj);
  res.status(200).send();
};


const get_chat = async (req, res) => {
  const chatId = req.params.id;
  const chat = await Chat.findById(chatId);
  if (!chat) return res.status(404).send({ error: "Chat not found" });
  res.status(200).send(chat);
};

module.exports = {
  create_new_chat,
  create_chat_reply,
  get_chat
};
