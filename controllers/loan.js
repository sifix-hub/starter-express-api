const User = require('../models/user'); // Import the User model
const Loan = require('../models/loan');
const axios = require('axios');


// Controller function to get users willing to give loans
const getUsersWillingToGiveLoans = async (req, res) => {
    try {
        // Query users who are willing to give loans
        const loanProviders = await User.find({ isLoanProvider: true });

        // Prepare the response data
        const loanProviderDetails = loanProviders.map(user => ({
            userId: user._id,
            fullName: `${user.fullName}`,
            location: user.statePreference,
            loanConditions: user.loanConditions,
            maxLoanAmount: user.maxLoanAmount,
            allowableLoanDuration: user.allowableLoanDuration,
            interestRate: user.interestRate,
        }));


        res.status(200).json(loanProviderDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching loan providers' });
    }
};


// Endpoint for users to indicate their willingness to lend money
const indicateLendUser = async (req, res) => {
    try {
        constuser  = req.user; // Assume you have a way to identify the user

        if (!constuser) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        // Find the user by their ID
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update the user's profile with lending-related details
        user.isLoanProvider = true;
        user.maxLoanAmount = req.body.maxLoanAmount;
        user.totalFunds = req.body.totalFunds;
        user.interestRate = req.body.interestRate;
        user.statePreference = req.body.statePreference;
        user.allowableLoanDuration = req.body.allowableLoanDuration;
        user.repaymentPlan = req.body.repaymentPlan;
        user.loanConditions = req.body.loanConditions;
        user.requiredDocuments = req.body.requiredDocuments;

        // Save the updated user profile
        await user.save();
        

        res.status(201).json({ message: 'User profile updated successfully.', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


const requestLoan = async (req, res) => {
    try {
        const borrower = await User.findById(req.user._id); // The user requesting the loan
        const lender = await User.findById(req.params.lenderId); // The ID of the lender
        const {maxLoanAmount, allowableLoanDuration, repaymentPlan} = await User.findById(req.params.lenderId);
        const eligible = await checkBorrowerEligibility(borrower, lender, maxLoanAmount, allowableLoanDuration);
        // Check if the borrower meets the lender's guidelines
        // Implement your logic to validate credit score, previous lending, and more

        // If the borrower meets the guidelines, create a loan request

        if(eligible){
            const loanRequest = new Loan({
                requestedBy: req.user._id,
                approvedBy: lender._Id,
                amount: lender.maxLoanAmount,
                durationMonths: lender.allowableLoanDuration,
                repaymentPlan: lender.repaymentPlan,
                interestRate: lender.interestRate,
                description: lender.loanConditions,
                status:"initiated",  //'requested', 'approved', 'rejected', 'repaid',
                del_flg:"N"
                // Add more fields as needed
            });
    
            // Save the loan request
            await loanRequest.save();
    
            res.status(201).json({ message: 'Loan request created successfully.' });
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const getGivenLoans = async (req, res) => {
    try {
        const user = req.user; // The authenticated user

        // Find all loans where the user is the lender
        const givenLoans = await Loan.find({ approvedBy: user._id }).populate('requestedBy', 'user_id');

        res.status(200).json(givenLoans);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching given loans' });
    }
};


// Controller function to get all the loans requested by the user
const getRequestedLoans = async (req, res) => {
    try {
        const user = req.user; // The authenticated user

        // Find all loans where the user is the borrower
        const requestedLoans = await Loan.find({requestedBy : user._id }).populate('approvedBy', 'user_id');

        res.status(200).json(requestedLoans);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching requested loans' });
    }
};



const checkBorrowerEligibility = async (borrower, lender, loanAmount, loanDuration) => {
    try {
        // Check the borrower's credit score
        /**
        getCreditScoreByBVN(borrower.bvn, searchReason)
        .then((creditScoreData) => {
        if (creditScoreData) {
            console.log('Credit Score Data:', creditScoreData);
        } else {
            console.log('Failed to retrieve credit score data.');
        }
        });
        **/
        if (borrower.creditScore < 50) {
            throw new Error('Borrower credit score is too low.');
        }

        // Check if the borrower has a history of previous lending
        /**
        if (borrower.approvedLoans.some((loan) => loan.lender.equals(lenderId))) {
            throw new Error('Borrower has a history of lending from this lender.');
        }
**/
        // Check if the loan amount is within the lender's range
        //const lender = await User.findById(lenderId);
        if (!lender) {
            throw new Error('Lender not found.');
        }

        if (loanAmount < lender.minLoanAmount || loanAmount > lender.maxLoanAmount) {
            throw new Error('Loan amount is outside of the lender\'s range.');
        }

        // Check if the loan duration is acceptable
        if (loanDuration < borrower.minLoanDuration || loanDuration > borrower.maxLoanDuration) {
            throw new Error('Loan duration is outside of the borrower\'s range.');
        }

        // Additional checks can be added as needed, such as verifying documents, income, etc.

        return true; // Borrower meets the guidelines
    } catch (error) {
        throw error; // Borrower does not meet the guidelines, throw an error
    }
};



// Function to get the credit score of a customer by BVN
async function getCreditScoreByBVN(bvn, reason, allowLocalSearch = true) {
  try {
    // Define the API endpoint URL
    const apiUrl = `https://devapi.fcmb.com/credit-registry-api/api/Search/Report/ByBVN`;

    // Set your request headers, including the x-correlation-id
    const headers = {
      'x-correlation-id': 'your-correlation-id', // Replace with your actual correlation ID
    };

    // Define the request parameters
    const params = {
      biometricId: bvn,         // Customer's BVN
      reason,                   // Search reason
      allowLocalSearch,         // Default is true
    };

    // Make an HTTP GET request to the API
    const response = await axios.get(apiUrl, { params, headers });

    // Check if the response status is OK (200)
    if (response.status === 200) {
      // The credit score data can be accessed using response.data
      return response.data;
    } else {
      // Handle other response statuses as needed
      console.error('Request failed with status', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error making the API request:', error);
    return null;
  }
}




module.exports = {
    getUsersWillingToGiveLoans,indicateLendUser, requestLoan, getGivenLoans, getRequestedLoans
};
