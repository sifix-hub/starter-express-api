const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator');
const crypto = require('crypto');
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
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
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
                console.log(token, email, newUser.url)
                console.log("Email sent: " + info.response);
                res.status(201).json({ message: 'Successfully registered', token, email, url: newUser.url })
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
        const { email, password } = req.body
        const user = await User.findOne({ 'local.email': email })
        if (!user) return res.status(404).json({ message: "User has not registered" })
        const isMatch = bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(403).json({ message: "Incorrect Password" })
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(200).json({ message: "Login successful", token: token, email: user.email, firstName: user.firstName, lastName: user.lastName })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

module.exports = {register, login, verifyEmail}