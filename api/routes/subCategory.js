const express = require('express');
const checkAuth = require('../middleware/chack-auth');
const router = express.Router();

const subCategoryController = require('../controllers/subCategorys');

router.get('/',checkAuth, subCategoryController.fetch);
router.get('/:id',checkAuth, subCategoryController.find);
router.post('/create',checkAuth, subCategoryController.create);
router.delete('/:id',checkAuth, subCategoryController.delete);
router.patch('/:id', checkAuth, subCategoryController.patch);

module.exports = router;
