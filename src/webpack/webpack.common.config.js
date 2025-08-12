import path from 'path';

import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin.js';
import webpackModule from 'webpack';

import { unslash } from '../shared-utils/unslash.js';
const { DefinePlugin } = webpackModule;

export const publicUrl = '/public';

export const createHtmlWebpackPlugin = (prodMode) => {
  return new HtmlWebpackPlugin({
    template: path.join(process.cwd(), 'src/frontend/public/index.html'),
    inject: 'body',
    alwaysWriteToDisk: true,
    // Dette gjør at hvis vi navigerer direkte til /basepath/om-barna/ så henter vi fortsatt main.js fra /basepath/main.js
    // Det trengs kun i prod-mode, i dev-mode tar webpackDevMiddleware seg av alt
    publicPath: prodMode ? process.env.BASE_PATH ?? '/' : 'auto',
  });
};

const commonConfig = {
  mode: 'production',
  entry: ['./src/frontend/index.tsx'],
  plugins: [
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
      PUBLIC_URL: (process.env.BASE_PATH ?? '/') + publicUrl.substr(1),
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/frontend/public/manifest.json', to: '.' + publicUrl },
        { from: 'src/frontend/public/favicon.ico', to: '.' + publicUrl },
        { from: 'src/frontend/public/robots.txt', to: '.' + publicUrl },
      ],
    }),
    new CaseSensitivePathsPlugin(),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.BASE_PATH': JSON.stringify(process.env.BASE_PATH ?? '/'),
      'process.env.ENV': JSON.stringify(process.env.ENV),
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(process.cwd(), 'dist/'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false, // Fikser at man ikke kan gjøre import uten filextension fra moduler med type: module i package.json
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        exclude: /node_modules/,
        loader: 'file-loader',
        options: {
          name: `${unslash(publicUrl)}/[name].[ext]`,
        },
      },
      {
        test: /\.(jsx|tsx|ts|js)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};

export default commonConfig;
