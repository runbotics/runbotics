const http = require('http');
const httpProxy = require('http-proxy');

const PORT = 8888;
const TARGET = 'https://runbotics-dev.clouddc.eu'

// For debugging: set target to localhost:8889 and run mitmproxy in reverse-proxy mode for debugging
// mitmweb --listen-port 8889 --mode reverse:https://runbotics-dev.clouddc.eu

const proxy = httpProxy.createProxyServer({
    secure: false,
    ws: true,
    changeOrigin: true, // Required, because this fixes origin for SSL; Google TLS SNI for more info.
});

proxy.on('proxyReq', (proxyReq, req, res, options) => {
    proxyReq.setHeader('origin', TARGET)
    const ref = req.headers.referer
    if (ref) {
        proxyReq.setHeader('referer', ref.replace(/https?:\/\/localhost:\d+/, TARGET))
    }
    console.log(`Proxying request to: ${req.url}`);
});
proxy.on('proxyRes', (proxyRes, req, res) => {
    console.log(`Received response for: ${req.url}, status: ${proxyRes.statusCode}`);
});

proxy.on('error', (err, req, res) => {
    console.error('Proxy error:', err);
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('Proxy error occurred' + err.message);
});

const server = http.createServer((req, res) => {
    proxy.web(req, res, { target: TARGET });
});

server.listen(PORT, () => {
    console.log(`Reverse proxy server running on port ${PORT}`);
    console.log(`Forwarding requests to ${TARGET}`);
});