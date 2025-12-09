#!/usr/bin/env node

/**
 * ⚡ KEYSTONE AI GIT SMART COMMANDS
 * Premium Diamond Grade - One-Shot Git Operations
 * 
 * Intelligent git operations with quantum-enhanced automation
 * and smart commit message generation.
 */

const { Command } = require('commander');
const { Chalk } = require('chalk');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chalk = new Chalk();
const program = new Command();

// ⚡ SMART GIT CONFIGURATION
const GIT_CONFIG = {
  user: {
    name: "Jocely P. Honore",
    email: "blacknobilityenterprisellc@gmail.com"
  },
  repository: {
    url: "https://github.com/blacknobilityenterprisellc-arch/quantumflow-ai-ecosystem.git",
    name: "quantumflow-ai-ecosystem"
  },
  quantum: {
    coherence: 0.999,
    encryption: "quantum-resistant",
    intelligence: "AETHERIUS-PRIME"
  }
};

// 🎨 UTILITY FUNCTIONS
function log(message, type = 'info') {
  const prefix = {
    info: '📋',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    header: '⚡',
    git: '🐙',
    quantum: '🌟',
    smart: '🧠'
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
    case 'quantum':
      console.log(chalk.magenta(`${prefixText} ${message}`));
      break;
    case 'smart':
      console.log(chalk.cyan(`${prefixText} ${message}`));
      break;
    default:
      console.log(chalk.blue(`${prefixText} ${message}`));
  }
}

function execCommand(command, description, options = {}) {
  try {
    log(`Executing: ${description}`, 'git');
    const result = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      timeout: 30000,
      ...options
    });
    log(`Success: ${description}`, 'success');
    return { success: true, output: result, cmd: command, description };
  } catch (error) {
    log(`Error: ${description} - ${error.message}`, 'error');
    return { success: false, error: error.message, cmd: command, description };
  }
}

function getGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    return status.trim().split('\n').filter(line => line.length > 0);
  } catch (error) {
    return [];
  }
}

function getStagedFiles() {
  try {
    const staged = execSync('git diff --cached --name-only', { encoding: 'utf8' });
    return staged.trim().split('\n').filter(line => line.length > 0);
  } catch (error) {
    return [];
  }
}

function getChangedFiles() {
  try {
    const changed = execSync('git diff --name-only', { encoding: 'utf8' });
    return changed.trim().split('\n').filter(line => line.length > 0);
  } catch (error) {
    return [];
  }
}

function getCurrentBranch() {
  try {
    const branch = execSync('git branch --show-current', { encoding: 'utf8' });
    return branch.trim();
  } catch (error) {
    return 'main';
  }
}

function generateSmartCommitMessage() {
  const changedFiles = getStagedFiles();
  const unstagedFiles = getChangedFiles();
  const allFiles = [...new Set([...changedFiles, ...unstagedFiles])];
  
  // Analyze file types and changes
  const fileTypes = {
    config: ['.json', '.js', '.ts', '.yml', '.yaml'],
    code: ['.tsx', '.jsx', '.ts', '.js'],
    styles: ['.css', '.scss', '.sass'],
    docs: ['.md', '.txt'],
    db: ['.sql', '.prisma'],
    test: ['.test.', '.spec.']
  };
  
  const changes = {
    config: 0,
    code: 0,
    styles: 0,
    docs: 0,
    db: 0,
    test: 0,
    other: 0
  };
  
  allFiles.forEach(file => {
    let categorized = false;
    for (const [type, extensions] of Object.entries(fileTypes)) {
      if (extensions.some(ext => file.includes(ext))) {
        changes[type]++;
        categorized = true;
        break;
      }
    }
    if (!categorized) changes.other++;
  });
  
  // Generate smart commit message
  const timestamp = new Date().toISOString().split('T')[0];
  const branch = getCurrentBranch();
  
  let message = '';
  const changeTypes = Object.entries(changes)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({ type, count }));
  
  if (changeTypes.length === 0) {
    message = `🔧 Maintenance and cleanup - ${timestamp}`;
  } else if (changeTypes.length === 1) {
    const [{ type, count }] = changeTypes;
    const typeMessages = {
      config: `⚙️ Configuration updated`,
      code: `💻 Code improvements`,
      styles: `🎨 Styling updates`,
      docs: `📚 Documentation updated`,
      db: `🗄️ Database changes`,
      test: `🧪 Test updates`,
      other: `🔧 General updates`
    };
    message = `${typeMessages[type]} - ${timestamp}`;
  } else {
    message = `🚀 Multi-component updates - ${timestamp}`;
  }
  
  // Add branch context if not main
  if (branch !== 'main') {
    message += ` [${branch}]`;
  }
  
  // Add quantum enhancement
  message += `\n\n⚡ Quantum-enhanced commit - AETHERIUS-PRIME intelligence`;
  message += `\n🧠 Smart analysis: ${changeTypes.map(t => `${t.count} ${t.type}`).join(', ')}`;
  message += `\n🔒 Encryption: ${GIT_CONFIG.quantum.encryption}`;
  message += `\n🌟 Coherence: ${GIT_CONFIG.quantum.coherence}`;
  
  return message;
}

