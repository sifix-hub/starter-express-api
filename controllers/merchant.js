const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator');
require('dotenv').config()

const getMerchants = async (req, res) => {
    try {
        const merchants = await User.find({ isMerchant: true })
        if (!merchants) return res.status(404).json({ message: 'No merchant found' })
        res.json(merchants)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getMerchant = async (req, res) => {
    try{
        const id = req.params.id
        const user = await User.findById(id)
        if(!user){
            return res.status(404).send("User not found")
            }
            res.json(user)
    } catch(error){
        console.log(error)
        res.status(500).json(error.message)
    }
}

module.exports = {getMerchant, getMerchants}