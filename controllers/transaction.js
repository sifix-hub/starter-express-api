const User = require('../models/user'); // Import the User model
const Transaction = require('../models/transaction');


// Endpoint to fund the wallet
const fundWallet = async (req, res) => {

    const {_id, email} = await User.findById(req.user._id);
    const {  amount, card } = req.body;
  
    try {
      // Initialize the Paystack transaction
      const response = await axios.post(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
        email,
        amount: amount * 100, // Amount in kobo (1 Naira = 100 kobo),
        card,
      }, {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      });
  
      const { data: { authorization_url } } = response;
  
      // You can save the transaction details in your database for future reference if needed

      // Save the transaction details to MongoDB
        const transaction = new Transaction({
           userId: _id,
            amount,
            status: 'initialized',
            reference,
        });
        await transaction.save();
    
       
 
  
      res.json({ authorization_url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Payment initialization failed' });
    }
  };



  // Endpoint to handle successful transactions (Paystack Webhook)
const fundwalletCronJob = async (req, res) => {
    const event = req.body;
  
    if (event.event === 'charge.success') {
      // Update the user's wallet balance
      const userId = event.data.customer.id;
      const amount = event.data.amount / 100;
  
      if (walletDB[userId]) {
        walletDB[userId] += amount;
      } else {
        walletDB[userId] = amount;
      }
  
      // Update the transaction status in the MongoDB database
      const reference = event.data.reference;
      const updatedTransaction = await Transaction.findOneAndUpdate(
        { reference },
        { $set: { status: 'success' } },
        { new: true }
      );
  
      // Create an audit log entry for the successful transaction
      const auditLog = new AuditLog({
        transactionId: updatedTransaction._id,
        event: 'charge.success',
        // Add more fields to log relevant information
      });
      await auditLog.save();
  
      // You can also log the transaction for auditing purposes
    }
  
    res.status(200).end();
  };
  
  
  const transferFund = async (req, res) => {
    try {
      // Get sender's user ID from the authenticated user
      const senderID = req.user._id;
  
      // Extract data from the request body
      const { recipientUsername, amount, pin } = req.body;
  
      // Find the recipient's user by username
      const recipientUser = await User.findOne({ username: recipientUsername });
  
      // Verify sender's PIN (you should have proper PIN validation logic)
      const isPinValid = validatePin(senderID, pin);
      if (!isPinValid) {
        return res.status(400).json({ message: 'Invalid PIN' });
      }
  
      if (!recipientUser) {
        return res.status(400).json({ message: 'Recipient not found' });
      }
  
      // Check sender's balance (you should have proper balance checking logic)
      const isSufficientBalance = checkSufficientBalance(senderID, amount);
      if (!isSufficientBalance) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
  
      // Create a transaction record for fund transfer
      const transfer = new Transaction({
        senderID,
        recipientID: recipientUser._id, // Use recipient's user ID
        amount,
        timestamp: new Date(),
        type: 'Fund Transfer', // Specify the transaction type
        status: 'Completed',
      });
  
      // Save the transaction record
      await transfer.save();
  
      // Deduct the amount from the sender's account and update the recipient's account
      updateAccounts(senderID, recipientUser._id, amount);
  
      res.status(200).json({ message: 'Funds transferred successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  const updateAccounts = (senderID, recipientID, amount) => {
    // Deduct funds from sender's account
    const senderAccount = getAccountByID(senderID);
    senderAccount.balance -= amount;
  
    // Add funds to the recipient's account
    const recipientAccount = getAccountByID(recipientID);
    recipientAccount.balance += amount;
  
    // Save the updated account information
    saveAccount(senderAccount);
    saveAccount(recipientAccount);
  };
  
  // Replace the following functions with your actual data access functions.
  
  const getAccountByID = (Id) => {
    // Fetch the user account using the provided ID
    return User.findById(Id);
  };
  
  const saveAccount = async (account) => {
    try {
      // Update the user's account in your data storage (e.g., MongoDB)
      await User.findByIdAndUpdate(account._id, { balance: account.balance });
    } catch (error) {
      // Handle any errors that may occur during account update
      console.error('Error updating account:', error);
    }
  };
  
  const checkSufficientBalance = async (senderID, amount) => {
    try {
      // Fetch the sender's account from your data storage (e.g., MongoDB)
      const senderAccount = await User.findById(senderID);
  
      if (!senderAccount) {
        // The sender's account doesn't exist
        return false;
      }
  
      if (senderAccount.balance >= amount) {
        // Sufficient balance to perform the transfer
        return true;
      } else {
        // Insufficient balance
        return false;
      }
    } catch (error) {
      // Handle any errors that may occur during the balance check
      console.error('Error checking balance:', error);
      return false;
    }
  };
  

  module.exports = { fundWallet, fundwalletCronJob, transferFund }
