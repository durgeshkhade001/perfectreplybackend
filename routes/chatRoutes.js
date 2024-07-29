const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.post('/new', chatController.create_new_chat);
router.post('/reply', chatController.create_chat_reply);

module.exports = router;