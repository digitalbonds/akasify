const mongoose = require('mongoose');

const OrganizationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Organization', OrganizationSchema);