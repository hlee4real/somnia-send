const { override, addWebpackResolve } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackResolve({
    fallback: {
      '@react-native-async-storage/async-storage': path.resolve(__dirname, 'src/utils/async-storage-polyfill.js'),
    },
  }),
);