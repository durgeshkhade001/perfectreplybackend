const Ticket = require('../models/ticket');
const TicketType = require('../models/ticketType');
const Agent = require('../models/agent');
const Team = require('../models/team');
const { emitEvent } = require("../utils/socketManager");
const { authenticateAgent } = require('../utils/authenticateAgent');


const createMessage = (type, idKey, id, message) => ({
    [idKey]: id,
    type,
    status: "sent",
    message,
    createdAt: new Date().toISOString(),
});
  
const create_system_event_message = (message) => ({
    type: "SystemEvent",
    message,
    created: new Date().toISOString(),
});

const create_new_ticket = async (req, res) => {
    const { ticketTypeId } = req.body;

    try {
        const ticketType = await TicketType.findById(ticketTypeId);
        if (!ticketType) {
            return res.status(400).json({ message: `Ticket type with id ${ticketTypeId} does not exist` });
        }

        const collectdata = ticketType.collect.map(data => ({ ...data, value: "" }));

        const newTicket = new Ticket({
            ticketType: ticketType._id,
            collectdata,
        });

        newTicket.thread.push(create_system_event_message("Ticket created"));

        const savedTicket = await newTicket.save();
        res.status(201).json({ savedTicket });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const update_ticket_stage = async (req, res) => {
    const { agentToken, ticketId, stage } = req.body;

    try {
        const { agent, error } = await authenticateAgent(agentToken);
        if (error) return res.status(401).json({ message: error });

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(400).json({ message: `Ticket with id ${ticketId} does not exist` });
        }

        if(stage !== "created" && stage !== "in-progress" && stage !== "closed") {
            return res.status(400).json({ message: `Invalid stage` });
        }

        const systemEventMessage = create_system_event_message(`${agent.name} moved the ticket to ${stage} stage`);
        ticket.thread.push(systemEventMessage);

        ticket.stage = stage;
        await ticket.save();

        emitEvent("ticket_" + ticketId, systemEventMessage);
        res.status(200).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const assign_ticket = async (req, res) => {
    const { agentToken, ticketId, assigneeId } = req.body;

    try {
        const { agent, error } = await authenticateAgent(agentToken);
        if (error) return res.status(401).json({ message: error });

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(400).json({ message: `Ticket with id ${ticketId} does not exist` });
        }

        const assignee = await Agent.findById(assigneeId);
        if (!assignee) {
            return res.status(400).json({ message: `Agent with id ${assigneeId} does not exist` });
        }

        let systemEventMessage;

        if (assigneeId === agent._id.toString()) {
            systemEventMessage = create_system_event_message(`${agent.name} assigned the ticket to themselves`);
        } else {
            systemEventMessage = create_system_event_message(`${agent.name} assigned the ticket to ${assignee.name}`);
        }

        ticket.thread.push(systemEventMessage);

        ticket.assignee = assignee._id;
        await ticket.save();

        emitEvent("ticket_" + ticketId, systemEventMessage);
        res.status(200).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const assign_ticket_team = async (req, res) => {
    const { agentToken, ticketId, teamId } = req.body;

    try {
        const { agent, error } = await authenticateAgent(agentToken);
        if (error) return res.status(401).json({ message: error });

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(400).json({ message: `Ticket with id ${ticketId} does not exist` });
        }

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(400).json({ message: `Team with id ${teamId} does not exist` });
        }

        const systemEventMessage = create_system_event_message(`${agent.name} assigned the ticket to team ${team.name}`);
        ticket.thread.push(systemEventMessage);

        ticket.team = team._id;
        await ticket.save();

        emitEvent("ticket_" + ticketId, systemEventMessage);
        res.status(200).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const toggle_ticket_priority = async (req, res) => {
    const { agentToken, ticketId } = req.body;

    try {
        const { agent, error } = await authenticateAgent(agentToken);
        if (error) return res.status(401).json({ message: error });

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(400).json({ message: `Ticket with id ${ticketId} does not exist` });
        }

        ticket.priority = !ticket.priority;

        let systemEventMessage;
        if (ticket.priority) {
            systemEventMessage = create_system_event_message(`${agent.name} marked the ticket as priority`);
        } else {
            systemEventMessage = create_system_event_message(`${agent.name} removed the priority status from the ticket`);
        }
        ticket.thread.push(systemEventMessage);

        await ticket.save();

        emitEvent("ticket_" + ticketId, systemEventMessage);
        res.status(200).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const ticket_collect_data = async (req, res) => {
    const { collect, ticketId } = req.body;

    try {
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(400).json({ message: `Ticket with id ${ticketId} does not exist` });
        }

        if (collect.length !== ticket.collectdata.length) return res.status(400).json({ message: `Invalid collect data` });

        ticket.collectdata.forEach((data, index) => {
            if (data.required && collect[index] === "") return res.status(400).json({ message: `Missing required data` });
            data.value = collect[index].toString();
        });

        ticket.markModified("collectdata");
        await ticket.save();
        res.status(200).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const ticket_reply = async (req, res) => {
    const { agentToken, ticketId, message } = req.body;

    try {
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) return res.status(400).json({ message: `Ticket with id ${ticketId} does not exist` });

        if (agentToken) {        
            const { agent, error } = await authenticateAgent(agentToken);
            if (error) return res.status(401).json({ message: error });

            let systemEventMessage;
            if (agent._id !== ticket.assignee) {
                ticket.assignee = agent._id;
                systemEventMessage = create_system_event_message(`The ticket has been assigned to ${agent.name}`);
                ticket.thread.push(systemEventMessage);
            }

            const messageObj = createMessage("AgentMessage", "agentId", agent._id, message);
            ticket.thread.push(messageObj);
            await ticket.save();
            
            if (systemEventMessage) emitEvent("ticket_" + ticketId, systemEventMessage);
            emitEvent("ticket_" + ticketId, messageObj);
        } else {
            const messageObj = createMessage("ContactReply", "contactId", "x", message);
            ticket.thread.push(messageObj);
            await ticket.save();
            emitEvent("ticket_" + ticketId, messageObj);
        }
        
        res.status(200).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const ticket_note = async (req, res) => {
    const { agentToken, ticketId, message } = req.body;

    try {
        const { agent, error } = await authenticateAgent(agentToken);
        if (error) return res.status(401).json({ message: error });

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(400).json({ message: `Ticket with id ${ticketId} does not exist` });
        }

        const messageObj = createMessage("AgentNote", "agentId", agent._id, message);
        ticket.thread.push(messageObj);

        let systemEventMessage;
        if (message.includes("$_mention_agentId_")) {
            const agentId = message.split("$_mention_agentId_")[1].split("_$")[0];
            const mentionedAgent = await Agent.findById(agentId);
            if (mentionedAgent) {
              if (!ticket.mentions.includes(mentionedAgent._id)) {
                ticket.mentions.push(mentionedAgent._id);
              }
              systemEventMessage = create_system_event_message(
                `${agent.name} mentioned ${mentionedAgent.name} in this ticket`
              );
              ticket.thread.push(systemEventMessage);
            }
        }

        await ticket.save();

        emitEvent("ticket_" + ticketId, messageObj);
        if (systemEventMessage) emitEvent("ticket_" + ticketId, systemEventMessage);
        res.status(200).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const get_ticket = async (req, res) => {
    const { id: ticketId } = req.params;

    try {

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(400).json({ message: `Ticket with id ${ticketId} does not exist` });
        }

        res.status(200).json({ ticket });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const get_assigned_tickets = async (req, res) => {
    const { agentToken } = req.body;

    try {
        const { agent, error } = await authenticateAgent(agentToken);
        if (error) return res.status(401).json({ message: error });

        const tickets = await Ticket.find({ assignee: agent._id });
        tickets.forEach(ticket => ticket.thread = []);

        res.status(200).json({ tickets });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const get_unassigned_tickets = async (req, res) => {
    const { agentToken } = req.body;

    try {
        const { agent, error } = await authenticateAgent(agentToken);
        if (error) return res.status(401).json({ message: error });

        const tickets = await Ticket.find({ assignee: null });
        tickets.forEach(ticket => ticket.thread = []);

        res.status(200).json({ tickets });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const get_tickets_with_mentions = async (req, res) => {
    const { agentToken } = req.body;

    try {
        const { agent, error } = await authenticateAgent(agentToken);
        if (error) return res.status(401).json({ message: error });

        const tickets = await Ticket.find({ mentions: agent._id });
        tickets.forEach(ticket => ticket.thread = []);

        res.status(200).json({ tickets });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const get_team_tickets = async (req, res) => {
    const { agentToken, teamId } = req.body;

    try {
        const { agent, error } = await authenticateAgent(agentToken);
        if (error) return res.status(401).json({ message: error });

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(400).json({ message: `Team with id ${teamId} does not exist` });
        }

        const tickets = await Ticket.find({ team: team._id });
        tickets.forEach(ticket => ticket.thread = []);

        res.status(200).json({ tickets });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const close_ticket = async (req, res) => {
    const { agentToken, ticketId } = req.body;

    try {
        const { agent, error } = await authenticateAgent(agentToken);
        if (error) return res.status(401).json({ message: error });

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(400).json({ message: `Ticket with id ${ticketId} does not exist` });
        }

        const systemEventMessage = create_system_event_message(`${agent.name} closed this ticket`);
        ticket.thread.push(systemEventMessage);

        ticket.open = false;
        ticket.stage = "closed";
        await ticket.save();

        emitEvent("ticket_" + ticketId, systemEventMessage);
        res.status(200).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    create_new_ticket,
    update_ticket_stage,
    assign_ticket,
    assign_ticket_team,
    toggle_ticket_priority,
    ticket_collect_data,
    ticket_reply,
    ticket_note,
    get_ticket,
    get_assigned_tickets,
    get_unassigned_tickets,
    get_tickets_with_mentions,
    get_team_tickets,
    close_ticket
}