const Chat = require("../models/chat");
const { emitEvent } = require("../utils/socketManager");

function create_user_reply_message(userid, message) {
  return {
    userid,
    type: "UserReply",
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
  const { agentToken, chatId, message } = req.body;

  const chat = await Chat.findById(chatId);
  if (!chat) return res.status(404).send({ error: "Chat not found" });

  let messageObj;
  if (agentToken) {
    messageObj = create_agent_reply_message(agentToken, message);
  } else {
    messageObj = create_user_reply_message("unknownUser", message);
  }

  chat.thread.push(messageObj);
  await chat.save();

  emitEvent("chat_" + chatId, messageObj);
  res.status(200).send();
};

module.exports = {
  create_new_chat,
  create_chat_reply,
};
