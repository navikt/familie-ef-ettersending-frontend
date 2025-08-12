import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack from 'webpack';
import { CustomizeRule, mergeWithRules } from 'webpack-merge';

import baseConfig, {
  createHtmlWebpackPlugin,
} from './webpack.common.config.js';
import ESLintWebpackPlugin from 'eslint-webpack-plugin';

const devConfig = mergeWithRules({
  module: {
    rules: {
      test: CustomizeRule.Match,
      options: CustomizeRule.Replace,
    },
  },
})(baseConfig, {
  mode: 'development',
  entry: ['webpack-hot-middleware/client'],
  devtool: 'inline-source-map',
  plugins: [
    createHtmlWebpackPlugin(false),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
    new ESLintWebpackPlugin({
      configType: 'flat',
      extensions: [`ts`, `tsx`],
      cache: true,
      emitWarning: true,
      emitError: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(jsx|tsx|ts|js)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          plugins: ['react-refresh/babel'],
        },
      },
    ],
  },
});

export default devConfig;
