const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser');
const helmet = require('helmet');
const app = express()
const connectDB = require('./config/db')

require('dotenv').config()

app.use(morgan('dev'));
app.use(helmet());
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
    res.status(200).send("Hello World!");
});

const port = process.env.PORT
connectDB()
app.listen(port, () => {
    console.log('listening on port' + port);
});
