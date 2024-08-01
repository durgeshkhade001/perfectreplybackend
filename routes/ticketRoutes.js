const express = require('express');
const ticketController = require('../controllers/ticketController');

const router = express.Router();

router.post('/new', ticketController.create_new_ticket);
router.put('/stage', ticketController.update_ticket_stage);
router.put('/assign', ticketController.assign_ticket);
router.put('/team', ticketController.assign_ticket_team);
router.put('/priority', ticketController.toggle_ticket_priority);
router.post('/collectdata', ticketController.ticket_collect_data);
router.post('/reply', ticketController.ticket_reply);
router.post('/note', ticketController.ticket_note);
router.get('/:id', ticketController.get_ticket);
router.post('/get/assigned', ticketController.get_assigned_tickets);
router.post('/get/unassigned', ticketController.get_unassigned_tickets);
router.post('/get/mention', ticketController.get_tickets_with_mentions);
router.post('/get/team', ticketController.get_team_tickets);
router.post('/close', ticketController.close_ticket);

module.exports = router;