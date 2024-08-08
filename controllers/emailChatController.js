const EmailChat = require('../models/emailChat');
const EmailAuth = require('../models/emailAuth');

const sendMail = async (req, res) => {
    const { EmailAuthId, subject, message, emailChatId } = req.body;

    res.status(200).send();
};

module.exports = { 
    sendMail
};