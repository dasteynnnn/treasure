const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        createProxyMiddleware("/api/credit/**", { target: "http://localhost:5000" })
    );
};