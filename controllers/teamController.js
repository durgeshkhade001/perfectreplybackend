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

const add_team_members = async (req, res) => {  // Not Tested
    const { agentToken, teamId, members } = req.body;

    try {
        const { error, agent } = await authenticateAgent(agentToken);
        if (error) return res.status(400).send({ error });

        const team = await Team.findById(teamId);
        if (!team) return res.status(400).send({ error: "Team not found" });

        team.members = [...new Set([...team.members, ...members])];
        await team.save();

        res.status(200).send();
    } catch (error) {
        res.status(400).send({ error });
    }
}

const remove_team_members = async (req, res) => {   // Not Tested
    const { agentToken, teamId, members } = req.body;

    try {
        const { error, agent } = await authenticateAgent(agentToken);
        if (error) return res.status(400).send({ error });

        const team = await Team.findById(teamId);
        if (!team) return res.status(400).send({ error: "Team not found" });

        team.members = team.members.filter(member => !members.includes(member));
        await team.save();

        res.status(200).send();
    } catch (error) {
        res.status(400).send({ error });
    }
}

const update_team = async (req, res) => {   // Not Tested
    const { agentToken, teamId, name, icon } = req.body;

    try {
        const { error, agent } = await authenticateAgent(agentToken);
        if (error) return res.status(400).send({ error });

        const team = await Team.findById(teamId);
        if (!team) return res.status(400).send({ error: "Team not found" });

        if (name) team.name = name;
        if (icon) team.icon = icon;

        await team.save();
        res.status(200).send();
    } catch (error) {
        res.status(400).send({ error });
    }
}

const get_team = async (req, res) => {  // Not Tested
    const { agentToken, teamId } = req.body;

    try {
        const { error, agent } = await authenticateAgent(agentToken);
        if (error) return res.status(400).send({ error });

        const team = await Team.findById(teamId);
        if (!team) return res.status(400).send({ error: "Team not found" });

        res.status(200).send({ team });
    } catch (error) {
        res.status(400).send({ error });
    }
}


module.exports = {
    create_new_team,
    add_team_members,
    remove_team_members,
    update_team,
    get_team
}