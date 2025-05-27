const express = require('express');
const router = express.Router();
const {getProfs}=require('../controllers/usercontroller')

router.get('/getAllProfs',getProfs);
module.exports = router;