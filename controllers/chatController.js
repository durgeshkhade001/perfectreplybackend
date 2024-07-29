const Chat = require("../models/chat");
const Agent = require("../models/agent");
const { emitEvent } = require("../utils/socketManager");

const createMessage = (type, idKey, id, message) => ({
  [idKey]: id,
  type,
  message,
  createdAt: new Date().toISOString(),
});

const create_new_chat = async (req, res) => {
  try {
    const chat = new Chat();
    await chat.save();
    res.status(200).send({ chatId: chat._id });
  } catch (error) {
    res.status(500).send({ error: "Failed to create chat" });
  }
};

const create_chat_reply = async (req, res) => {
  const { agentToken, contactId, chatId, message } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).send({ error: "Chat not found" });

    let messageObj;
    if (agentToken) {
      const agent = await Agent.findOne({ tokens: agentToken });
      if (!agent) return res.status(400).send({ error: "Invalid token" });
      messageObj = createMessage("AgentReply", "agentid", agent._id, message);
    } else if (contactId) {
      messageObj = createMessage("ContactReply", "contactId", contactId, message);
    } else {
      return res.status(400).send({ error: "Invalid request" });
    }

    chat.thread.push(messageObj);
    await chat.save();

    emitEvent("chat_" + chatId, messageObj);
    res.status(200).send();
  } catch (error) {
    res.status(500).send({ error: "Failed to create chat reply" });
  }
};

const get_chat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).send({ error: "Chat not found" });
    res.status(200).send(chat);
  } catch (error) {
    res.status(500).send({ error: "Failed to get chat" });
  }
};

module.exports = {
  create_new_chat,
  create_chat_reply,
  get_chat,
};
