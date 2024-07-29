const Agent = require("../models/agent");

const authenticateAgent = async (agentToken) => {
  if (!agentToken) return { error: "Invalid request" };
  const agent = await Agent.findOne({ tokens: agentToken });
  if (!agent) return { error: "Invalid token" };
  return { agent };
};

module.exports = { authenticateAgent };
