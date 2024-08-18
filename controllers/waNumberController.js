const WaNumber = require("../models/waNumber");
const Agent = require("../models/agent");
const { authenticateAgent } = require('../utils/authenticateAgent');
const mongoose = require('mongoose');
const axios = require('axios');

const update_access = async (req, res) => {
    const { agentToken, waNumberId, accessAdd = [], accessRemove = [] } = req.body;

    if (!Array.isArray(accessAdd) || !Array.isArray(accessRemove)) {
        return res.status(400).json({ error: 'Invalid accessAdd or accessRemove format' });
    }

    try {
        const { agent, error } = await authenticateAgent(agentToken);
        if (error) return res.status(401).json({ error: 'Authentication failed' });

        const waNumber = await WaNumber.findById(waNumberId);
        if (!waNumber) return res.status(404).json({ error: `Wa number with id ${waNumberId} does not exist` });

        if (accessAdd.length > 0) {
            if (accessAdd.some(access => !mongoose.Types.ObjectId.isValid(access))) {
                return res.status(400).json({ error: 'Invalid ID format in accessAdd' });
            }
            const agents = await Agent.find({ _id: { $in: accessAdd } });
            if (agents.length !== accessAdd.length) {
                return res.status(400).json({ error: 'One or more agents do not exist' });
            }
            waNumber.access = [...new Set([...waNumber.access, ...accessAdd])];
        }

        if (accessRemove.length > 0) {
            if (accessRemove.some(access => !mongoose.Types.ObjectId.isValid(access))) {
                return res.status(400).json({ error: 'Invalid ID format in accessRemove' });
            }
            waNumber.access = waNumber.access.filter(access => !accessRemove.includes(access));
        }

        await waNumber.save();
        res.status(200).json({ message: 'Access updated successfully' });
    } catch (error) {
        console.error('Error updating access:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    update_access,
}