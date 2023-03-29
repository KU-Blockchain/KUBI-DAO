// next.config.js
const path = require('path');


module.exports = {
  reactStrictMode: true,
  webpack(config) {
    config.resolve.modules.push(path.resolve('./src'));
    return config;
  },
};
