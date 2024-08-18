const WaChat = require('../models/waChat');
const Agent = require('../models/agent');
const WaNumber = require('../models/waNumber');
const { authenticateAgent } = require('../utils/authenticateAgent');
const { sendWaMessage } = require('../utils/waHandler');

const createMessage = (type, idKey, id, message, messageType, messageLink) => ({
    [idKey]: id,
    type,
    status: "sent",
    message,
    messageType,
    messageLink,
    createdAt: new Date().toISOString(),
});

const send_message = async (req, res) => {
    const { agentToken, customerPhone, message, fromNumber, messageType='text', messageLink } = req.body;

    try {
        const { agent, error } = await authenticateAgent(agentToken);
        if (error) return res.status(401).json({ error });

        const waNumber = await WaNumber.findOne({ number : fromNumber });
        if (!waNumber) {
            return res.status(400).json({ message: 'Invalid number' });
        }

        if (!waNumber.access.includes(agent._id)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { success, error: sendmsgerr } = await sendWaMessage(customerPhone, message, fromNumber, messageType, messageLink);
        if (!success) {
            return res.status(400).json({ message: sendmsgerr });
        }

        let waChat = await WaChat.findOne({
            customerPhone
        });

        if (!waChat) {
            waChat = new WaChat({
                customerPhone,
                assignee: agent._id,
            });
        }

        if (waChat.assignee !== agent._id) {
            waChat.assignee = agent._id;
        }

        if (!waChat.open) {
            waChat.open = true;
        }

        const messageObj = createMessage('AgentReply', 'agentId', agent._id, message, messageType, messageLink);

        waChat.thread.push(messageObj);
        waChat.markModified('thread');
        await waChat.save();
        
        return res.status(200).json({ message: 'Message sent' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    send_message
}
