const Ticket = require('../models/ticket');
const TicketType = require('../models/ticketType');
const { authenticateAgent } = require('../utils/authenticateAgent');

const create_new_ticket = async (req, res) => {
}

const update_ticket_stage = async (req, res) => {
}

const assign_ticket = async (req, res) => {
}

const assign_ticket_team = async (req, res) => {
}

const toggle_ticket_priority = async (req, res) => {
}

const ticket_collect_data = async (req, res) => {
}

const ticket_reply = async (req, res) => {
}

const ticket_note = async (req, res) => {
}

const get_ticket = async (req, res) => {
}

const get_assigned_tickets = async (req, res) => {
}

const get_unassigned_tickets = async (req, res) => {
}

const get_tickets_with_mentions = async (req, res) => {
}

const get_team_tickets = async (req, res) => {
}

const close_ticket = async (req, res) => {
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