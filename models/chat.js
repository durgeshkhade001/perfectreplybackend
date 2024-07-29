const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    isPriority: {
        type: Boolean,
        default: false
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
    thread: {
        type: Array,
        default: []
    }
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;