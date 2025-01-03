const express = require('express');
const emailAuthController = require('../controllers/emailAuthController');

const router = express.Router();

router.post('/new', emailAuthController.createEmailAuth);
router.post('/verify', emailAuthController.verifyEmailAuth);
router.post('/update', emailAuthController.updateEmailAuth);
router.post('/isListening', emailAuthController.isListening);

module.exports = router;