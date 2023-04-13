const express = require('express');
const router = express.Router();
const UserController = require('../Controller/UserController');

router.post('/signup', UserController.SIGNUP_USER);
router.post('/login', UserController.LOGIN_USER);
router.post('/Adminsignup', UserController.ADMIN_SIGNUP);

module.exports = router;