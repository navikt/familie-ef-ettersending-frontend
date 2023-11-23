import path from 'path';
import webpack from 'webpack';
import { mergeWithCustomize } from 'webpack-merge';
import common from './webpack.common';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TypeScriptTypeChecker from 'fork-ts-checker-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const config = mergeWithCustomize({
  'entry.familie-ef-ettersending': 'prepend',
  'module.rules': 'append',
})(common, {
  entry: {
    'familie-ef-ettersending': ['./src/frontend/index.tsx'],
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    runtimeChunk: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(process.cwd(), '../../src/frontend/index.html'),
      inject: 'body',
      alwaysWriteToDisk: true,
    }),
    new TypeScriptTypeChecker(),
    new webpack.NoEmitOnErrorsPlugin(),
    new CssMinimizerPlugin(),
  ],
});

export default config;
