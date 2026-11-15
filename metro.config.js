/**
 * Metro config.
 *
 * Adds `Cache-Control: no-store` to every dev-server response (HTML + bundles)
 * so the Arena preview proxy and browsers never serve a stale build after
 * code changes. Metro's own defaults leave the HTML response without any
 * cache directive, which allowed the preview to show an old design.
 */
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const baseEnhance = config.server && config.server.enhanceMiddleware;

config.server = {
  ...(config.server || {}),
  enhanceMiddleware: (middleware, metroServer) => {
    const wrapped = baseEnhance ? baseEnhance(middleware, metroServer) : middleware;
    return (req, res, next) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      return wrapped(req, res, next);
    };
  },
};

module.exports = config;
