const express = require('express');
const checkAuth = require('../middleware/chack-auth');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/users')
    },

    filename: (res, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.split(' ').join('-'));
    }
});
const upload = multer({ storage: storage })

const userController = require('../controllers/users');

router.patch('/:id', userController.update);
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/me/:id', checkAuth, userController.me);
router.get('/:cid/:status/typing', checkAuth, userController.emitTypingMessage);
router.post('/logout', checkAuth, userController.logout);
router.patch('/:id/upload', checkAuth, upload.single('picture'), userController.upload);


module.exports = router;
