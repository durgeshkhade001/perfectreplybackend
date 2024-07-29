const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.post('/new', chatController.create_new_chat);
router.post('/reply', chatController.create_chat_reply);
router.post('/note', chatController.create_chat_note);
router.post('/priority', chatController.toggle_chat_priority);
router.post('/close', chatController.close_chat);
router.get('/:id', chatController.get_chat);

// router.post('/get/all', chatController.somefunction);
// router.post('/get/unassigned', chatController.somefunction);
// router.post('/get/mentions', chatController.somefunction);
// router.post('/get/team/:id', chatController.somefunction);

module.exports = router;