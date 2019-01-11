const express = require('express');
const router = express.Router();

const contactController = require('../controllers/contacts');

router.get('/:id', contactController.find);
router.post('/create', contactController.create);
router.delete('/:id', contactController.delete);

module.exports = router;
