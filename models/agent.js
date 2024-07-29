const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agentSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
    },
    timezone: {
        type: String,
    },
    email: {
        type: String,
    },
    tokens: {
        type: Array,
        default: []
    }
}, { timestamps: true });

const Agent = mongoose.model('Agent', agentSchema);
module.exports = Agent;