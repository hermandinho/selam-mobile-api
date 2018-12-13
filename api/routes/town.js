const express = require('express');
const checkAuth = require('../middleware/chack-auth');
const router = express.Router();

const townController = require('../controllers/towns');

router.get('/',checkAuth, townController.fetch);
router.get('/:id',checkAuth, townController.find);
router.post('/create',checkAuth, townController.create);
router.delete('/:id',checkAuth, townController.delete);
router.patch('/:id', checkAuth, townController.patch);

module.exports = router;