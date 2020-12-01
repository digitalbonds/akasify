const express = require('express');
const router = express.Router();
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
        const beneficiaryIdentityAddress = new Parcel.Address(req.body.beneficiaryAddress);

        // 2. BUILDING STEP
        const step = {
            data: req.body.value
        };

        // // 3. BUILDING METADA
        const datasetMetadata = {
            title: "opportunity_step",
            // A (fake) example metadata URL.
            //metadataUrl: 'not useful for this use case',
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
                creator: akasifyIdentity
            },
        );

        // 6. RETURN ADDRESS
        res.json( {
            datasetAddress: dataset.address._hex
        });

    } catch (err) {
        next(err);
    }
});

router.post('/getStep', async (req, res, next) => {

    const akasifyIdentityAddress = Parcel.Identity.addressFromToken(
        await akasifyConfig.tokenProvider.getToken()
    );
    const akasifyIdentity = await Parcel.Identity.connect(akasifyIdentityAddress, akasifyConfig);
    try {

        // 1. GET THE DATASET ADDRESS
        const datasetAddress = new Parcel.Address( req.body.datasetAddress );

        // 2. CONNECT TO DATASET
        const datasetToDownload = await Parcel.Dataset.connect(datasetAddress, akasifyIdentity, akasifyConfig);

        // 3. START DOWNLOAD
        const secretDataStream = datasetToDownload.download();

        // 4. CREATE FILE
        const secretDatasetWriter = secretDataStream.pipe(
            require('fs').createWriteStream('./dataset_data'),
        );

        // 5. UTILITY METHOD
        const streamFinished = require('util').promisify(require('stream').finished);
    
        await streamFinished(secretDatasetWriter);

        // 6. READ FILE
        const secretData = require('fs').readFileSync('./dataset_data').toString();

        res.json({
            datasetData: secretData.data
        });

    } catch (err) {
        console.log(err);
        next(err);
    }    
});

module.exports = router;