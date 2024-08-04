const EmailAuth = require("../models/emailAuth");
const { authenticateAgent } = require("../utils/authenticateAgent");
const { getServiceConfig } = require("../utils/commonEmailAuthConfig");
const { verifyEmail } = require("../utils/emailHandler");

const create = async (req, res) => {
  const { agentToken, email, password, knownServiceName, service, imaphost, imapport } = req.body;

  try {
    const { error, agent } = await authenticateAgent(agentToken);
    if (error) return res.status(400).send({ error });

    let serviceConfig = { service, imaphost, imapport };
    if(knownServiceName) {
        const { error, service, imaphost, imapport } = getServiceConfig(knownServiceName);
        if (error) return res.status(400).send({ error });
        
        serviceConfig = { service, imaphost, imapport };
    } else {
        serviceConfig = { service, imaphost, imapport };
    }

    const newEmailAuth = new EmailAuth({
        email,
        password,
        ...serviceConfig,
        access: [agent._id],
    });

    await newEmailAuth.save();
    res.status(201).send();
  } catch (error) {
    res.status(400).send({ error });
  }
};

const verify = async (req, res) => {
    const { emailAuthId } = req.body;

    if (!emailAuthId) {
        return res.status(400).json({ error: 'emailAuthId is required' });
    }

    try {
        const emailAuth = await EmailAuth.findById(emailAuthId);
        if (!emailAuth) throw new Error('Email auth not found');

        if (emailAuth.status === 'verified') {
            emailAuth.status = 'unverified';
            await emailAuth.save();
        }

        const result = await verifyEmail(emailAuth);

        if (result.success) {
            res.status(200).json();
        } else {
            res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
  create,
  verify
};
