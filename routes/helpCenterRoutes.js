const express = require('express');
const helpCenterController = require('../controllers/helpCenterController');

const router = express.Router();

router.post('/new', helpCenterController.create_new_help_center);
router.post('/articles/add', helpCenterController.add_articles_to_help_center);
router.post('/articles/remove', helpCenterController.remove_articles_from_help_center);

module.exports = router;