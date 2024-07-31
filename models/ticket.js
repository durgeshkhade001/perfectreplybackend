const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
    ticketType: {
        type: Schema.Types.ObjectId,
        ref: "TicketType",
        required: true,
    },
    collectdata: {
        type: Array,
        required: true
    },
    stage: {
        type: String,
        default: "created",
    },
    priority: {
        type: Boolean,
        default: false,
    },
    open: {
        type: Boolean,
        default: true,
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: "Team",
        default: null,
    },
    assignee: {
        type: Schema.Types.ObjectId,
        ref: "Agent",
        default: null,
    },
    mentions: {
        type: Array,
        default: [],
    },
    thread: {
        type: Array,
        default: [],
    },
}, { timestamps: true });

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;