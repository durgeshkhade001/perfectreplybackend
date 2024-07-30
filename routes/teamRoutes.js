const express = require('express');
const teamController = require('../controllers/teamController');

const router = express.Router();

router.post('/new', teamController.create_new_team);
// router.post('/add', teamController.add_team_member);
// router.post('/remove', teamController.remove_team_member);
// router.post('/update', teamController.update_team);
// router.get('/:id', teamController.get_team);
// router.post('/get/members', teamController.get_team_members);

module.exports = router;