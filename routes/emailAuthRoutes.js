const express = require('express');
const emailAuthController = require('../controllers/emailAuthController');

const router = express.Router();

router.post('/new', emailAuthController.create);
router.post('/verify', emailAuthController.verify);

module.exports = router;