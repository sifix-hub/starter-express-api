const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const { authorizeUser, isEmailVerified } = require('../middlewares/authorize')
const { register, verifyEmail, login } = require('../controllers/user')

router.post('/register', register)
router.post('/login', login)
router.post('/verify-email', authorizeUser, verifyEmail);

module.exports = router;

