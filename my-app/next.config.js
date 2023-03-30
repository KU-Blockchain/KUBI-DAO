const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')([]);
const path = require('path');


const nextConfig = {
  webpack: (config, { isServer }) => {
    // Resolve aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/components': path.resolve(__dirname, 'components'),
    };

    return config;
  },
};

module.exports = withPlugins([withTM], nextConfig);
