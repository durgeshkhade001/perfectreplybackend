const express = require('express');
const waLinkController = require('../controllers/waLinkController.js');

const router = express.Router();

router.post('/new', waLinkController.create_new_wa_link);
router.post('/check', waLinkController.check_wa_link);
router.post('/update', waLinkController.update_wa_link);
router.post('/fetchexistingnos', waLinkController.fetch_existing_nos);

module.exports = router;