const mongoose = require('mongoose');

const MerchantSchema = new mongoose.Schema({

    
    
},
    { timestamps: true }
);

const Merchant = mongoose.model('Merchant', MerchantSchema);

module.exports = Merchant;