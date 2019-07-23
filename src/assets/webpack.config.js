const path = require('path');
const webpack = require('webpack');
const argv = require('minimist')(process.argv.slice(2));

const isDebug = process.env.NODE_ENV === 'development';

const plugins = [];
if (isDebug) {
  const { ignoreRoutes = [] } = argv;
  if (ignoreRoutes.length) {
    plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        new RegExp(`modules\/(?=(${ignoreRoutes.split(',').join('|')}))`),
        path.resolve(__dirname, './modules/noop.js')
      )
    );
  }
}

module.exports = {
  entry: path.resolve(__dirname, './app.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  plugins,
  mode: 'development'
};
