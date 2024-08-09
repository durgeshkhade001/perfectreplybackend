const HelpCenter = require('../models/helpCenter');
const Article = require('../models/article');
const { authenticateAgent } = require('../utils/authenticateAgent');

const create_new_help_center = async (req, res) => {
    const { agentToken, hcname, hcstyle } = req.body;

    try {
        const { error, agent } = await authenticateAgent(agentToken);
        if (error) return res.status(400).send({ error });

        const newHelpCenter = new HelpCenter({
            hcname,
            hcstyle,
        });

        await newHelpCenter.save();
        res.status(201).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const add_articles_to_help_center = async (req, res) => {
    const { agentToken, hcId, articleIds } = req.body;

    try {
        const { error, agent } = await authenticateAgent(agentToken);
        if (error) return res.status(400).send({ error });

        const helpCenter = await HelpCenter.findById(hcId);
        if (!helpCenter) return res.status(404).json({ error: 'Help center not found' });

        if (articleIds.length === 0) return res.status(400).json({ error: 'No articles to add' });

        let articleIdsToAdd = [];
        articleIds.forEach(articleId => {
            const article = Article.findById(articleId);
            if (!article) return res.status(404).json({ error: 'Article not found' });

            if (!helpCenter.articles.includes(articleId)) {
                articleIdsToAdd.push(articleId);
            }
        });

        helpCenter.articles = [...new Set([...helpCenter.articles, ...articleIdsToAdd])];

        await helpCenter.save();
        res.status(200).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const remove_articles_from_help_center = async (req, res) => {
    const { agentToken, hcId, articleIds } = req.body;

    try {
        const { error, agent } = await authenticateAgent(agentToken);
        if (error) return res.status(400).send({ error });

        const helpCenter = await HelpCenter.findById(hcId);
        if (!helpCenter) return res.status(404).json({ error: 'Help center not found' });

        if (articleIds.length === 0) return res.status(400).json({ error: 'No articles to remove' });

        let articleIdsToRemove = [];
        articleIds.forEach(articleId => {
            const article = Article.findById(articleId);
            if (!article) return res.status(404).json({ error: 'Article not found' });

            if (helpCenter.articles.includes(articleId)) {
                articleIdsToRemove.push(articleId);
            }
        });

        helpCenter.articles = helpCenter.articles.filter(articleId => !articleIdsToRemove.includes(articleId));

        await helpCenter.save();
        res.status(200).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    create_new_help_center,
    add_articles_to_help_center,
    remove_articles_from_help_center,
}