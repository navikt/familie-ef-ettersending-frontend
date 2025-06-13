import path from 'path';
import webpack from 'webpack';
import { mergeWithCustomize } from 'webpack-merge';
import common from './webpack.common.js';
import process from 'process';

const config = mergeWithCustomize({
  'entry.familie-ef-ettersending': 'prepend',
  'module.rules': 'append',
})(common, {
  mode: 'development',
  entry: {
    'familie-ef-ettersending': [
      'webpack-hot-middleware/client?reload=true&overlay=false',
    ],
  },
  output: {
    path: path.join(process.cwd(), '../../frontend_development'),
    filename: '[name].[hash].js',
    publicPath: '/assets/',
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.(less)$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'icss',
              },
              importLoaders: 1,
            },
          },
        ],
      },
    ],
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
});

export default config;
