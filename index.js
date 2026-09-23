// Main entry point for WhatsApp Doctor Scheduling Agent
process.on('uncaughtException', (err) => {
  console.error('🔥 UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 UNHANDLED PROMISE REJECTION:', reason);
});

require('./src/server.js');
