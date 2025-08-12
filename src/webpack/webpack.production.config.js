import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import { CustomizeRule, mergeWithRules } from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import baseConfig, {
  createHtmlWebpackPlugin,
} from './webpack.common.config.js';
import ESLintWebpackPlugin from 'eslint-webpack-plugin';

const prodConfig = mergeWithRules({
  module: {
    rules: {
      test: CustomizeRule.Match,
      use: CustomizeRule.Replace,
    },
  },
})(baseConfig, {
  mode: 'production',
  plugins: [
    createHtmlWebpackPlugin(true),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CssMinimizerWebpackPlugin(),
    new ESLintWebpackPlugin({
      configType: 'flat',
      extensions: [`ts`, `tsx`],
    }),
  ],
  output: {
    filename: '[name].[contenthash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                namedExport: false,
              },
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'icss',
              },
              importLoaders: 2,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserWebpackPlugin(), new CssMinimizerWebpackPlugin()],
    runtimeChunk: {
      name: 'runtime',
    },
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        styles: {
          name: 'styles',
          type: 'css/mini-extract',
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  performance: {
    maxEntrypointSize: 800000,
    maxAssetSize: 800000,
  },
});

export default prodConfig;
