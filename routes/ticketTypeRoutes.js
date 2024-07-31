const express = require('express');
const ticketTypeController = require('../controllers/ticketTypeController.js');

const router = express.Router();

router.post('/get/all', ticketTypeController.get_all_ticket_types);
router.post('/get', ticketTypeController.get_ticket_type);
router.post('/create', ticketTypeController.create_ticket_type);
router.post('/delete', ticketTypeController.delete_ticket_type);
router.post('/update', ticketTypeController.update_ticket_type);

module.exports = router;