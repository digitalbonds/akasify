const express = require('express');
const router = express.Router();
const Beneficiary = require('../models/Beneficiary');

router.get('/', async (req, res) => {
    try {
        const beneficiaries = await Beneficiary.find();
        res.json(beneficiaries);
    } catch (err) {
        res.json(err);
    }
    res.send('Beneficiaries');
});

router.post('/', async (req, res) => {
    const beneficiary = new Beneficiary({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    try {
        const savedBeneficiary = await beneficiary.save();
        res.json(savedBeneficiary);    
    } catch (err) {
        res.json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const beneficiary = await Beneficiary.findById(req.params.id);
        res.json(beneficiary);   
    } catch (err) {
        res.json(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const beneficiary = await Beneficiary.remove({ _id: req.params.id });
        res.json(act);   
    } catch (err) {
        res.json(err);
    }
});

router.delete('/', async (req, res) => {
    try {
        const beneficiary = await Beneficiary.remove();
        res.json(beneficiary);   
    } catch (err) {
        res.json(err);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const beneficiary = await Beneficiary.updateOne(
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
        res.json(beneficiary);   
    } catch (err) {
        res.json(err);
    }
});

module.exports = router;