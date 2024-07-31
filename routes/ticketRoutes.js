const express = require('express');
const ticketController = require('../controllers/ticketController');

const router = express.Router();

router.post('/new', ticketController.create_new_ticket);

module.exports = router;