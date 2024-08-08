const EmailChat = require('../models/emailChat');
const EmailAuth = require('../models/emailAuth');
const Agent = require('../models/agent');
const { sendEmail } = require('../utils/emailHandler');
const { authenticateAgent } = require('../utils/authenticateAgent');

const sendMail = async (req, res) => {
    const { agentToken, emailAuthId, subject, message, replyToEmailChatId } = req.body;

    try {
        const { error, agent } = await authenticateAgent(agentToken);
        if (error) return res.status(400).send({ error });

        const emailAuth = await EmailAuth.findById(emailAuthId);
        if (!emailAuth) return res.status(400).send("Invalid emailAuthId");

        const result = await sendEmail(emailAuth, null, subject, message, replyToEmailChatId);
        if (!result.success) return res.status(400).send(result.error);

        res.status(200).send();

    } catch (error) {
        console.log(error);
        return res.status(500).send();
    }
};

module.exports = { 
    sendMail
};