const express = require('express');
const articleController = require('../controllers/articleController.js');

const router = express.Router();

router.post('/get/all', articleController.getAllArticles);
router.post('/get/one', articleController.getArticle);
router.post('/new', articleController.getArticle);

module.exports = router;