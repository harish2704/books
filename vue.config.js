const path = require('path');
const webpack = require('webpack');

module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      filename: 'index.html'
    },
    print: {
      entry: 'src/print.js',
      filename: 'print.html'
    }
  },
  runtimeCompiler: true,
  lintOnSave: process.env.NODE_ENV !== 'production',
  configureWebpack(config) {
    Object.assign(config.resolve.alias, {
      deepmerge$: 'deepmerge/dist/umd.js',
      'frappe-charts$': 'frappe-charts/dist/frappe-charts.esm.js',
      '~': path.resolve('.')
    });

    config.module.rules.push({
      test: /\.txt$/i,
      use: 'raw-loader'
    });

    config.devtool = 'source-map';
  },
  transpileDependencies: ['frappejs']
};
