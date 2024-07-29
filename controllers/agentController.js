const Agent = require("../models/agent");

function generateToken() {
    return Math.random().toString(36).substr(2);
}

const create = async (req, res) => {
    const { username, name, password } = req.body;
    const agent = new Agent({ username, name, password });
    await agent.save();
    res.status(201).send(agent);
};

const login = async (req, res) => {
    const { username, password } = req.body;
    const agent = await Agent.findOne({ username, password });
    if (!agent) return res.status(400).send({ error: "Invalid credentials" });
    const token = generateToken();
    agent.tokens.push(token);
    await agent.save();
    res.status(200).send({ token });
};

const logout = async (req, res) => {
    const { agentToken } = req.body;
    const agent = await Agent.findOne({ tokens: agentToken });
    if (!agent) return res.status(400).send({ error: "Invalid token" });
    agent.tokens = agent.tokens.filter((token) => token !== agentToken);
    await agent.save();
    res.status(200).send();
};

const logouteverywhere = async (req, res) => {
    const { agentToken } = req.body;
    const agent = await Agent.findOne({ tokens: agentToken });
    if (!agent) return res.status(400).send({ error: "Invalid token" });
    agent.tokens = [];
    await agent.save();
    res.status(200).send();
};


module.exports = {
    create,
    login,
    logout,
    logouteverywhere
};