const express = require('express');
const waNumberController = require('../controllers/waNumberController.js');

const router = express.Router();

router.post('/update/access', waNumberController.update_access);

module.exports = router;