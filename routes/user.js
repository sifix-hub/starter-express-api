const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const { authorizeUser, isEmailVerified } = require('../middlewares/authorize')
const { register, verifyEmail, login, forgotPassword, resetPassword, resendPasswordOtp, resendRegisterOtp, uploadImage, becomeAMerchant } = require('../controllers/auth')

router.post('/register', register)
router.post('/login', login)
router.post('/verify-email', authorizeUser, verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-reg-otp', resendRegisterOtp);
router.post('/resend-otp', resendPasswordOtp);

router.use(authorizeUser)
router.patch('/upload-avatar', uploadImage)
router.use(isEmailVerified)
router.patch('/become-a-merchant', becomeAMerchant)
module.exports = router;

