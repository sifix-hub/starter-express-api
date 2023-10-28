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
    },
    isMerchant: {
        type: Boolean,
        default: false
    },
    address: {
        streetAddress1: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        country: {
            type: String
        }
    },
    longitude: {
        type: Number
    },
    latitude: {
        type: Number
    },

},
    { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;