const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        min: 3
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique
    },
    password: {
        type: String,
        required: true
    },
    passwordToken: {
        type: String,
    },
    passwordTokenExpires: {
        type: Date,
    },
    otpExpires: {
        type: Date
    },
},
    { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;