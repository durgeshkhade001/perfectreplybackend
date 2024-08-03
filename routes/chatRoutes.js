const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.post('/new', chatController.create_new_chat);
router.post('/reply', chatController.create_chat_reply);
router.post('/note', chatController.create_chat_note);
router.post('/priority', chatController.toggle_chat_priority);
router.put('/assign', chatController.update_chat_assignee);
router.post('/collectdata/new', chatController.new_collectdata);
router.post('/collectdata', chatController.fill_collectdata);
router.get('/:id', chatController.get_chat);
router.post('/get/mentions', chatController.get_chats_with_mentions);
router.post('/get/assigned', chatController.get_assigned_chats);
router.post('/get/unassigned', chatController.get_unassigned_chats);
router.post('/get/team', chatController.get_team_chats);
router.post('/markviewd', chatController.mark_chat_viewed);
router.post('/close', chatController.close_chat);
router.post('/send/transcript', chatController.send_chat_transcript);

module.exports = router;