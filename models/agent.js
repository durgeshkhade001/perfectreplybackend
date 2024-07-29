const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agentSchema = new Schema({
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
        required: true
    }
}, { timestamps: true });

const Agent = mongoose.model('Agent', agentSchema);
module.exports = Agent;