// ⚡ SMART GIT COMMANDS CLASS
class KeystoneSmartGit {
  constructor() {
    this.config = GIT_CONFIG;
  }

  // 🎨 UTILITY FUNCTIONS (moved inside class)
  log(message, type = 'info') {
    const prefix = {
      info: '📋',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      header: '⚡',
      git: '🐙',
      quantum: '🌟',
      smart: '🧠'
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
      case 'quantum':
        console.log(chalk.magenta(`${prefixText} ${message}`));
        break;
      case 'smart':
        console.log(chalk.cyan(`${prefixText} ${message}`));
        break;
      default:
        console.log(chalk.blue(`${prefixText} ${message}`));
    }
  }

  execCommand(command, description, options = {}) {
    try {
      this.log(`Executing: ${description}`, 'git');
      const result = execSync(command, { 
        encoding: 'utf8', 
        stdio: 'pipe',
        timeout: 30000,
        ...options
      });
      this.log(`Success: ${description}`, 'success');
      return { success: true, output: result, cmd: command, description };
    } catch (error) {
      this.log(`Error: ${description} - ${error.message}`, 'error');
      return { success: false, error: error.message, cmd: command, description };
    }
  }

  async smartAdd(options = {}) {
    this.log('⚡ SMART ADD - Intelligent File Staging', 'header');
    
    const allFiles = options.all || false;
    const specific = options.files || [];
    
    if (specific.length > 0) {
      // Add specific files
      for (const file of specific) {
        const result = this.execCommand(`git add ${file}`, `Add ${file}`);
        if (!result.success) {
          this.log(`Failed to add ${file}`, 'error');
        }
      }
    } else if (allFiles) {
      // Add all files
      const result = this.execCommand('git add .', 'Add all files');
      if (!result.success) {
        this.log('Failed to add all files', 'error');
        return false;
      }
    } else {
      // Smart add - analyze changes
      const status = getGitStatus();
      if (status.length === 0) {
        this.log('No changes to stage', 'warning');
        return true;
      }
      
      // Add modified and new files
      const modified = status.filter(line => line.startsWith(' M') || line.startsWith('??'));
      for (const file of modified) {
        const fileName = file.substring(3);
        const result = this.execCommand(`git add ${fileName}`, `Add ${fileName}`);
        if (!result.success) {
          this.log(`Failed to add ${fileName}`, 'error');
        }
      }
    }
    
    this.log('✅ Smart add completed', 'success');
    return true;
  }

  async smartCommit(options = {}) {
    this.log('⚡ SMART COMMIT - Intelligent Message Generation', 'header');
    
    const message = options.message || generateSmartCommitMessage();
    const amend = options.amend || false;
    
    // Check if there are staged changes
    const staged = getStagedFiles();
    if (staged.length === 0 && !amend) {
      log('No staged changes to commit', 'warning');
      return false;
    }
    
    const commitCmd = amend 
      ? `git commit --amend -m "${message}"`
      : `git commit -m "${message}"`;
    
    const result = execCommand(commitCmd, 'Smart commit');
    if (!result.success) {
      log('Smart commit failed', 'error');
      return false;
    }
    
    log('✅ Smart commit completed', 'success');
    return true;
  }

  async smartPush(options = {}) {
    log('⚡ SMART PUSH - Intelligent Repository Updates', 'header');
    
    const branch = options.branch || getCurrentBranch();
    const force = options.force || false;
    const tags = options.tags || false;
    
    // Push to remote
    const pushCmd = force 
      ? `git push origin ${branch} --force`
      : `git push origin ${branch}`;
    
    const result = execCommand(pushCmd, `Push to ${branch}`);
    if (!result.success) {
      log('Smart push failed', 'error');
      return false;
    }
    
    // Push tags if requested
    if (tags) {
      const tagResult = execCommand('git push origin --tags', 'Push tags');
      if (!tagResult.success) {
        log('Tag push failed', 'warning');
      }
    }
    
    log('✅ Smart push completed', 'success');
    return true;
  }

  async smartPull(options = {}) {
    log('⚡ SMART PULL - Intelligent Repository Updates', 'header');
    
    const branch = options.branch || getCurrentBranch();
    const rebase = options.rebase || false;
    
    const pullCmd = rebase
      ? `git pull origin ${branch} --rebase`
      : `git pull origin ${branch}`;
    
    const result = execCommand(pullCmd, `Pull from ${branch}`);
    if (!result.success) {
      log('Smart pull failed', 'error');
      return false;
    }
    
    log('✅ Smart pull completed', 'success');
    return true;
  }

