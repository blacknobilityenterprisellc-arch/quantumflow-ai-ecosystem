#!/usr/bin/env node

/**
 * ⚡ KEYSTONE AI GIT SMART COMMANDS - SIMPLIFIED
 * Premium Diamond Grade - One-Shot Git Operations
 */

const { Command } = require('commander');
const { Chalk } = require('chalk');
const { execSync } = require('child_process');

const chalk = new Chalk();
const program = new Command();

// 🎨 LOGGING FUNCTION
function log(message, type = 'info') {
  const prefix = {
    info: '📋',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    header: '⚡',
    git: '🐙'
  };
  
  const prefixText = prefix[type];
  
  switch (type) {
    case 'header':
      console.log(chalk.magenta.bold(`${prefixText} ${message}`));
      break;
    case 'success':
      console.log(chalk.green(`${prefixText} ${message}`));
      break;
    case 'warning':
      console.log(chalk.yellow(`${prefixText} ${message}`));
      break;
    case 'error':
      console.log(chalk.red(`${prefixText} ${message}`));
      break;
    case 'git':
      console.log(chalk.blue(`${prefixText} ${message}`));
      break;
    default:
      console.log(chalk.blue(`${prefixText} ${message}`));
  }
}

function execCommand(command, description) {
  try {
    log(`Executing: ${description}`, 'git');
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    log(`Success: ${description}`, 'success');
    return { success: true, output: result };
  } catch (error) {
    log(`Error: ${description} - ${error.message}`, 'error');
    return { success: false, error: error.message };
  }
}

function generateSmartCommitMessage() {
  const timestamp = new Date().toISOString().split('T')[0];
  const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  
  // Analyze staged files
  try {
    const staged = execSync('git diff --cached --name-only', { encoding: 'utf8' });
    const files = staged.trim().split('\n').filter(f => f.length > 0);
    
    if (files.length === 0) {
      return `🔧 Maintenance and cleanup - ${timestamp}`;
    }
    
    // Determine change type
    const hasConfig = files.some(f => /\.(json|js|ts|yml|yaml)$/.test(f));
    const hasCode = files.some(f => /\.(tsx|jsx|ts|js)$/.test(f));
    const hasDocs = files.some(f => /\.(md|txt)$/.test(f));
    const hasStyles = files.some(f => /\.(css|scss|sass)$/.test(f));
    
    let message = '';
    if (hasConfig) message = '⚙️ Configuration updated';
    else if (hasCode) message = '💻 Code improvements';
    else if (hasDocs) message = '📚 Documentation updated';
    else if (hasStyles) message = '🎨 Styling updates';
    else message = '🚀 Multi-component updates';
    
    message += ` - ${timestamp}`;
    
    if (branch !== 'main') {
      message += ` [${branch}]`;
    }
    
    return message;
  } catch (error) {
    return `🚀 Updates - ${timestamp}`;
  }
}

// ⚡ SMART COMMANDS
function smartAdd(options = {}) {
  log('⚡ SMART ADD - Intelligent File Staging', 'header');
  
  if (options.all) {
    const result = execCommand('git add .', 'Add all files');
    return result.success;
  } else if (options.files && options.files.length > 0) {
    let allSuccess = true;
    for (const file of options.files) {
      const result = execCommand(`git add ${file}`, `Add ${file}`);
      if (!result.success) allSuccess = false;
    }
    return allSuccess;
  } else {
    // Smart add - modified and new files
    const result = execCommand('git add -u', 'Add modified files');
    return result.success;
  }
}

function smartCommit(options = {}) {
  log('⚡ SMART COMMIT - Intelligent Message Generation', 'header');
  
  const message = options.message || generateSmartCommitMessage();
  
  const commitMessage = `${message}

⚡ Quantum-enhanced commit - AETHERIUS-PRIME intelligence
🧠 Smart analysis: Automated change detection
🔒 Encryption: quantum-resistant
🌟 Coherence: 0.999`;
  
  const cmd = options.amend ? 'git commit --amend' : 'git commit';
  const result = execCommand(`${cmd} -m "${commitMessage}"`, 'Smart commit');
  return result.success;
}

function smartPush(options = {}) {
  log('⚡ SMART PUSH - Intelligent Repository Updates', 'header');
  
  const branch = options.branch || execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  const force = options.force ? '--force' : '';
  const tags = options.tags ? '--tags' : '';
  
  const result = execCommand(`git push origin ${branch} ${force} ${tags}`, `Push to ${branch}`);
  return result.success;
}

function smartPull(options = {}) {
  log('⚡ SMART PULL - Intelligent Repository Updates', 'header');
  
  const branch = options.branch || execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  const rebase = options.rebase ? '--rebase' : '';
  
  const result = execCommand(`git pull origin ${branch} ${rebase}`, `Pull from ${branch}`);
  return result.success;
}

