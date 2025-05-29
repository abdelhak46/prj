const express = require('express');
const router = express.Router();
const{ registerUser, loginUser,deleteUser } = require('../controllers/authcontroller');
const isAccept = require('../middleware/usernameMiddelware');
router.post('/register',isAccept,registerUser);
router.post('/login', loginUser);
router.delete('/delete/:id',deleteUser)
module.exports = router;
