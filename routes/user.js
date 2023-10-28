const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const { authorizeUser, isEmailVerified } = require('../middlewares/authorize');

const { register, verifyEmail, login, forgotPassword, resetPassword, resendPasswordOtp, resendRegisterOtp, getUserProfile, uploadImage } = require('../controllers/user');

const {indicateLendUser, getUsersWillingToGiveLoans, requestLoan, getGivenLoans, getRequestedLoans} = require('../controllers/loan');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', authorizeUser, verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);



// Apply JWT authentication middleware to these protected routes
router.use(authorizeUser);

router.get('/profile', getUserProfile);
router.post('/lend',indicateLendUser);
router.post('/request-loan/:lenderId', getUsersWillingToGiveLoans);
router.post('/request-loan/:lenderId', requestLoan);
router.get('/given-loans', getGivenLoans);
router.get('/requested-loans', getRequestedLoans);


module.exports = router;

