const express = require('express');
const router = express.Router();
const Beneficiary = require('../models/Beneficiary');
const Parcel = require('@oasislabs/parcel-sdk');

//AKASIFY CONFIGURATION
const configParams = {
    apiTokenSigner: {
      clientId: process.env.OASIS_CLIENT_ID,
      privateKey: process.env.OASIS_API_PRIVATE_KEY,
    },
};
const akasifyConfig = new Parcel.Config(configParams);

router.post('/createStep', async (req, res, next) => {

    const akasifyIdentityAddress = Parcel.Identity.addressFromToken(
        await akasifyConfig.tokenProvider.getToken()
    );
    const akasifyIdentity = await Parcel.Identity.connect(akasifyIdentityAddress, akasifyConfig);
    
    try {

        // 1. GET THE BENEFICIARY ADDRESS
        const beneficiaryIdentityAddress = Parcel.Identity.addressFromToken(
            req.body.token,
        );

        // 2. BUILDING STEP
        const step = new Beneficiary({
            applicationId: req.body.applicationId,
            oppportunityId: req.body.oppportunityId,
            value: req.body.value
        });

        // // 3. BUILDING METADA
        const datasetMetadata = {
            title: "test_title", //`step_${step.beneficiaryId}_${step.opportunityId}_${step.applicationId}_${step.id}`,
            // A (fake) example metadata URL.
            //metadataUrl: 'for what?',
        };

        // // 4. BUILDING DATA
        const data = new TextEncoder().encode(JSON.stringify(step));

        // // 5. UPLOADING DATA
        const dataset = await Parcel.Dataset.upload(
            data,
            datasetMetadata,
            // The dataset is uploaded for Beneficiary...
            await Parcel.Identity.connect(beneficiaryIdentityAddress, akasifyConfig),
            // ...with Akasify's credentials being used to do the upload...
            akasifyConfig,
            {
                // ...and Akasify is flagged as the dataset's creator.
                creator: akasifyIdentity,
            },
        );

        // 6. RETURN ADDRESS
        res.json(dataset.address);

    } catch (err) {
        next(err);
    }
});

router.post('/getStep', async (req, res, next) => {

    try {

        // 1. GET THE BENEFICIARY ADDRESS
        const beneficiaryIdentityAddress = Parcel.Identity.addressFromToken(
            req.body.token,
        );

        const benficiaryConfig = new Parcel.Config({
            apiAccessToken: req.body.token
        });

        const benficiaryIdentity = await Parcel.Identity.connect(beneficiaryIdentityAddress, benficiaryConfig);

        const datasetToDownload = await Parcel.Dataset.connect(req.body.address, benficiaryIdentity, akasifyConfig);

        const secretDataStream = datasetToDownload.download();

        // 6. RETURN CONTENT
        res.json(secretDataStream);

    } catch (err) {
        next(err);
    }
});

module.exports = router;