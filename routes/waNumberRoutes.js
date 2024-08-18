const express = require('express');
const waNumberController = require('../controllers/waNumberController.js');

const router = express.Router();

router.post('/new', waNumberController.create_new_wa_number);

module.exports = router;