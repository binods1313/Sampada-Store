// server.js
/**
 * Custom Next.js server with Kiro runtime initialization
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { initializeRuntime } = require('./lib/startup');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT, 10) || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function startServer() {
  try {
    // Initialize Kiro runtime before starting the server (only log in production)
    const shouldLog = process.env.NODE_ENV === 'production' || process.env.DEBUG_KIRO === 'true';
    if (shouldLog) console.log('Initializing Kiro runtime...');
    await initializeRuntime();

    // Prepare Next.js
    await app.prepare();

    // Create HTTP server
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('internal server error');
      }
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://${hostname}:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
