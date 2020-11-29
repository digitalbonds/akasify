const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Parcel = require('@oasislabs/parcel-sdk');
require('dotenv/config');
let port = process.env.PORT || 3000;

//MIDDLEWARES
app.use(cors());
app.use(bodyParser.json());

//IMPORT ROUTES
const beneficiariesRoute = require('./routes/beneficiaries');
const organizationsRoute = require('./routes/organizations');
app.use('/beneficiaries', beneficiariesRoute);
app.use('/organizations', organizationsRoute);

//ROUTES
app.get('/', (req, res) => {
    res.send('Welcome to Akasify App');  
});

app.listen(port, () => {
    console.log(`Akasify is listening on port ${port}`);
});