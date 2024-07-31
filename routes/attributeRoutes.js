const express = require('express');
const attributeController = require('../controllers/attributeController.js');

const router = express.Router();

router.post('/create', attributeController.create_attribute);
router.post('/update', attributeController.update_attribute);
router.post('/delete', attributeController.delete_attribute);
router.post('/get/all', attributeController.get_all_attributes);
router.post('/get', attributeController.get_attribute);

module.exports = router;