const express = require('express');
const router = express.Router();
const Organization = require('../models/Organization');

router.get('/', async (req, res) => {
    try {
        const organizations = await Organization.find();
        res.json(organizations);
    } catch (err) {
        res.json(err);
    }
    res.send('Organizations');
});

router.post('/readStep', async (req, res) => {
    const organization = new Organization({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    try {
        const savedOrganization = await organization.save();
        res.json(savedOrganization);    
    } catch (err) {
        res.json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id);
        res.json(organization);   
    } catch (err) {
        res.json(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const organization = await Organization.remove({ _id: req.params.id });
        res.json(organization);   
    } catch (err) {
        res.json(err);
    }
});

router.delete('/', async (req, res) => {
    try {
        const organization = await Organization.remove();
        res.json(organization);   
    } catch (err) {
        res.json(err);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const organization = await Organization.updateOne(
            { 
                _id: req.params.id
            },
            {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                }
            });
        res.json(organization);   
    } catch (err) {
        res.json(err);
    }
});

module.exports = router;