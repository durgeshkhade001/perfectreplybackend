const express = require('express');
const emailChatController = require('../controllers/emailChatController');

const router = express.Router();

router.post('/sendmail', emailChatController.sendMail);

module.exports = router;