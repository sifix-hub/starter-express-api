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
        unique: true,
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
    longitude: { type: Number },
    latitude: { type: Number },
    businessName: { type: String },
    rating: { type: Number },
},
    { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
