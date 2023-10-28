const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const { authorizeUser, isEmailVerified } = require('../middlewares/authorize')

const { register, verifyEmail, login, forgotPassword, resetPassword } = require('../controllers/user')

const { register, verifyEmail, login, recoverPassword, getUserProfile, uploadImage } = require('../controllers/user')


router.post('/register', register)
router.post('/login', login)
router.post('/verify-email', authorizeUser, verifyEmail);

router.post('forgot-password', forgotPassword);
router.post('reset-password', resetPassword);



// Apply JWT authentication middleware to these protected routes
router.use(authorizeUser);

/// User Profile Endpoints with user_id at the beginning
router.get('/profile', getUserProfile);
router.post('/upload-image', uploadImage);
router.post('/transfer', walletToWalletTransfer);
router.post('/create-loan', createLoan);
router.get('/all-loans', getAllLoans);
router.post('/request-loan', requestLoan);
router.get('/user-loans', getUserLoans);
router.get('/requested-loans', getRequestedLoans);
router.post('/upload-bank-card', uploadBankCard);
router.post('/recover-password', recoverPassword);
router.get('/merchant-locations', getMerchantLocations);

module.exports = router;

