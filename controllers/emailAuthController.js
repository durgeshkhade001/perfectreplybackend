const EmailAuth = require("../models/emailAuth");
const { authenticateAgent } = require("../utils/authenticateAgent");
const { getServiceConfig } = require("../utils/commonEmailAuthConfig");
const { verifyEmail } = require("../utils/emailHandler");

const createEmailAuth = async (req, res) => {
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

const verifyEmailAuth = async (req, res) => {
    const { emailAuthId } = req.body;

    if (!emailAuthId) {
        return res.status(400).json({ error: 'emailAuthId is required' });
    }

    try {
        const emailAuth = await EmailAuth.findById(emailAuthId);
        if (!emailAuth) return res.status(400).json({ error: 'EmailAuth not found' });

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
        res.status(400).send({ error });
    }
};


const updateEmailAuth = async (req, res) => {
    const { agentToken, emailAuthId, email, password, knownServiceName, service, imaphost, imapport } = req.body;

    try {
        const { error, agent } = await authenticateAgent(agentToken);
        if (error) return res.status(400).send({ error });

        const emailAuth = await EmailAuth.findById(emailAuthId);
        if (!emailAuth) return res.status(400).json({ error: 'EmailAuth not found' });

        const oldEmailAuth = { ...emailAuth.toObject() };

        if (email) emailAuth.email = email;
        if (password) emailAuth.password = password;

        let serviceConfig;
        if(knownServiceName) {
            const { error, service, imaphost, imapport } = getServiceConfig(knownServiceName);
            if (error) return res.status(400).send({ error });
            
            serviceConfig = { service, imaphost, imapport };
        } else {
            serviceConfig.service = service || emailAuth.service;
            serviceConfig.imaphost = imaphost || emailAuth.imaphost;
            serviceConfig.imapport = imapport || emailAuth.imapport;
        }
        emailAuth.service = serviceConfig.service;
        emailAuth.imaphost = serviceConfig.imaphost;
        emailAuth.imapport = serviceConfig.imapport;
        emailAuth.status = 'unverified'
        await emailAuth.save();

        const result = await verifyEmail(emailAuth);

        if (!result.success) {
            emailAuth.email = oldEmailAuth.email;
            emailAuth.password = oldEmailAuth.password;
            emailAuth.service = oldEmailAuth.service;
            emailAuth.imaphost = oldEmailAuth.imaphost;
            emailAuth.imapport = oldEmailAuth.imapport;
            emailAuth.status = oldEmailAuth.status;
            await emailAuth.save();
            return res.status(400).json({ error: result.error });
        } else {
            res.status(200).json();
        }
    } catch (error) {
        res.status(400).send({ error });
    }
};

const isListening = async (req, res) => {
    const { emailAuthId } = req.body;

    try {
        const emailAuth = await EmailAuth.findById(emailAuthId);
        if (!emailAuth) return res.status(400).json({ error: 'EmailAuth not found' });

        if(emailAuth.isListening) {
            return res.json({ isListening: true });
        } else {
            return res.json({ isListening: false });
        }


    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}


module.exports = {
  createEmailAuth,
  verifyEmailAuth,
  updateEmailAuth,
  isListening,
};
