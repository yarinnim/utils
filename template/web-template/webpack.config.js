const baseConfig = require('../../packages/web-config/webpack.config');

const styleRule = {
  use: ['style-loader', 'css-loader', 'postcss-loader'],
};

module.exports = (processor, conf) => {
  const config = baseConfig(processor, conf, {
    rules: {
      style: styleRule,
    },
  });
  return config;
};
