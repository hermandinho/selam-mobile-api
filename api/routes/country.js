const express = require('express');
const checkAuth = require('../middleware/chack-auth');
const router = express.Router();

const countryController = require('../controllers/countrys');

router.get('/',checkAuth, countryController.fetch);
router.get('/:id',checkAuth, countryController.find);
router.post('/create',checkAuth, countryController.create);
router.delete('/:id',checkAuth, countryController.delete);
router.patch('/:id', checkAuth, countryController.patch);

module.exports = router;