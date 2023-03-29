// next.config.js

module.exports = {
  reactStrictMode: true,
  webpack(config) {
    config.resolve.modules.push(path.resolve('./src'));
    return config;
  },
};