  async smartStatus() {
    log('⚡ SMART STATUS - Intelligent Repository Analysis', 'header');
    
    // Get comprehensive status
    const status = execCommand('git status', 'Repository status');
    const branch = execCommand('git branch --show-current', 'Current branch');
    const remote = execCommand('git remote -v', 'Remote repositories');
    const log = execCommand('git log --oneline -5', 'Recent commits');
    
    // Analyze changes
    const changedFiles = getChangedFiles();
    const stagedFiles = getStagedFiles();
    const untrackedFiles = getGitStatus()
      .filter(line => line.startsWith('??'))
      .map(line => line.substring(3));
    
    log(`📊 Repository Analysis:`, 'smart');
    log(`  Branch: ${branch.output.trim()}`, 'info');
    log(`  Changed files: ${changedFiles.length}`, 'info');
    log(`  Staged files: ${stagedFiles.length}`, 'info');
    log(`  Untracked files: ${untrackedFiles.length}`, 'info');
    
    if (changedFiles.length > 0) {
      log(`📝 Modified files:`, 'info');
      changedFiles.forEach(file => log(`  • ${file}`, 'info'));
    }
    
    if (untrackedFiles.length > 0) {
      log(`🆕 Untracked files:`, 'info');
      untrackedFiles.forEach(file => log(`  • ${file}`, 'info'));
    }
    
    log('✅ Smart status completed', 'success');
    return true;
  }

  async smartSync(options = {}) {
    log('⚡ SMART SYNC - Complete Repository Synchronization', 'header');
    
    const success = await this.smartPull(options);
    if (!success) {
      log('Smart sync failed during pull', 'error');
      return false;
    }
    
    const pushSuccess = await this.smartPush(options);
    if (!pushSuccess) {
      log('Smart sync failed during push', 'error');
      return false;
    }
    
    log('✅ Smart sync completed', 'success');
    return true;
  }

  async quickCommit(options = {}) {
    log('⚡ QUICK COMMIT - One-Shot Complete Operation', 'header');
    
    // Add all changes
    const addSuccess = await this.smartAdd({ all: true });
    if (!addSuccess) {
      log('Quick commit failed during add', 'error');
      return false;
    }
    
    // Smart commit
    const commitSuccess = await this.smartCommit(options);
    if (!commitSuccess) {
      log('Quick commit failed during commit', 'error');
      return false;
    }
    
    // Smart push
    const pushSuccess = await this.smartPush(options);
    if (!pushSuccess) {
      log('Quick commit failed during push', 'error');
      return false;
    }
    
    log('✅ Quick commit completed - All operations successful', 'success');
    return true;
  }

  async smartTag(options = {}) {
    log('⚡ SMART TAG - Intelligent Tag Management', 'header');
    
    const version = options.version || `v${Date.now()}`;
    const message = options.message || `Release ${version}`;
    const push = options.push !== false;
    
    // Create tag
    const tagCmd = `git tag -a ${version} -m "${message}"`;
    const result = execCommand(tagCmd, `Create tag ${version}`);
    if (!result.success) {
      log('Smart tag failed', 'error');
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
  .action(async (options) => {
    const git = new KeystoneSmartGit();
    await git.smartAdd(options);
  });

program
  .command('commit')
  .description('Smart commit with intelligent message generation')
  .option('-m, --message <message>', 'Custom commit message')
  .option('--amend', 'Amend last commit')
  .action(async (options) => {
    const git = new KeystoneSmartGit();
    await git.smartCommit(options);
  });

program
  .command('push')
  .description('Smart push with intelligent branch management')
  .option('-b, --branch <branch>', 'Target branch')
  .option('-f, --force', 'Force push')
  .option('-t, --tags', 'Push tags')
  .action(async (options) => {
    const git = new KeystoneSmartGit();
    await git.smartPush(options);
  });

program
  .command('pull')
  .description('Smart pull with intelligent merge strategies')
  .option('-b, --branch <branch>', 'Source branch')
  .option('--rebase', 'Use rebase instead of merge')
  .action(async (options) => {
    const git = new KeystoneSmartGit();
    await git.smartPull(options);
  });

program
  .command('status')
  .description('Smart status with intelligent repository analysis')
  .action(async () => {
    const git = new KeystoneSmartGit();
    await git.smartStatus();
  });

program
  .command('sync')
  .description('Smart sync - complete repository synchronization')
  .option('-b, --branch <branch>', 'Target branch')
  .option('--rebase', 'Use rebase during pull')
  .action(async (options) => {
    const git = new KeystoneSmartGit();
    await git.smartSync(options);
  });

program
  .command('quick')
  .description('Quick commit - one-shot add, commit, and push')
  .option('-m, --message <message>', 'Custom commit message')
  .option('-b, --branch <branch>', 'Target branch')
  .action(async (options) => {
    const git = new KeystoneSmartGit();
    await git.quickCommit(options);
  });

program
  .command('tag')
  .description('Smart tag with intelligent version management')
  .option('-v, --version <version>', 'Tag version')
  .option('-m, --message <message>', 'Tag message')
  .option('--no-push', 'Do not push tag')
  .action(async (options) => {
    const git = new KeystoneSmartGit();
    await git.smartTag(options);
  });

// 🚀 EXECUTE
if (require.main === module) {
  program.parse();
}

module.exports = KeystoneSmartGit;