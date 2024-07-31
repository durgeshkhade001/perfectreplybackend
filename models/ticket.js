const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
}, { timestamps: true });

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;