// Script to reset Supabase database and run migrations
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Helper function to log with colors
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Check if Supabase CLI is installed
try {
  log('Checking Supabase CLI installation...', colors.cyan);
  execSync('supabase --version', { stdio: 'ignore' });
} catch (error) {
  log('Supabase CLI is not installed. Please install it first:', colors.red);
  log('npm install -g supabase', colors.yellow);
  process.exit(1);
}

// Check if Supabase is running
try {
  log('Checking if Supabase is running...', colors.cyan);
  execSync('supabase status', { stdio: 'ignore' });
} catch (error) {
  log('Supabase is not running. Starting Supabase...', colors.yellow);
  try {
    execSync('supabase start', { stdio: 'inherit' });
  } catch (startError) {
    log('Failed to start Supabase. Please check your Supabase installation.', colors.red);
    process.exit(1);
  }
}

// Reset Supabase database
try {
  log('Resetting Supabase database...', colors.magenta);
  log('WARNING: This will delete all data in your local Supabase database!', colors.red);
  log('Press Ctrl+C to cancel or wait 5 seconds to continue...', colors.yellow);
  
  // Wait for 5 seconds before proceeding
  execSync('sleep 5 || ping -n 5 127.0.0.1 > nul', { stdio: 'ignore' });
  
  // Reset the database
  execSync('supabase db reset', { stdio: 'inherit' });
  log('Database reset successful!', colors.green);
} catch (error) {
  log('Failed to reset database:', colors.red);
  log(error.message, colors.red);
  process.exit(1);
}

// Run migrations
try {
  log('Running migrations...', colors.cyan);
  
  // Start the dev server to trigger migrations
  log('Starting development server to trigger migrations...', colors.cyan);
  log('The server will start and automatically run the migrations.', colors.yellow);
  log('You can close the server with Ctrl+C after migrations complete.', colors.yellow);
  
  // Wait for user confirmation
  log('Press Enter to start the development server...', colors.magenta);
  require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  }).question('', () => {
    try {
      execSync('npm run dev', { stdio: 'inherit' });
    } catch (error) {
      // This will execute if the user terminates the server with Ctrl+C
      log('Development server stopped.', colors.yellow);
    }
  });
} catch (error) {
  log('Failed to run migrations:', colors.red);
  log(error.message, colors.red);
  process.exit(1);
}
