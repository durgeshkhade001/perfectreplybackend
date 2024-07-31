const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    icon: {
        type: String,
        default: "i_1_1",
    },
    description: {
        type: String,
        default: "No description",
    },
    collect: {
        type: Array,
        default: [],
    },
}, { timestamps: true });

const TicketType = mongoose.model("TicketType", ticketTypeSchema);
module.exports = TicketType;