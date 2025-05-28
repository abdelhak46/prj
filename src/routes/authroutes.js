const express = require('express');
const router = express.Router();
const{ registerUser, loginUser,deleteUser } = require('../controllers/authcontroller');
router.post('/register',registerUser);
router.post('/login', loginUser);
router.delete('/delete/:id',deleteUser)
module.exports = router;
