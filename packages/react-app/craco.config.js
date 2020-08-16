const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
                '@primary-color': '#F26B55'
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};