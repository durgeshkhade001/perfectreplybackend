const express = require('express');
const agentController = require('../controllers/agentController');

const router = express.Router();

router.post('/register', agentController.register);
router.post('/login', agentController.login);
router.post('/logout', agentController.logout);
router.post('/logout/everywhere', agentController.logouteverywhere);

module.exports = router;