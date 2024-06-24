const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    background: './src/background/index.js',
    content: './src/content/index.js',
    popup: './src/popup/index.js',
    options: './src/options/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public' },
      ],
    }),
  ],
};
