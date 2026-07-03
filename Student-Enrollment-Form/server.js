const http = require('http');

const JPDB_HOST = 'api.login2explore.com';
const JPDB_PORT = 5577;

const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Collect request body
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        // Use the path from the client request directly (e.g., /api/iml, /api/irl)
        const targetPath = req.url;
        
        console.log(`\n=== Proxying ${req.method} ${targetPath} ===`);
        console.log('Body:', body.substring(0, 300));

        const options = {
            hostname: JPDB_HOST,
            port: JPDB_PORT,
            path: targetPath,
            method: 'POST',  // JPDB API always uses POST
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        };

        const proxyReq = http.request(options, (proxyRes) => {
            let responseBody = '';
            
            proxyRes.on('data', chunk => {
                responseBody += chunk;
            });

            proxyRes.on('end', () => {
                console.log('JPDB Response:', responseBody.substring(0, 200));
                res.writeHead(proxyRes.statusCode || 200, {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                });
                res.end(responseBody);
            });
        });

        proxyReq.on('error', (error) => {
            console.error('Proxy request error:', error.message);
            res.writeHead(500);
            res.end(JSON.stringify({ 
                status: 500, 
                message: 'Proxy error: ' + error.message 
            }));
        });

        if (body) {
            proxyReq.write(body);
        }
        proxyReq.end();
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`CORS Proxy server running at http://localhost:${PORT}`);
    console.log(`Forwarding requests to ${JPDB_HOST}:${JPDB_PORT}`);
    console.log(`\nThe proxy forwards the exact path from the client to JPDB.`);
    console.log(`  /api/iml  -> IML (Insert/Update/Delete)`);
    console.log(`  /api/irl  -> IRL (Retrieval/Query)`);
});
