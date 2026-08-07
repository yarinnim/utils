const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config();

const defaultRule = {
  sourceCode: {
    extension: 'ts|tsx',
    use: ['babel-loader'],
    exclude: /node_modules/,
  },

  asset: {
    extension: 'jpe?g|gif|png|svg|pdf',
    type: 'asset/resource',
    exclude: /node_modules/,
  },

  style: {
    extension: 'css',
    use: ['style-loader', 'css-loader'],
  },
};


const getRule = (pRule, defaultRule) => {
  const mergedRule = { ...defaultRule, ...pRule };
  const { extension, ...restProps } = mergedRule;

  const rule = {
    ...restProps,
    test: new RegExp(`\\.(${extension})$`),
  };
  return rule;
};

const getRules = (props = {}) => {
  const { sourceCode = {}, asset = {}, style = {} } = props;
  return [
    getRule(sourceCode, defaultRule.sourceCode),
    getRule(asset, defaultRule.asset),
    getRule(style, defaultRule.style),
  ];
};


const getEnv = () => {
  const env = { 'process.env': JSON.stringify(process.env, null, 2) };
  return new webpack.DefinePlugin(env);
};

const devConfig = (mode) => {
  if (mode === 'production') {
    return { optimization: { minimize: true } };
  }
  const toPath = path.resolve('./public');

  return {
    devtool: 'inline-source-map',
    devServer: {
      static: {
        directory: toPath,
        publicPath: '/',
      },
      port: process.env.APP_PORT || 8888,
      hot: true,
      historyApiFallback: true,
    },
  };
};

const getOutput = () => {
  const toPath = path.resolve('./public');

  return {
    path: toPath,
    filename: `js/[name]-[chunkhash].bundle.js`,
    assetModuleFilename: 'assets/[name].[hash][ext][query]',
  };
};

module.exports = (env, { mode }, callback) => {
  const { rules: cbRules = {} } = callback;
  const rules = getRules(cbRules);
  const srcPath = path.resolve('./src');

  return {
    mode,
    entry: './src/Main.tsx',
    output: getOutput(),
    module: { rules },
    resolve: {
      extensions: ['.ts', '.tsx', '.js','.json'],
      alias: { '@': srcPath },
    },
    target: ['web', 'es5'],
    plugins: [
      getEnv(),
      new CopyWebpackPlugin({
        patterns: [
          './src/manifest.json',
          { from: './src/images', to: 'images' },
        ],
      }),
      new HtmlWebpackPlugin({
        title: process.env.APP_TITLE,
        template: './src/index.html',
        filename: './index.html',
        base: '/',
      }),
    ],
    ...devConfig(mode),
  };
};
