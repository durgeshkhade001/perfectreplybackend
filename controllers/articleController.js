const Article = require('../models/article.js');
const { authenticateAgent } =  require("../utils/authenticateAgent");

const getAllArticles = async (req, res) => {
    const { agentToken } = req.body;

    try {

        let agentGlobal;
        if(agentToken) {
            const { error, agent } = await authenticateAgent(agentToken);
            if (error) return res.status(400).send({ error });

            agentGlobal = agent;
        }

        const articles = await Article.find({});
        const filteredArticles = articles.filter(article => article.access.public || (agentGlobal && article.access.agentsThatCanView.includes(agentGlobal._id.toString())));

        res.status(200).send({ articles: filteredArticles });

    } catch (error) {
        res.status(500).send({ error: "Failed to get articles" });
    }
}

const getArticle = async (req, res) => {
    const { agentToken, articleId } = req.body;

    try {

        const article = await Article.findById(articleId);
        if (!article) return res.status(404).send({ error: "Article not found" });

        let agentGlobal;
        if(agentToken) {
            const { error, agent } = await authenticateAgent(agentToken);
            if (error) return res.status(400).send({ error });

            agentGlobal = agent;
        }

        if (article.access.public || (agentGlobal && article.access.agentsThatCanView.includes(agentGlobal._id.toString()))) {
            res.status(200).send({ article });
        } else {
            res.status(401).send({ error: "Unauthorized" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Failed to get article" });
    }
}

const createNewArticle = async (req, res) => {
    let { agentToken, title, content, thumbnail, isPublic, category, tags, agentsThatCanView, agentsThatCanEdit } = req.body;

    try {
        const { error, agent } = await authenticateAgent(agentToken);
        if (error) return res.status(400).send({ error });

        if (!agentsThatCanView) agentsThatCanView = [];
        if (!agentsThatCanEdit) agentsThatCanEdit = [];
        if (agentsThatCanView && agentsThatCanEdit) {
            agentsThatCanView = [...new Set([...agentsThatCanView, ...agentsThatCanEdit])];
        }

        const access = {
            "public": isPublic,
            "agentsThatCanView": [agent._id.toString(), ...agentsThatCanView],
            "agentsThatCanEdit": [agent._id.toString(), ...agentsThatCanEdit]
        };

        const author = [agent._id.toString()];

        const article = new Article({ title, content, thumbnail, access, category, tags, author });
        await article.save();

        res.status(200).send();
    } catch (error) {
        res.status(500).send({ error: "Failed to create article" });
    }
}



const editArticle = async (req, res) => {
    let { agentToken, articleId, title, content, thumbnail, category, tags, agentsThatCanView, agentsThatCanEdit, isPublic } = req.body;

    try {
        const { error, agent } = await authenticateAgent(agentToken);
        if (error) return res.status(400).send({ error });

        const article = await Article.findById(articleId);
        if (!article) return res.status(404).send({ error: "Article not found" });

        if (!article.access.agentsThatCanEdit.includes(agent._id.toString())) {
            return res.status(401).send({ error: "Unauthorized" });
        }

        if(title) article.title = title;
        if(content) article.content = content;
        if(thumbnail) article.thumbnail = thumbnail;
        if(category) article.category = category;
        if(tags) article.tags = tags;

        if (agentsThatCanView !== undefined && agentsThatCanEdit !== undefined) {
            agentsThatCanView = [...new Set([...agentsThatCanView, ...agentsThatCanEdit, agent._id.toString()])];
            agentsThatCanEdit = [...new Set([...agentsThatCanEdit, agent._id.toString()])];
        } else if (agentsThatCanView !== undefined || agentsThatCanEdit !== undefined) {
            return res.status(400).send({ error: "Both agentsThatCanView and agentsThatCanEdit must be provided" });
        } else {
            agentsThatCanView = article.access.agentsThatCanView;
            agentsThatCanEdit = article.access.agentsThatCanEdit;
        }

        article.access.agentsThatCanView = agentsThatCanView;
        article.access.agentsThatCanEdit = agentsThatCanEdit;

        if (isPublic !== undefined) article.access.public = isPublic;

        article.markModified('access');

        await article.save();
        res.status(200).send();
    } catch (error) {
        res.status(500).send({ error: "Failed to edit article" });
    }
}

const toggleArticlePublished = async (req, res) => {
    const { agentToken, articleId, publish } = req.body;

    try {
        const { error, agent } = await authenticateAgent(agentToken);
        if (error) return res.status(400).send({ error });

        const article = await Article.findById(articleId);
        if (!article) return res.status(404).send({ error: "Article not found" });

        if (!article.access.agentsThatCanEdit.includes(agent._id.toString())) {
            return res.status(401).send({ error: "Unauthorized" });
        }

        article.published = publish;
        await article.save();

        res.status(200).send();
    } catch (error) {
        res.status(500).send({ error: "Failed to toggle article published" });
    }
}


module.exports = {
    getAllArticles,
    getArticle,
    createNewArticle,
    editArticle,
    toggleArticlePublished,
}