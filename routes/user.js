const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const { authorizeUser, isEmailVerified } = require('../middlewares/authorize')
const { register, verifyEmail, login, forgotPassword, resetPassword, resendPasswordOtp, resendRegisterOtp } = require('../controllers/user')

router.post('/register', register)
router.post('/login', login)
router.post('/verify-email', authorizeUser, verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-otp', resendRegisterOtp);
router.post('/resend-password-otp', resendPasswordOtp);

module.exports = router;

