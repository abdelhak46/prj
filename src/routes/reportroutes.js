
const express = require('express');
const router = express.Router();
const isLogin = require('../middleware/LoginMiddelware');
const isNotSuperUser = require('../middleware/NotSuperUserMiddelware');
const validateReport = require('../middleware/reportMiddelware');
const {addreport,getreports,ban,deban,delet,deletall,blacklsit}=require('../controllers/reportcontroller')
router.post('/add',isLogin,isNotSuperUser, validateReport,addreport);
router.get('/get',getreports);
router.put('/ban/:id',ban);
router.put('/deban/:id',deban);
router.delete('/delete/:id',delet);
router.delete('/delete',deletall);
router.get('/blacklist',blacklsit);
module.exports = router;