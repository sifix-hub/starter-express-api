const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser');
const helmet = require('helmet');
const app = express()
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
const connectDB = require('./config/db')

require('dotenv').config()

app.use(morgan('dev'));
app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://eager-lime-windbreaker"],
    },
  }));
app.use(bodyParser.json());
app.use(express.json());

app.use(express.json());
app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'x-access-token', 'X-Requested-With', 'Accept', 'Access-Control-Allow-Headers', 'Access-Control-Request-Headers', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Credentials'],

    }
))
app.get('/', (req, res) => {
    try {
        // Code that may cause an error
        // For example, trying to connect to an external URL

        // Simulate an error (replace this with your actual error condition)
        //throw new Error('Failed to connect to the URL');

        // If the code succeeds, you can send a success response
        res.status(200).send("Hello World!");
    } catch (error) {
        // Log the actual error details
        console.error('Error:', error);

        // Send an error response with a status code and error message
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/', require('./routes/user'))
const port = process.env.PORT
connectDB()
app.listen(port, () => {
    console.log('listening on port ' + port);
});

//sign a user for testing purpose
const jwt = require('jsonwebtoken');
const token = jwt.sign({ email: 'Ines83@gmail.com' }, process.env.JWT_SECRET, { expiresIn: '1h' })
console.log(token);

