const Team = require("../models/team");
const { authenticateAgent } = require("../utils/authenticateAgent");


const create_new_team = async (req, res) => {
    const { agentToken, name, icon, members } = req.body;

    try {
        const { error, agent } = await authenticateAgent(agentToken);
        if (error) return res.status(400).send({ error });

        const team = new Team({
            name,
            icon,
            members: [agent._id, ...members]
        });

        const savedTeam = await team.save();
        res.status(200).send();
    } catch (error) {
        res.status(400).send({ error });
    }
}


module.exports = {
    create_new_team
}