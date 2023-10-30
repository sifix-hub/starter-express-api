// transactionModel.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  senderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },
  // Add more fields as needed
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
