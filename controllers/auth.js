
// Import necessary models


const Loan = require('../models/loan');
const Transaction = require('../models/transaction');
const Merchant = require('../models/merchant');

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
require('dotenv').config()

const register = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg)
            return res.status(422).json({ errors: errorMessages })
        }
        const { email, password, firstName, lastName } = req.body
        const user = await User.findOne({ email: email })
        if (user) {
            console.log("user already exists")
            return res.status(401).json({ message: "User Already exists!" })
        }
        const hashedPassword = bcrypt.hashSync(password, 12)
        let otp = Math.floor(Math.random() * 89999 + 10000);
        const otpExpires = Date.now() + 10 * 3600
        const newUser = new User({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            otp: otp.toString(),
            otpExpires
        })
        await newUser.save()
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' })
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        const welcomeMessage = `<p>Your code is ${otp}</p>`
        const mailContent = welcomeMessage
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Welcome - Please verify",
            html: mailContent
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).json({ message: error.message });
            } else {
                console.log("Email sent: " + info.response);
                res.status(201).json({ message: 'Successfully registered', token, email })
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

const resendRegisterOtp = async (req, res) => {
    try {
        let otp = Math.floor(Math.random() * 89999 + 10000);
        const otpExpires = Date.now() + 10 * 3600
        req.user.otp = otp.toString()
        req.user.otpExpires = otpExpires
        await req.user.save();
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        const welcomeMessage = `<p>Your code is ${otp}</p>`
        const mailContent = welcomeMessage
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Welcome - Please verify",
            html: mailContent
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).json({ message: error.message });
            } else {
                console.log("Email sent: " + info.response);
                res.status(201).json({ message: 'Otp resent', email })
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}
const verifyEmail = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg)
            return res.status(422).json({ errors: errorMessages })
        }
        const { otp } = req.body
        const user = req.user
        if (otp !== user.otp) return res.status(400).json({ message: 'Invalid OTP' })
        if (user.otpExpires > Date.now()) return res.status(400).json({ message: "OTP Expired" })
        user.isVerified = true
        user.otp = null
        user.save()
        res.status(200).json({ message: 'Email verified successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const login = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg)
            return res.status(422).json({ errors: errorMessages })
        }
        const { username, password } = req.body
        const user = await User.findOne({ username: username })
        if (!user) return res.status(404).json({ message: "User not found" })
        const isMatch = bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(403).json({ message: "Incorrect Password" })
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(200).json({ message: "Login successful", token: token, email: user.email, firstName: user.firstName, lastName: user.lastName })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg)
            return res.status(422).json({ errors: errorMessages })
        }
        const { email } = req.body
        let user = await User.findOne({ email: email })
        if (!user) return res.status(404).json({ message: 'User not found' })
        let otp = Math.floor(Math.random() * 89999 + 10000);
        user.passwordToken = otp.toString()
        user.passwordTokenExpires = Date.now() + 60 * 60
        await user.save()
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        const welcomeMessage = `<p>Your code is ${otp}</p>`
        const mailContent = welcomeMessage
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Passwor Reset - Please verify",
            html: mailContent
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).json({ message: error.message });
            } else {

                console.log("Email sent: " + info.response);
                res.status(201).json({ message: 'Successfully registered', token, email })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const resendPasswordOtp = async (req, res) => {
    try {
        let otp = Math.floor(Math.random() * 89999 + 10000);
        req.user.passwordToken = otp.toString()
        req.user.passwordTokenExpires = Date.now() + 60 * 60
        await req.user.save()
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        const welcomeMessage = `<p>Your code is ${otp}</p>`
        const mailContent = welcomeMessage
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Passwor Reset - Please verify",
            html: mailContent
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).json({ message: error.message });
            } else {
                console.log("Email sent: " + info.response);
                res.status(201).json({ message: 'Successfully registered', token, email })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const resetPassword = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg)
            return res.status(422).json({ errors: errorMessages })
        }
        const { passwordToken, password } = req.body;
        const user = await User.findOne({ passwordToken: passwordToken, password: password })
        if (!user) return res.status(404).json({ errors: 'User not found' })
        const hashedPassword = bcrypt.hashSync(password, 12)
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
        user.passwordToken = null
        user.passwordTokenExpires = null
        user.password = hashedPassword
        await user.save();
        res.status(200).json({ message: 'Password Updated successfully', token })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}


const getUserProfile = async (req, res) => {
    try {
        console.log(req.user.email);
        const user = await User.findById(req.user._id); // Use findById to get the user by their ID

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
    // Implement the other user-related functions here

    module.exports = { register, login, verifyEmail, forgotPassword, resetPassword, resendPasswordOtp, resendRegisterOtp, getUserProfile }
