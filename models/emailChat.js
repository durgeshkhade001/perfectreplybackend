const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailChatSchema = new Schema({
    customerEmail: {
        type: String,
        required: true
    },
    messageId: {
        type: String,
        required: true
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
    title: {
        type: String,
        required: true
    },
    thread: {
        type: Array,
        default: []
    }
}, { timestamps: true });

const EmailChat = mongoose.model('EmailChat', emailChatSchema);
module.exports = EmailChat;