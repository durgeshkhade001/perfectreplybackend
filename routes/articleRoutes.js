const express = require('express');
const articleController = require('../controllers/articleController.js');

const router = express.Router();

router.post('/get/all', articleController.getAllArticles);
router.post('/get/one', articleController.getArticle);
router.post('/new', articleController.createNewArticle);
router.post('/edit', articleController.editArticle);
router.post('/edit/published', articleController.toggleArticlePublished);

module.exports = router;