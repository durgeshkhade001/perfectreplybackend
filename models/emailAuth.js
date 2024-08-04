const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailAuthSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    },
    imaphost: {
        type: String,
        required: true
    },
    imapport: {
        type: Number,
        required: true
    },
    access: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        default: 'unverified'
    },
}, { timestamps: true });

const EmailAuth = mongoose.model('EmailAuth', emailAuthSchema);
module.exports = EmailAuth;