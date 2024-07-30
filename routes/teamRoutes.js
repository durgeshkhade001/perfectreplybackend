const express = require('express');
const teamController = require('../controllers/teamController');

const router = express.Router();

router.post('/new', teamController.create_new_team);
// router.post('/members/add', teamController.add_team_members);
// router.post('/members/remove', teamController.remove_team_members);
// router.put('/update', teamController.update_team);
// router.post('/get/:id', teamController.get_team);

module.exports = router;