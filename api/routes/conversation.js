const express = require('express');
const checkAuth = require('../middleware/chack-auth');
const router = express.Router();

const conversationController = require('../controllers/conversations');

router.get('/',checkAuth, conversationController.fetch);
router.get('/:id',checkAuth, conversationController.find);
router.post('/create',checkAuth, conversationController.create);
router.delete('/:id',checkAuth, conversationController.delete);
router.patch('/:id', checkAuth, conversationController.patch);

module.exports = router;