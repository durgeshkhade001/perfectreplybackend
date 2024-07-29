const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agentSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    timezone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    tokens: {
        type: Array,
        default: []
    }
}, { timestamps: true });

const Agent = mongoose.model('Agent', agentSchema);
module.exports = Agent;