const express = require('express');
const router = express.Router();
const { createModule, getModules, deleteModuleByID,searchModules,getDistinctSpecialites} = require('../controllers/modulecontroller');
const isSuperUser = require('../middleware/SuperUserMiddleware');
const isLogin = require('../middleware/LoginMiddelware');


router.post('/add',isLogin,isSuperUser,createModule);
router.delete('/delete/:id',isLogin,isSuperUser,deleteModuleByID);
router.get('/get', getModules);
router.get('/search', searchModules);
router.get('/distinct-specialites',getDistinctSpecialites);
module.exports = router;