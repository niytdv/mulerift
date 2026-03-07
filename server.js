/**
 * Production server entry point with Railway compatibility
 * Handles dynamic PORT and graceful shutdown
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Global error handlers
let isShuttingDown = false;

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 UNHANDLED REJECTION:', reason);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  console.error('🚨 UNCAUGHT EXCEPTION:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

function gracefulShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`🛑 Graceful shutdown initiated by ${signal}`);
  setTimeout(() => {
    console.log('✅ Shutdown complete');
    process.exit(0);
  }, 10000);
}

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  server.listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`✅ Server ready on http://${hostname}:${port}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🐍 Python: ${process.env.NODE_ENV === 'production' ? 'python3' : 'python'}`);
  });

  const shutdown = () => {
    console.log('🛑 Closing server...');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
    setTimeout(() => {
      console.error('⚠️ Forced shutdown after timeout');
      process.exit(1);
    }, 15000);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}).catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
