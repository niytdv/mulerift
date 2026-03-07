/**
 * Production-grade error handling and graceful shutdown
 * Prevents Railway crashes from unhandled errors
 */

let isShuttingDown = false;

export function setupGlobalErrorHandlers() {
  // Catch unhandled promise rejections
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    console.error('🚨 UNHANDLED REJECTION:', reason);
    console.error('Promise:', promise);
    // Don't exit - log and continue in production
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  });

  // Catch uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    console.error('🚨 UNCAUGHT EXCEPTION:', error);
    console.error('Stack:', error.stack);
    // Exit gracefully after logging
    gracefulShutdown('UNCAUGHT_EXCEPTION');
  });

  // Graceful shutdown on SIGTERM (Railway restart)
  process.on('SIGTERM', () => {
    console.log('📡 SIGTERM received - starting graceful shutdown');
    gracefulShutdown('SIGTERM');
  });

  // Graceful shutdown on SIGINT (Ctrl+C)
  process.on('SIGINT', () => {
    console.log('📡 SIGINT received - starting graceful shutdown');
    gracefulShutdown('SIGINT');
  });
}

function gracefulShutdown(signal: string) {
  if (isShuttingDown) {
    console.log('⚠️ Shutdown already in progress');
    return;
  }

  isShuttingDown = true;
  console.log(`🛑 Graceful shutdown initiated by ${signal}`);

  // Give active requests 10 seconds to complete
  setTimeout(() => {
    console.log('✅ Shutdown complete');
    process.exit(0);
  }, 10000);
}

export function isServerShuttingDown(): boolean {
  return isShuttingDown;
}
