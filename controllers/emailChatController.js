const EmailChat = require('../models/emailChat');
const EmailAuth = require('../models/emailAuth');
const { listenToEmail } = require("../utils/emailHandler");

const test = async (req, res) => {
    res.status(200).send('Route is working');
}

module.exports = { 
    test 
};