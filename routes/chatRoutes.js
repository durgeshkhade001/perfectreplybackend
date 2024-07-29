const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.post('/new', chatController.create_new_chat);
router.post('/reply', chatController.create_chat_reply);
router.post('/note', chatController.create_chat_note);
router.post('/priority', chatController.toggle_chat_priority);
router.get('/:id', chatController.get_chat);

module.exports = router;