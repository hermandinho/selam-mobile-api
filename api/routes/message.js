const express = require('express');
const checkAuth = require('../middleware/chack-auth');
const router = express.Router();

const messageController = require('../controllers/messages');

router.get('/',checkAuth, messageController.fetch);
router.get('/:id',checkAuth, messageController.find);
router.get('/:receiver/fetch',checkAuth, messageController.load);
router.post('/:receiver/send',checkAuth, messageController.send);
router.delete('/:id',checkAuth, messageController.delete);
router.patch('/:id', checkAuth, messageController.patch);

module.exports = router;
