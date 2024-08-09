const express = require('express');
const articleController = require('../controllers/articleController.js');

const router = express.Router();

router.get('/', articleController.getAllArticles);

module.exports = router;