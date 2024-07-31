const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attributeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    icon: {
        type: String,
        default: 'i_42_1'
    },
    description: {
        type: String,
        default: 'No description'
    },
    regex: {
        type: String,
        default: '^.*$'
    },
    defaultValue: {
        type: String,
        default: ''
    },
}, { timestamps: true });

const Attribute = mongoose.model('Attribute', attributeSchema);
module.exports = Attribute;