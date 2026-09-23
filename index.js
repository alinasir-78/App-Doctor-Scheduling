// Main entry point for WhatsApp Doctor Scheduling Agent
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

process.on('uncaughtException', (err) => {
  console.error('🔥 UNCAUGHT EXCEPTION:', err.stack || err.message || err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 UNHANDLED REJECTION:', reason);
});

// Self-healing: If platform build step was skipped and express is missing, run npm install
const expressModulePath = path.join(__dirname, 'node_modules', 'express');
if (!fs.existsSync(expressModulePath)) {
  console.log('⚡ [Auto-Install] node_modules not detected. Installing dependencies now...');
  try {
    execSync('npm install --omit=dev', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ [Auto-Install] Dependencies installed successfully.');
  } catch (err) {
    console.error('⚠️ [Auto-Install] Failed to run automatic npm install:', err.message);
  }
}

// Cloud PaaS keep-alive (guarantees event loop stays active for web services)
setInterval(() => {}, 1000 * 60 * 60);

require('./src/server.js');
