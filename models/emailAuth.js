const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailAuthSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
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
    isListining: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const EmailAuth = mongoose.model('EmailAuth', emailAuthSchema);
module.exports = EmailAuth;