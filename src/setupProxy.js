const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api/v1/expiration/0/10", {
      target: `${process.env.REACT_APP_MIDDLEWARE_UAT_BASE_URL}`,
      changeOrigin: true,
    })
  ),
    app.use(
      createProxyMiddleware("/api/v1/expiration", {
        target: `${process.env.REACT_APP_MIDDLEWARE_UAT_BASE_URL}`,
        changeOrigin: true,
      })
    ),
    app.use(
      createProxyMiddleware("/api/v1/tiers/0/10", {
        target: `${process.env.REACT_APP_MIDDLEWARE_UAT_BASE_URL}`,
        changeOrigin: true,
      })
    ),
    app.use(
      createProxyMiddleware("/api/v1/tiers", {
        target: `${process.env.REACT_APP_MIDDLEWARE_UAT_BASE_URL}`,
        changeOrigin: true,
      })
    ),
    app.use(
      createProxyMiddleware("/api/v1/rule/configs", {
        target: `${process.env.REACT_APP_MIDDLEWARE_UAT_BASE_URL}`,
        changeOrigin: true,
      })
    ),
    app.use(
      createProxyMiddleware("/api/v1/rules/configs", {
        target: `${process.env.REACT_APP_MIDDLEWARE_UAT_BASE_URL}`,
        changeOrigin: true,
      })
    ),
    app.use(
      createProxyMiddleware("/api/v1/rule/configs/0/1000", {
        target: `${process.env.REACT_APP_MIDDLEWARE_UAT_BASE_URL}`,
        changeOrigin: true,
      })
    ),
    app.use(
      createProxyMiddleware("/api/v1/types/0/1000", {
        target: `${process.env.REACT_APP_MIDDLEWARE_UAT_BASE_URL}`,
        changeOrigin: true,
      })
    ),
    app.use(
      createProxyMiddleware("/api/v1/rule/tiers", {
        target: `${process.env.REACT_APP_MIDDLEWARE_UAT_BASE_URL}`,
        changeOrigin: true,
      })
    ),
    app.use(
      createProxyMiddleware("/api/v1/rule/tier/page/0/5000", {
        target: `${process.env.REACT_APP_MIDDLEWARE_UAT_BASE_URL}`,
        changeOrigin: true,
      })
    ),
    app.use(
      createProxyMiddleware("/api/v1/master/config", {
        target: `${process.env.REACT_APP_MIDDLEWARE_UAT_BASE_URL}`,
        changeOrigin: true,
      })
    ),
    app.use(
      createProxyMiddleware("/api/v1/myop/configs", {
        target: `${process.env.REACT_APP_MIDDLEWARE_UAT_BASE_URL}`,
        changeOrigin: true,
      })
    ),
    app.use(
      createProxyMiddleware("/api/v1/myop/0/5000", {
        target: `${process.env.REACT_APP_MIDDLEWARE_UAT_BASE_URL}`,
        changeOrigin: true,
      })
    ),
    app.use(
      createProxyMiddleware("/api/v1/auth/token", {
        target: `${process.env.REACT_APP_MIDDLEWARE_UAT_BASE_URL}`,
        changeOrigin: true,
      })
    ),
    app.use(
      createProxyMiddleware("/api/v1/dashboard/ledger", {
        target: `${process.env.REACT_APP_MIDDLEWARE_UAT_BASE_URL}`,
        changeOrigin: true,
      })
    ),
    app.use(
      createProxyMiddleware("/api/ledger", {
        target: `${process.env.REACT_APP_MIDDLEWARE_UAT_BASE_URL}`,
        changeOrigin: true,
      })
    ),
    app.use(
      createProxyMiddleware("/api/customer", {
        target: `${process.env.REACT_APP_MIDDLEWARE_UAT_BASE_URL}`,
        changeOrigin: true,
      })
    ),
    app.use(
      createProxyMiddleware("/auth/login", {
        target: `${process.env.REACT_APP_MIDDLEWARE_UAT_BASE_URL}`,
        changeOrigin: true,
      })
    );
};
