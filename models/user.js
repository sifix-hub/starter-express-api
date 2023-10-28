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
    
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true

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
    requestedLoans: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Loan',
        },
    ],

    // Loans approved by the user
    approvedLoans: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Loan',
        },
    ],

    // Employment and Income
    employmentStatus: String,
    employer: String,
    jobTitle: String,
    monthlyIncome: Number,
    employmentDuration: String,
    
    // Financial Information
    bankStatements: [String],
    taxReturns: [String],
    payStubs: [String],
    creditScore: Number,
    outstandingDebts: [String],
    monthlyExpenses: Number,
    
    // Legal and Identity Verification
    governmentId: String,
    
    
    // References
    personalReferences: [String],
    professionalReferences: [String],
    previousLenders: [String],
    
    // Business Information (if applicable)
    businessRegistrationDocuments: [String],
    businessPlan: String,
    financialStatements: [String],
    taxIdNumber: String,
    
    // Insurance Information (if applicable)
    insuranceCoverage: String,
    
    // Authorization for Automatic Payments
    autoPaymentAuthorization: Boolean,
    

},
    { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
