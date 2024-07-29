const Chat = require("../models/chat");
const Agent = require("../models/agent");
const { emitEvent } = require("../utils/socketManager");
const { authenticateAgent } = require("../utils/authenticateAgent");

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

const create_system_event_message = (message) => ({
  type: "SystemEvent",
  message,
  created: new Date().toISOString(),
});

const create_chat_reply = async (req, res) => {
  const { agentToken, contactId, chatId, message } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).send({ error: "Chat not found" });

    let messageObj;
    if (agentToken) {
      const { error, agent } = await authenticateAgent(agentToken);
      if (error) return res.status(400).send({ error });

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

const create_chat_note = async (req, res) => {
  const { agentToken, chatId, message } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).send({ error: "Chat not found" });

    const { error, agent } = await authenticateAgent(agentToken);
    if (error) return res.status(400).send({ error });

    const messageObj = createMessage("Note", "agentid", agent._id, message);
    chat.thread.push(messageObj);

    if (message.includes("$_mention_agentId_")) {
      const agentId = message.split("$_mention_agentId_")[1].split("_$")[0];
      const mentionedAgent = await Agent.findById(agentId);
      if (mentionedAgent) {
        if (!chat.mentions.includes(mentionedAgent._id)) {
          chat.mentions.push(mentionedAgent._id);
        }
        const systemEventMessage = create_system_event_message(
          `${agent.name} mentioned ${mentionedAgent.name} in this chat`
        );
        chat.thread.push(systemEventMessage);
        emitEvent("chat_" + chatId, systemEventMessage);
      }
    }
    await chat.save();

    emitEvent("chat_" + chatId, messageObj);
    res.status(200).send();
  } catch (error) {
    res.status(500).send({ error: "Failed to create chat note" });
  }
};

const toggle_chat_priority = async (req, res) => {
  const { agentToken, chatId } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).send({ error: "Chat not found" });

    const { error, agent } = await authenticateAgent(agentToken);
    if (error) return res.status(400).send({ error });

    chat.priority = !chat.priority;
    const systemEventMessage = create_system_event_message(
      `${agent.name} ${chat.priority ? "marked" : "unmarked"} this chat as priority`
    );
    chat.thread.push(systemEventMessage);
    await chat.save();

    
    emitEvent("chat_" + chatId, systemEventMessage);
    res.status(200).send();
  } catch (error) {
    res.status(500).send({ error: "Failed to toggle chat priority" });
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

const close_chat = async (req, res) => {
  const { agentToken, chatId } = req.body;

  try {
    let systemEventMessage;
    if(agentToken) {
      const { error, agent } = await authenticateAgent(agentToken);
      if (error) return res.status(400).send({ error });
      systemEventMessage = create_system_event_message(`${agent.name} closed this chat`);
    } else {
      systemEventMessage = create_system_event_message("Chat closed");
    }

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).send({ error: "Chat not found" });
    
    chat.open = false;
    chat.thread.push(systemEventMessage);
    await chat.save();

    emitEvent("chat_" + chatId, systemEventMessage);
    res.status(200).send();
  } catch (error) {
    res.status(500).send({ error: "Failed to close chat" });
  }
};

const get_chats_with_mentions = async (req, res) => {
  const { agentToken } = req.body;

  try {
    const { error, agent } = await authenticateAgent(agentToken);
    if (error) return res.status(400).send({ error });

    const chats = await Chat.find({ mentions: agent._id });
    chats.forEach(chat => {
      chat.thread = [];
    });
    res.status(200).send(chats);
  } catch (error) {
    res.status(500).send({ error: "Failed to get chats with mentions" });
  }
};

const get_assigned_chats = async (req, res) => {
  const { agentToken } = req.body;

  try {
    const { error, agent } = await authenticateAgent(agentToken);
    if (error) return res.status(400).send({ error });

    const chats = await Chat.find({ assignee: agent._id });
    chats.forEach(chat => {
      chat.thread = [];
    });
    res.status(200).send(chats);
  } catch (error) {
    res.status(500).send({ error: "Failed to get assigned chats" });
  }
};

const update_chat_assignee = async (req, res) => {
  const { agentToken, chatId, assigneeId } = req.body;

  try {
    const { error, agent } = await authenticateAgent(agentToken);
    if (error) return res.status(400).send({ error });

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).send({ error: "Chat not found" });
    

    let systemEventMessage;
    if (!assigneeId) {
      chat.assignee = agent._id;
      systemEventMessage = create_system_event_message(`${agent.name} assigned this chat to themselves`);
    } else if (assigneeId === "unassign") {
      chat.assignee = null;
      systemEventMessage = create_system_event_message(`${agent.name} unassigned this chat`);
    } else {
      const assignee = await Agent.findById(assigneeId);
      if (!assignee) return res.status(404).send({ error: "Assignee not found" });
      chat.assignee = assigneeId;
      if (assigneeId.toString() === agent._id.toString()) {
        systemEventMessage = create_system_event_message(`${agent.name} assigned this chat to themselves`);  
      } else {
        systemEventMessage = create_system_event_message(`${agent.name} assigned this chat to ${assignee.name}`);
      }
    }

    chat.thread.push(systemEventMessage);
    await chat.save();

    emitEvent("chat_" + chatId, systemEventMessage);
    res.status(200).send();
  } catch (error) {
    res.status(500).send({ error: "Failed to update chat assignee" });
  }
};

const get_unassigned_chats = async (req, res) => {
  const { agentToken } = req.body;

  try {
    const { error, agent } = await authenticateAgent(agentToken);
    if (error) return res.status(400).send({ error });

    const chats = await Chat.find({ assignee: null });
    chats.forEach(chat => {
      chat.thread = [];
    });
    res.status(200).send(chats);
  } catch (error) {
    res.status(500).send({ error: "Failed to get unassigned chats" });
  }
};

    

module.exports = {
  create_new_chat,
  create_chat_reply,
  create_chat_note,
  toggle_chat_priority,
  update_chat_assignee,
  close_chat,
  get_chat,
  get_chats_with_mentions,
  get_assigned_chats,
  get_unassigned_chats
};
