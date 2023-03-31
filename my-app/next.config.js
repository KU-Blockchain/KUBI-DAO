/** @type {import('next').NextConfig} */
module.exports = {
  trailingSlash: true,
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    if (dev) {
      return defaultPathMap;
    }
    return {
      '/': { page: '/', query: { __nextDefaultLocale: 'en' } },
      // Add other routes here as needed
    };
  },
};
