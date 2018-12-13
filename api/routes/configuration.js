const express = require('express');
const checkAuth = require('../middleware/chack-auth');
const router = express.Router();

const configurationController = require('../controllers/configuration');

router.get('/filters'/*,checkAuth*/, configurationController.filters);

module.exports = router;
