const path = require('path');

const nextConfig = {
  webpack: (config, { isServer }) => {
    // Resolve aliases
    config.resolve = {
      ...config.resolve,
      base: path.resolve(__dirname),
      alias: {
        ...config.resolve.alias,
        '@/components': path.resolve(__dirname, 'components'),
      },
    };

    return config;
  },
};

module.exports = nextConfig;
