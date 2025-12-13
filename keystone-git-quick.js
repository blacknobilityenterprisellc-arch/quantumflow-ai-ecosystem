#!/usr/bin/env node

/**
 * ⚡ KEYSTONE AI GIT QUICK COMMANDS
 * Premium Diamond Grade - One-Shot Git Operations
 */

const { execSync } = require('child_process');

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m',   // Red
    header: '\x1b[35m',  // Magenta
    reset: '\x1b[0m'     // Reset
  };
  
  const prefix = {
    info: '📋',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    header: '⚡'
  };
  
  const color = colors[type] || colors.info;
  const resetColor = colors.reset;
  const prefixText = prefix[type] || prefix.info;
  
  console.log(`${color}${prefixText} ${message}${resetColor}`);
}

function execCommand(command, description) {
  try {
    log(`Executing: ${description}`, 'info');
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    log(`Success: ${description}`, 'success');
    return { success: true, output: result };
  } catch (error) {
    log(`Error: ${description} - ${error.message}`, 'error');
    return { success: false, error: error.message };
  }
}

// Quick commit function
function quickCommit(message) {
  log('⚡ QUICK COMMIT - One-Shot Complete Operation', 'header');
  
  // Generate smart commit message if not provided
  if (!message) {
    const timestamp = new Date().toISOString().split('T')[0];
    message = `⚡ Keystone AI Git Smart Commands - ${timestamp}`;
  }
  
  // Add all files
  const addResult = execCommand('git add .', 'Add all files');
  if (!addResult.success) {
    log('Quick commit failed during add', 'error');
    return false;
  }
  
  // Commit with message
  const commitResult = execCommand(`git commit -m "${message}"`, 'Commit changes');
  if (!commitResult.success) {
    log('Quick commit failed during commit', 'error');
    return false;
  }
  
  // Push to remote
  const pushResult = execCommand('git push origin main', 'Push to remote');
  if (!pushResult.success) {
    log('Quick commit failed during push', 'error');
    return false;
  }
  
  log('✅ Quick commit completed - All operations successful', 'success');
  return true;
}

// Smart status
function smartStatus() {
  log('⚡ SMART STATUS - Repository Analysis', 'header');
  
  try {
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    const status = execCommand('git status --porcelain', 'Get status');
    
    log(`Branch: ${branch}`, 'info');
    log(`Status: ${status.success && status.output.trim() ? 'Changes detected' : 'Clean'}`, 'info');
    
    return true;
  } catch (error) {
    log('Status analysis failed', 'error');
    return false;
  }
}

// Smart sync
function smartSync() {
  log('⚡ SMART SYNC - Repository Synchronization', 'header');
  
  // Pull latest changes
  const pullResult = execCommand('git pull origin main', 'Pull latest changes');
  if (!pullResult.success) {
    log('Sync failed during pull', 'error');
    return false;
  }
  
  // Push local changes
  const pushResult = execCommand('git push origin main', 'Push local changes');
  if (!pushResult.success) {
    log('Sync failed during push', 'error');
    return false;
  }
  
  log('✅ Smart sync completed', 'success');
  return true;
}

// Command line interface
const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case 'quick':
    quickCommit(args[0]);
    break;
  case 'status':
    smartStatus();
    break;
  case 'sync':
    smartSync();
    break;
  case 'add':
    execCommand('git add .', 'Add all files');
    break;
  case 'commit':
    const commitMessage = args[0] || 'Quick commit';
    execCommand(`git commit -m "${commitMessage}"`, 'Commit changes');
    break;
  case 'push':
    execCommand('git push origin main', 'Push to remote');
    break;
  default:
    log('⚡ KEYSTONE AI GIT QUICK COMMANDS', 'header');
    log('Premium Diamond Grade - One-Shot Git Operations', 'info');
    log('');
    log('USAGE:', 'info');
    log('  node keystone-git-quick.js <command> [options]', 'info');
    log('');
    log('COMMANDS:', 'info');
    log('  quick [message]     - One-shot add, commit, and push', 'info');
    log('  status             - Repository status analysis', 'info');
    log('  sync               - Pull and push synchronization', 'info');
    log('  add                - Add all files', 'info');
    log('  commit [message]    - Commit with message', 'info');
    log('  push               - Push to remote', 'info');
    log('');
    log('EXAMPLES:', 'info');
    log('  node keystone-git-quick.js quick                    # Add, commit, push all', 'info');
    log('  node keystone-git-quick.js quick "Fix bug"         # With custom message', 'info');
    log('  node keystone-git-quick.js status                    # Check repository status', 'info');
    log('  node keystone-git-quick.js sync                      # Sync with remote', 'info');
    break;
}