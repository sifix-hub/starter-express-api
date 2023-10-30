const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const { authorizeUser, isEmailVerified } = require('../middlewares/authorize');

const { register, verifyEmail, login, forgotPassword, resetPassword, resendPasswordOtp, resendRegisterOtp, getUserProfile, uploadImage, becomeAMerchant } = require('../controllers/auth');

const { indicateLendUser, getUsersWillingToGiveLoans, requestLoan, getGivenLoans, getRequestedLoans } = require('../controllers/loan');

const { fundWallet, fundwalletCronJob } = require('../controllers/transaction');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', authorizeUser, verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-reg-otp', resendRegisterOtp);
router.post('/resend-otp', resendPasswordOtp);


// Nested router for protected routes with authorization
const protectedRouter = express.Router();

// Apply JWT authentication middleware to the protected routes
protectedRouter.use(authorizeUser);

protectedRouter.get('/profile', getUserProfile);
protectedRouter.post('/lend', indicateLendUser);
protectedRouter.post('/upload-avatar', uploadImage);
protectedRouter.post('/become-a-merchant', becomeAMerchant)
protectedRouter.get('/lenders', getUsersWillingToGiveLoans);
protectedRouter.post('/request-loan/:lenderId', requestLoan);
protectedRouter.get('/given-loans', getGivenLoans);
protectedRouter.get('/requested-loans', getRequestedLoans);
protectedRouter.post('/fund-wallet', fundWallet);
protectedRouter.post('/webhook', fundwalletCronJob);

// Mount the protected router under a specific path
router.use('/', protectedRouter);

module.exports = router;

