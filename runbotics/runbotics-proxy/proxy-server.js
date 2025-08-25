require('dotenv').config();

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const parseBool = (value) => {
    return 'true' === value?.toString()?.toLowerCase();
}

const PORT = process.env.PROXY_PORT || 7777;
const IS_UI_PROXY_ENABLED = parseBool(process.env.RB_UI_PROXY_ENABLED);
const IS_LP_PROXY_ENABLED = parseBool(process.env.RB_LP_PROXY_ENABLED);
const IS_ASSISTANT_PROXY_ENABLED = parseBool(process.env.RB_ASSISTANT_PROXY_ENABLED);
const IS_PROXY_ENABLED = IS_UI_PROXY_ENABLED || IS_LP_PROXY_ENABLED;
const REMOTE_DEV_HOST = process.env.RB_DEV_HOST || 'https://runbotics-dev.clouddc.eu';


const hosts = {
    api: IS_PROXY_ENABLED ? REMOTE_DEV_HOST : 'http://127.0.0.1:8080',
    scheduler: IS_PROXY_ENABLED ? REMOTE_DEV_HOST : 'http://127.0.0.1:4000',
    ui: IS_UI_PROXY_ENABLED ? REMOTE_DEV_HOST : 'http://127.0.0.1:3000',
    landingPage: IS_LP_PROXY_ENABLED ? REMOTE_DEV_HOST : 'http://localhost:3001',
    assistant: IS_ASSISTANT_PROXY_ENABLED ? REMOTE_DEV_HOST : 'http://localhost:3003'
};

const routes = [
    { path: '/lp-assets', target: hosts.landingPage, pathFilter: '/lp-assets/**' },
    { path: '/ui-assets', target: hosts.ui, pathFilter: '/ui-assets/**' },
    
    { path: '/pl/app', target: hosts.ui, pathFilter: '/pl/app/**' },
    { path: '/pl/login', target: hosts.ui, pathFilter: '/pl/login/**' },
    { path: '/app', target: hosts.ui, pathFilter: ['/app/**', '!/pl/app/**'] },
    { path: '/login', target: hosts.ui, pathFilter: ['/login/**', '!/pl/login/**'] },
    
    { path: '/api/scheduler', target: hosts.scheduler, pathFilter: '/api/scheduler/**' },
    { path: '/api', target: hosts.api, pathFilter: ['/api/**', '!/api/scheduler/**'] },
    
    { path: '/assistant', target: hosts.assistant, pathFilter: '/assistant/**' },
    { path: '/scheduler', target: hosts.scheduler, pathFilter: ['/scheduler/**'] },
    { path: '/', target: hosts.landingPage, ws: false, }
];

const app = express();

require('events').EventEmitter.defaultMaxListeners = 9999;
process.setMaxListeners(9999);

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

const createProxy = (target, pathFilter, onError, wsEnabled = true) => {
    const config = {
        target: target,
        changeOrigin: true,
        ws: wsEnabled,
        pathFilter,
        on: {
            proxyReq: (_proxyReq, req) => console.log(`🔄 PROXY: ${req.method} ${req.url} → ${target}${req.url}`),
            proxyRes: (proxyRes, req) => console.log(`✅ PROXY RESPONSE: ${req.method} ${req.url} → ${target}${req.url} [${proxyRes.statusCode}]`),
            error: (err, req, res) => {
                console.error(`❌ PROXY ERROR for ${req.method} ${req.url} → ${target}${req.url}:`, err.message);
                if (onError) onError(err, req, res);
            }
        }
    };
    
    return createProxyMiddleware(config);
}

routes.forEach(route => {
    const wsEnabled = route.ws !== false;
    app.use(createProxy(route.target, route.pathFilter, null, wsEnabled));
});

app.use(createProxy(hosts.landingPage, [], (err, req, res) => {
    if (!res.headersSent) {
        res.status(502).json({
            error: 'Proxy Error',
            message: 'Unable to reach the target server',
            url: req.url,
            target: hosts.landingPage
        });
    }
    // Disable WebSocket for fallback
    // Otherwise this proxy implementation will try to run ws proxy multiple times
}, false));

const server = app.listen(PORT, () => {
    console.log(`🚀 Reverse proxy server running on http://localhost:${PORT}`);
    console.log(`📋 Configuration:`);
    console.log(routes)
    console.log(`   - Is proxy to remote server enabled: ${IS_PROXY_ENABLED}; UI: ${IS_UI_PROXY_ENABLED} LP: ${IS_LP_PROXY_ENABLED} ASSISTANT: ${IS_ASSISTANT_PROXY_ENABLED}`);
    console.log(`\n💡 Set RB_LP_PROXY_ENABLED, RB_UI_PROXY_ENABLED, or RB_ASSISTANT_PROXY_ENABLED to enable proxy mode`);
});

server.setMaxListeners(9999);
