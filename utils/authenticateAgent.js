const Agent = require("../models/agent");

const authenticateAgent = async (agentToken) => {
  if (!agentToken) return { error: "Missing agentToken" };
  const agent = await Agent.findOne({ tokens: agentToken });
  if (!agent) return { error: "Invalid agentToken" };
  return { agent };
};

module.exports = { authenticateAgent };
