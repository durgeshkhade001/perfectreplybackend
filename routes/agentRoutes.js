const express = require('express');
const agentController = require('../controllers/agentController');

const router = express.Router();

router.post('/create', agentController.create);
router.post('/login', agentController.login);
router.post('/logout', agentController.logout);
router.post('/logout/everywhere', agentController.logout_everywhere);

module.exports = router;