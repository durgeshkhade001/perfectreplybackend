const EmailAuth = require("../models/emailAuth");
const { authenticateAgent } = require("../utils/authenticateAgent");
const { getServiceConfig } = require("../utils/commonEmailAuthConfig");

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
    
    try {

    } catch (error) {
        res.status(400).send({ error });
    }
};

module.exports = {
  create,
  verify
};
