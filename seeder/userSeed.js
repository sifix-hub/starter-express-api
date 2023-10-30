const User = require('../models/user'); // Import your User model
const { faker }  = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

// Function to seed the user model with random data
const seedUsers = async () => {
  try {
    

    // Define the number of users you want to create
    const numberOfUsers = 1;

    for (let i = 0; i < numberOfUsers; i++) {
      
      const username = faker.internet.userName();
      const email = faker.internet.email();
      const phone = faker.internet.phone();
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const fullName = firstName + ' ' + lastName;
      const passwordplain = faker.internet.password();
      const password = bcrypt.hashSync(passwordplain, 12);
      const employmentStatus = faker.person.jobType();
      const employer = faker.company.name();
      const jobTitle = faker.person.jobTitle();
      const monthlyIncome = faker.number.float({ precision: 0.1 });
      // Financial Information
      const bankStatements = [faker.lorem.words(), faker.lorem.words()];
      const taxReturns = [faker.lorem.words(), faker.lorem.words()];
      const payStubs = [faker.lorem.words(), faker.lorem.words()];
      const creditScore = faker.number.int({ min: 0, max: 100 });
      const outstandingDebts = [faker.lorem.words(), faker.lorem.words()];
      const monthlyExpenses = faker.string.numeric();
      // Legal and Identity Verification
      const governmentId = faker.lorem.words();
      // References
      const personalReferences = [faker.person.firstName(), faker.person.lastName()];
      const professionalReferences = [faker.person.firstName(), faker.person.lastName()];
      const previousLenders = [faker.company.name(), faker.company.name()];
      // Business Information
      const businessRegistrationDocuments = [faker.lorem.words(), faker.lorem.words()];
      const businessPlan = faker.lorem.sentence();
      const financialStatements = [faker.lorem.words(), faker.lorem.words()];
      const taxIdNumber = faker.lorem.words();
      // Insurance Information
      const insuranceCoverage = faker.lorem.word();
      // Authorization for Automatic Payments
      const autoPaymentAuthorization = faker.datatype.boolean();
      // User Settings
      const isLoanProvider = faker.datatype.boolean();
      const maxLoanAmount = faker.number.float({ precision: 0.1 });
      const totalFunds = faker.number.float({ precision: 0.1 });
      const interestRate = faker.number.int({ min: 0, max: 100 });
      const bvn = faker.string.numeric(10);
      const statePreference = faker.location.state();
      const allowableLoanDuration = faker.number.int({ min: 1, max: 365 });
      const repaymentPlan = faker.lorem.word();
      const loanConditions = faker.lorem.sentence();
      const requiredDocuments = faker.lorem.sentence();
      const accountNo = await generateUniqueAccountNo();
      // Create a new user
      const user = new User({
        
        username,
        email,
        fullName,
        phone,
        passwordplain,
        password,
        employmentStatus,
        employer,
        jobTitle,
        monthlyIncome,
        bankStatements,
        taxReturns,
        payStubs,
        creditScore,
        outstandingDebts,
        monthlyExpenses,
        governmentId,
        personalReferences,
        professionalReferences,
        previousLenders,
        businessRegistrationDocuments,
        businessPlan,
        financialStatements,
        taxIdNumber,
        insuranceCoverage,
        autoPaymentAuthorization,
        isLoanProvider,
        maxLoanAmount,
        totalFunds,
        interestRate,
        statePreference,
        allowableLoanDuration,
        repaymentPlan,
        loanConditions,
        requiredDocuments,
        bvn,
        accountNo
      });

      await user.save(); // Save the user to the database
    }

    console.log('User data seeded successfully.');
  } catch (error) {
    console.error('Error seeding user data:', error);
  } finally {
    
  }
};

const generateUniqueAccountNo = async () => {
    let accountNo;
    do {
      // Generate a random 9-digit number and add '8' as the first digit
      accountNo = '8' + Math.floor(100000000 + Math.random() * 900000000);
      // Check if the accountNo already exists in the database
      const existingUser = await User.findOne({ accountNo });
    } while (existingUser);
    return accountNo;
  };
  


module.exports = seedUsers;
