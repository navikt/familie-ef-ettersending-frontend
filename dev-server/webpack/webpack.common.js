import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TypeScriptTypeChecker from 'fork-ts-checker-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import process from 'process';

const config = {
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
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: { transpileOnly: true },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
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
      template: path.join(process.cwd(), '/src/frontend/index.html'),
      inject: 'body',
      alwaysWriteToDisk: true,
    }),
    new TypeScriptTypeChecker(),
    new webpack.NoEmitOnErrorsPlugin(),
    new CssMinimizerPlugin(),
  ],
};

export default config;