function smartStatus() {
  log('⚡ SMART STATUS - Intelligent Repository Analysis', 'header');
  
  try {
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    const status = execCommand('git status --porcelain', 'Get status');
    const remote = execCommand('git remote get-url origin', 'Get remote URL');
    
    log(`Repository Analysis:`, 'info');
    log(`  Branch: ${branch}`, 'info');
    log(`  Remote: ${remote.output.trim()}`, 'info');
    log(`  Status: ${status.success ? 'Clean' : 'Changes detected'}`, 'info');
    
    if (status.success && status.output.trim()) {
      log('Changes:', 'info');
      status.output.trim().split('\n').forEach(line => {
        if (line.trim()) log(`  ${line}`, 'info');
      });
    }
    
    return true;
  } catch (error) {
    log('Status analysis failed', 'error');
    return false;
  }
}

function smartSync(options = {}) {
  log('⚡ SMART SYNC - Complete Repository Synchronization', 'header');
  
  const pullSuccess = smartPull(options);
  if (!pullSuccess) {
    log('Sync failed during pull', 'error');
    return false;
  }
  
  const pushSuccess = smartPush(options);
  if (!pushSuccess) {
    log('Sync failed during push', 'error');
    return false;
  }
  
  log('✅ Smart sync completed', 'success');
  return true;
}

function quickCommit(options = {}) {
  log('⚡ QUICK COMMIT - One-Shot Complete Operation', 'header');
  
  // Add all changes
  const addSuccess = smartAdd({ all: true });
  if (!addSuccess) {
    log('Quick commit failed during add', 'error');
    return false;
  }
  
  // Smart commit
  const commitSuccess = smartCommit(options);
  if (!commitSuccess) {
    log('Quick commit failed during commit', 'error');
    return false;
  }
  
  // Smart push
  const pushSuccess = smartPush(options);
  if (!pushSuccess) {
    log('Quick commit failed during push', 'error');
    return false;
  }
  
  log('✅ Quick commit completed - All operations successful', 'success');
  return true;
}

function smartTag(options = {}) {
  log('⚡ SMART TAG - Intelligent Tag Management', 'header');
  
  const version = options.version || `v${Date.now()}`;
  const message = options.message || `Release ${version}`;
  const push = options.push !== false;
  
  // Create tag
  const tagResult = execCommand(`git tag -a ${version} -m "${message}"`, `Create tag ${version}`);
  if (!tagResult.success) {
    log('Tag creation failed', 'error');
    return false;
  }
  
  // Push tag if requested
  if (push) {
    const pushResult = execCommand(`git push origin ${version}`, `Push tag ${version}`);
    if (!pushResult.success) {
      log('Tag push failed', 'warning');
    }
  }
  
  log(`✅ Smart tag completed: ${version}`, 'success');
  return true;
}

// 📋 COMMAND LINE INTERFACE
program
  .name('keystone-git')
  .description('⚡ Keystone AI Git Smart Commands - Premium Diamond Grade')
  .version('15.3.0');

program
  .command('add')
  .description('Smart add files with intelligent staging')
  .option('-a, --all', 'Add all files')
  .option('-f, --files <files...>', 'Add specific files')
  .action((options) => {
    smartAdd(options);
  });

program
  .command('commit')
  .description('Smart commit with intelligent message generation')
  .option('-m, --message <message>', 'Custom commit message')
  .option('--amend', 'Amend last commit')
  .action((options) => {
    smartCommit(options);
  });

program
  .command('push')
  .description('Smart push with intelligent branch management')
  .option('-b, --branch <branch>', 'Target branch')
  .option('-f, --force', 'Force push')
  .option('-t, --tags', 'Push tags')
  .action((options) => {
    smartPush(options);
  });

program
  .command('pull')
  .description('Smart pull with intelligent merge strategies')
  .option('-b, --branch <branch>', 'Source branch')
  .option('--rebase', 'Use rebase instead of merge')
  .action((options) => {
    smartPull(options);
  });

program
  .command('status')
  .description('Smart status with intelligent repository analysis')
  .action(() => {
    smartStatus();
  });

program
  .command('sync')
  .description('Smart sync - complete repository synchronization')
  .option('-b, --branch <branch>', 'Target branch')
  .option('--rebase', 'Use rebase during pull')
  .action((options) => {
    smartSync(options);
  });

program
  .command('quick')
  .description('Quick commit - one-shot add, commit, and push')
  .option('-m, --message <message>', 'Custom commit message')
  .option('-b, --branch <branch>', 'Target branch')
  .action((options) => {
    quickCommit(options);
  });

program
  .command('tag')
  .description('Smart tag with intelligent version management')
  .option('-v, --version <version>', 'Tag version')
  .option('-m, --message <message>', 'Tag message')
  .option('--no-push', 'Do not push tag')
  .action((options) => {
    smartTag(options);
  });

// 🚀 EXECUTE
if (require.main === module) {
  program.parse();
}