const express = require('express');
const checkAuth = require('../middleware/chack-auth');
const router = express.Router();

const categoryController = require('../controllers/categorys');

router.get('/'/*,checkAuth*/, categoryController.fetch);
router.get('/:id',checkAuth, categoryController.find);
router.post('/create',checkAuth, categoryController.create);
router.delete('/:id',checkAuth, categoryController.delete);
router.patch('/:id', checkAuth, categoryController.patch);

module.exports = router;
