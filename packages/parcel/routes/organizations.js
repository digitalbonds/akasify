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

router.post('/getStep', async (req, res, next) => {

    const akasifyIdentityAddress = Parcel.Identity.addressFromToken(
        await akasifyConfig.tokenProvider.getToken()
    );
    const akasifyIdentity = await Parcel.Identity.connect(akasifyIdentityAddress, akasifyConfig);
    try {

        // 1. GET THE DATASET ADDRESS
        const datasetAddress = new Parcel.Address( req.body.address );

        // 2. CONNECT TO DATASET
        const datasetToDownload = await Parcel.Dataset.connect(datasetAddress, akasifyIdentity, akasifyConfig);

        // 3. START DOWNLOAD
        const secretDataStream = datasetToDownload.download();

        // 4. CREATE FILE
        const secretDatasetWriter = secretDataStream.pipe(
            require('fs').createWriteStream('./user_data'),
        );

        // 5. UTILITY METHOD
        const streamFinished = require('util').promisify(require('stream').finished);
    
        await streamFinished(secretDatasetWriter);

        // 6. READ FILE
        const secretData = require('fs').readFileSync('./user_data').toString();

        res.json({
            datasetData: secretData
        });

    } catch (err) {
        console.log(err);
        next(err);
    }    
});

module.exports = router;