const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailAuthSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    host: {
        type: String,
        required: true
    },
    port: {
        type: Number,
        required: true
    },
}, { timestamps: true });

const EmailAuth = mongoose.model('EmailAuth', emailAuthSchema);
module.exports = EmailAuth;