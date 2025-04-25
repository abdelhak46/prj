const express = require('express');
const isLogin = require('../middleware/LoginMiddelware');
const isProf = require('../middleware/profMiddelware')
const router = express.Router();
const {importToDrive}=require('../controllers/profcontroller')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
router.post('/import',isLogin,isProf,upload.single('file'), importToDrive);
module.exports = router;