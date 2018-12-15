const express = require('express');
const checkAuth = require('../middleware/chack-auth');
const router = express.Router();

const userController = require('../controllers/users');

router.patch('/:id', userController.create);
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/me/:id', checkAuth, userController.me);
router.get('/:cid/:status/typing', checkAuth, userController.emitTypingMessage);

module.exports = router;
