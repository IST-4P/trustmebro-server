const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../../dist/apps/services/order'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: [
        // './src/assets',
        {
          glob: 'order.proto',
          input: 'libs/interfaces/src/lib/protos',
          output: './proto',
        },
        {
          glob: 'product.proto',
          input: 'libs/interfaces/src/lib/protos',
          output: './proto',
        },
        {
          glob: 'cart.proto',
          input: 'libs/interfaces/src/lib/protos',
          output: './proto',
        },
      ],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
      sourceMaps: true,
    }),
  ],
};
