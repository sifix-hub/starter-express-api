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
        unique: true
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
    profilePicture: {
        type: String
    }
},
    { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;