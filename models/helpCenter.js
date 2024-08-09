const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const helpCenterSchema = new Schema({
    hcname: {
        type: String,
        required: true,
    },
    hcstyle: {
        type: Object,
        default: {
            primaryColor: '#000000',
            secondaryColor: '#FFFFFF',
            fontFamily: 'Arial',
            backgroundGradient: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)',
        },
    },
    articles: {
        type: Array,
        default: [],
    },
});

const HelpCenter = mongoose.model('HelpCenter', helpCenterSchema);
module.exports = HelpCenter;