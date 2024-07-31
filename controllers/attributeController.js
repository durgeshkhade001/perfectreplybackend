const Attribute = require("../models/attribute");


const create_attribute = async (req, res) => {
    const { agentToken, name, icon, description, regex, defaultValue } = req.body;

    try {
        const { error, agent } = await authenticateAgent(agentToken);
        if (error) return res.status(400).send({ error });

        const attribute = new Attribute({ name, icon, description, regex, defaultValue });
        await attribute.save();

        res.status(200).send();
    } catch (error) {
        res.status(500).send({ error: "Failed to create attribute" });
    }
}

const update_attribute = async (req, res) => {
    const { agentToken, attributeId, name, icon, description, regex, defaultValue } = req.body;

    try {
        const { error, agent } = await authenticateAgent(agentToken);
        if (error) return res.status(400).send({ error });

        const attribute = await Attribute.findById(attributeId);
        if (!attribute) return res.status(404).send({ error: "Attribute not found" });

        if (name) attribute.name = name;
        if (icon) attribute.icon = icon;
        if (description) attribute.description = description;
        if (regex) attribute.regex = regex;

        await attribute.save();
        res.status(200).send();
    } catch (error) {
        res.status(500).send({ error: "Failed to update attribute" });
    }
}

const delete_attribute = async (req, res) => {
    const { agentToken, attributeId } = req.body;

    try {
        const { error, agent } = await authenticateAgent(agentToken);
        if (error) return res.status(400).send({ error });

        const attribute = await Attribute.findById(attributeId);
        if (!attribute) return res.status(404).send({ error: "Attribute not found" });

        await attribute.delete();
        res.status(200).send();
    } catch (error) {
        res.status(500).send({ error: "Failed to delete attribute" });
    }
}

const get_all_attributes = async (req, res) => {
    const { agentToken } = req.body;

    try {
        const { error, agent } = await authenticateAgent(agentToken);
        if (error) return res.status(400).send({ error });

        const attributes = await Attribute.find();
        res.status(200).send({ attributes });
    } catch (error) {
        res.status(500).send({ error: "Failed to get all attributes" });
    }
}

const get_attribute = async (req, res) => {
    const { agentToken, attributeId } = req.body;

    try {
        const { error, agent } = await authenticateAgent(agentToken);
        if (error) return res.status(400).send({ error });

        const attribute = await Attribute.findById(attributeId);
        if (!attribute) return res.status(404).send({ error: "Attribute not found" });

        res.status(200).send({ attribute });
    } catch (error) {
        res.status(500).send({ error: "Failed to get attribute" });
    }
}


module.exports = {
    create_attribute,
    update_attribute,
    delete_attribute,
    get_all_attributes,
    get_attribute
}