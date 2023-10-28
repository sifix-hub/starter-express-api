const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    interestRate: {
        type: Number, // e.g., 5.5 for 5.5%
        required: true,
    },
    durationMonths: {
        type: Number, // Loan duration in months
        required: true,
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String, // e.g., 'requested', 'approved', 'rejected', 'repaid', etc.
        default: 'requested',
    },
    repaymentSchedule: [
        {
            dueDate: {
                type: Date,
                required: true,
            },
            amountDue: {
                type: Number,
                required: true,
            },
            paid: {
                type: Boolean,
                default: false,
            },
        },
    ],

    purpose: String,
    term: Number,
    collateralDetails: String,
    
    // Legal and Identity Verification
    governmentId: String,
    
    
    // Additional Documentation
    additionalDocuments: [String],
    
    // Authorization for Automatic Payments
    autoPaymentAuthorization: Boolean,
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}
);

const Loan = mongoose.model('Loan', LoanSchema);

module.exports = Loan;
