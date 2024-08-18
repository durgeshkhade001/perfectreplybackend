const express = require('express');
const waChatController = require('../controllers/waChatController.js');

const router = express.Router();

router.post('/message/send', waChatController.send_message);

module.exports = router;