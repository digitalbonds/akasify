const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');
let port = process.env.PORT || 3000;

//MIDDLEWARES
app.use(cors());
app.use(bodyParser.json());

//IMPORT ROUTES
const organizationsRoute = require('./routes/organizations');
const beneficiariesRoute = require('./routes/beneficiaries');

app.use('/organizations', organizationsRoute);
app.use('/beneficiaries', beneficiariesRoute);

//ROUTES
app.get('/', (req, res) => {
    res.send('Welcome to Akasify App');
});


//CONNECT TO DB
mongoose.connect(
    process.env.DB_CONNECTION,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log('connected to Akasify database...'));

app.listen(port, () => {
    console.log(`Akasify is listening on port ${port}`);
});