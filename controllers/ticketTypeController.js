const TicketType = require('../models/ticketType');
const Attribute = require('../models/attribute');
const { authenticateAgent } = require('../utils/authenticateAgent');


async function verifycollect(collect, res) {
    for (const { attribute, required } of collect) {
        const attributeExists = await Attribute.findById(attribute);
        if (!attributeExists) {
            return res.status(400).json({ error: `Attribute with id ${attribute} does not exist` });
        }
        if (typeof required !== 'boolean') {
            return res.status(400).json({ error: `Required must be a boolean` });
        }
    }
}

const get_all_ticket_types = async (req, res) => {
    const { agentToken } = req.body;
    
    try {
        const { agent, error } = await authenticateAgent(agentToken);
        if (error) return res.status(401).json({ error });

        const ticketTypes = await TicketType.find();
        res.status(200).json({ ticketTypes });
    } catch (error) {
        res.status(500).json({ error });
    }
}

const get_ticket_type = async (req, res) => {
    const { agentToken, ticketTypeId } = req.body;

    try {
        const { agent, error } = await authenticateAgent(agentToken);
        if (error) return res.status(401).json({ error });

        const ticketType = await TicketType.findById(ticketTypeId);
        if (!ticketType) return res.status(400).json({ error: `Ticket type with id ${ticketTypeId} does not exist` });

        res.status(200).json({ ticketType });
    } catch (error) {
        res.status(500).json({ error });
    }
}

const create_ticket_type = async (req, res) => {
    const { agentToken, name, icon, description, collect } = req.body;

    try {
        const { agent, error } = await authenticateAgent(agentToken);
        if (error) return res.status(401).json({ error });

        await verifycollect(collect, res);

        const ticketType = new TicketType({
            name,
            icon,
            description,
            collect,
        });

        await ticketType.save();
        res.status(200).json({ ticketType });
    } catch (error) {
        res.status(500).json({ error });
    }
}

const delete_ticket_type = async (req, res) => {
    const { agentToken, ticketTypeId } = req.body;

    try {
        const { agent, error } = await authenticateAgent(agentToken);
        if (error) return res.status(401).json({ error });

        const ticketType = await TicketType.findByIdAndDelete(ticketTypeId);
        if (!ticketType) return res.status(400).json({ error: `Ticket type with id ${ticketTypeId} does not exist` });
        
        res.status(200).json();
    } catch (error) {
        res.status(500).json({ error });
    }
}

const update_ticket_type = async (req, res) => {
    const { agentToken, ticketTypeId, name, icon, description, collect } = req.body;

    try {
        const { agent, error } = await authenticateAgent(agentToken);
        if (error) return res.status(401).json({ error });

        const ticketType = await TicketType.findById(ticketTypeId);
        if (!ticketType) {
            return res.status(400).json({ error: `Ticket type with id ${ticketTypeId} does not exist` });
        }

        if (name) ticketType.name = name;
        if (icon) ticketType.icon = icon;
        if (description) ticketType.description = description;
        if (collect) {
            await verifycollect(collect, res);
            ticketType.collect = collect;
        }

        await ticketType.save();
        res.status(200).json();
    } catch (error) {
        res.status(500).json({ error });
    }
}

module.exports = {
    get_all_ticket_types,
    get_ticket_type,
    create_ticket_type,
    delete_ticket_type,
    update_ticket_type,
}