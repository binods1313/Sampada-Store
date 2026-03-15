// scripts/suppress-watchpack-errors.js
// This script suppresses watchpack errors for Windows system directories

const originalConsoleError = console.error;

console.error = function(...args) {
  // Filter out watchpack errors for System Volume Information
  if (args[0] && typeof args[0] === 'string' && 
      args[0].includes('Watchpack Error') && 
      args[0].includes('System Volume Information')) {
    return; // Suppress this error
  }
  originalConsoleError.apply(console, args);
};
