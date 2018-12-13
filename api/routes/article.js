const express = require('express');
const checkAuth = require('../middleware/chack-auth');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/articles')
    },
    filename: (res, file, cb) => {
        //cb(null, new Date().toISOString() + file.originalname)
        cb(null, res.body.name + '_' + file.originalname);
    }
});
const upload = multer({ storage: storage })
const articleController = require('../controllers/articles');

router.get('/',checkAuth, articleController.fetch);
router.get('/:id',checkAuth, articleController.find);
router.post('/:id/upload', checkAuth, upload.single('fileToUpload'), articleController.upload);
router.post('/create',checkAuth, articleController.create);
router.delete('/:id',checkAuth, articleController.delete);
router.patch('/:id', checkAuth, articleController.patch),

module.exports = router;
