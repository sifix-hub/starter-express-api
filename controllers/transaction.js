const User = require('../models/user'); // Import the User model


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
  
  

  


  module.exports = { fundWallet, fundwalletCronJob }
