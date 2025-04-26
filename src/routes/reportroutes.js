
const express = require('express');
const router = express.Router();
const validateReport = require('../middleware/reportMiddelware');
const {addreport,getreports,bantrport}=require('../controllers/reportcontroller')

router.post('/add', validateReport,addreport);
router.get('/get',getreports);
router.put('/ban/:id/ban',bantrport);
module.exports = router;