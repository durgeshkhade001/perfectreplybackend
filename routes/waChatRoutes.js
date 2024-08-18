const express = require('express');
const waChatController = require('../controllers/waChatController.js');

const router = express.Router();

router.post('/test', waChatController.test);

module.exports = router;