const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const waChatSchema = new Schema({
    customerPhone: {
        type: String,
        required: true,
        unique: true
    },
    priority: {
        type: Boolean,
        default: false
    },
    open: {
        type: Boolean,
        default: true
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        default: null
    },
    assignee: {
        type: Schema.Types.ObjectId,
        ref: 'Agent',
        default: null
    },
    mentions: {
        type: Array,
        default: []
    },
    thread: {
        type: Array,
        default: []
    }
}, { timestamps: true });

const WaChat = mongoose.model("WaChat", waChatSchema);
module.exports = WaChat;