const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:9000', // Backend server address
      changeOrigin: true,
    })
  );

  app.use(
    '/api2',
    createProxyMiddleware({
      target: 'http://localhost:8700', // Backend server 2 address
      changeOrigin: true,
    })
  );
  ;
  app.use(
    '/api2',
    createProxyMiddleware({
      target: 'http://localhost:9700', // Backend server 2 address
      changeOrigin: true,
    })
  );
};
