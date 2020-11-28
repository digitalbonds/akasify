const express = require('express');
const router = express.Router();
const Parcel = require('@oasislabs/parcel-sdk');

//PARCEL CONFIGURATION
const configParams = {
    apiTokenSigner: {
      clientId: process.env.OASIS_CLIENT_ID,
      privateKey: process.env.OASIS_API_PRIVATE_KEY,
    },
};
const config = new Parcel.Config(configParams);

router.post('/createStep', async (req, res) => {
    try {

        const beneficiaryIdentityAddress = new Parcel.Address(req.body.beneficiaryAddress);

        const step = new Beneficiary({
            id: req.body.id,
            organizationId: req.body.organizationId,
            clientId: req.body.clientId,
            name: req.body.name,
            content: req.body.content
        });
        
        // Find the identity address associated with the private key you supplied above.
        const identityAddress = Parcel.Identity.addressFromToken(await config.tokenProvider.getToken());
        
        // Let's connect to the identity.
        const identity = await Parcel.Identity.connect(identityAddress, config);
        console.log(`Connected to identity at address ${identity.address.hex}`);
        
        // Now let's upload a dataset.
        const datasetMetadata = {
            title: `step_${step.opportunityId}_${step.id}`,
            // A (fake) example metadata URL.
            //metadataUrl: 'for what?',
        };
        const data = new TextEncoder().encode(JSON.stringify(step));
        console.log('Uploading data for our user');
        const dataset = await Parcel.Dataset.upload(data, datasetMetadata, identity, config);

        const dataset = await Parcel.Dataset.upload(
            data,
            datasetMetadata,
            // The dataset is uploaded for Bob...
            await Parcel.Identity.connect(beneficiaryIdentityAddress, config),
            // ...with Alice's credentials being used to do the upload...
            config,
            {
                // ...and Alice is flagged as the dataset's creator.
                creator: identity,
            },
        );

        // `dataset.address.hex` is your dataset's unique ID.
        console.log(`Created dataset with address ${dataset.address.hex} and uploaded to ${dataset.metadata.dataUrl}`);

        res.json(dataset.address.hex);
    } catch (err) {
        res.json(err);
        return;
    }
    res.send('Beneficiaries');
});

// router.post('/', async (req, res) => {
//     const beneficiary = new Beneficiary({
//         name: req.body.name,
//         email: req.body.email,
//         password: req.body.password
//     });
//     try {
//         const savedBeneficiary = await beneficiary.save();
//         res.json(savedBeneficiary);    
//     } catch (err) {
//         res.json(err);
//     }
// });

// router.get('/:id', async (req, res) => {
//     try {
//         const beneficiary = await Beneficiary.findById(req.params.id);
//         res.json(beneficiary);   
//     } catch (err) {
//         res.json(err);
//     }
// });

// router.delete('/:id', async (req, res) => {
//     try {
//         const beneficiary = await Beneficiary.remove({ _id: req.params.id });
//         res.json(act);   
//     } catch (err) {
//         res.json(err);
//     }
// });

// router.delete('/', async (req, res) => {
//     try {
//         const beneficiary = await Beneficiary.remove();
//         res.json(beneficiary);   
//     } catch (err) {
//         res.json(err);
//     }
// });

// router.put('/:id', async (req, res) => {
//     try {
//         const beneficiary = await Beneficiary.updateOne(
//             { 
//                 _id: req.params.id
//             },
//             {
//                 $set: {
//                     name: req.body.name,
//                     email: req.body.email,
//                     password: req.body.password
//                 }
//             });
//         res.json(beneficiary);   
//     } catch (err) {
//         res.json(err);
//     }
// });

module.exports = router;