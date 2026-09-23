// Main entry point for WhatsApp Doctor Scheduling Agent
process.on('uncaughtException', (err) => {
  console.error('🔥 UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 UNHANDLED PROMISE REJECTION:', reason);
});

// Cloud PaaS keep-alive (guarantees event loop stays active for web services)
setInterval(() => {}, 1000 * 60 * 60);

require('./src/server.js');
