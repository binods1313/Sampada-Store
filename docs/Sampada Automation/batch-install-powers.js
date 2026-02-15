/**
 * Batch Power Installer
 * Install multiple powers at once
 * Run: node batch-install-powers.js <power1> <power2> ... [--skip-errors]
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// Configuration
const REPOS_DIR = path.join(os.homedir(), '.kiro', 'powers', 'repos');
const INSTALLED_DIR = path.join(os.homedir(), '.kiro', 'powers', 'installed');

// CLI Arguments
const args = process.argv.slice(2);
const SKIP_ERRORS = args.includes('--skip-errors') || args.includes('-s');
const POWERS_TO_INSTALL = args.filter(arg => !arg.startsWith('--') && !arg.startsWith('-'));

// Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Install a single power
 */
function installPower(powerName) {
  const repoPath = path.join(REPOS_DIR, 'figma', powerName);
  const installedPath = path.join(INSTALLED_DIR, powerName);
  
  // Check if power exists in repo
  if (!fs.existsSync(repoPath)) {
    throw new Error(`Power '${powerName}' not found in repository`);
  }
  
  // Check if already installed
  if (fs.existsSync(installedPath)) {
    log(`  ⚠️  Already installed, skipping...`, 'yellow');
    return 'skipped';
  }
  
  // Check for POWER.md
  const powerMd = path.join(repoPath, 'POWER.md');
  if (!fs.existsSync(powerMd)) {
    throw new Error(`Invalid power: POWER.md not found`);
  }
  
  // Create installed directory if needed
  if (!fs.existsSync(INSTALLED_DIR)) {
    fs.mkdirSync(INSTALLED_DIR, { recursive: true });
  }
  
  // Copy power to installed directory
  fs.cpSync(repoPath, installedPath, { recursive: true });
  
  // Check for dependencies
  const content = fs.readFileSync(powerMd, 'utf8');
  const depsMatch = content.match(/dependencies:\s*\[([^\]]+)\]/);
  
  if (depsMatch) {
    const deps = depsMatch[1]
      .replace(/"/g, '')
      .split(',')
      .map(d => d.trim())
      .filter(d => d);
    
    if (deps.length > 0) {
      log(`  📦 Dependencies: ${deps.join(', ')}`, 'cyan');
    }
  }
  
  return 'installed';
}

/**
 * Main batch installation function
 */
function batchInstall() {
  log('\n📦 Batch Power Installer', 'bright');
  log('═'.repeat(60), 'blue');
  
  // Validate input
  if (POWERS_TO_INSTALL.length === 0) {
    log('\n❌ No powers specified', 'red');
    log('\n💡 Usage:', 'cyan');
    log('   node batch-install-powers.js <power1> <power2> ...', 'cyan');
    log('   node batch-install-powers.js --skip-errors <power1> <power2>', 'cyan');
    log('\n💡 Examples:', 'cyan');
    log('   node batch-install-powers.js data-analyzer api-connector', 'cyan');
    log('   node batch-install-powers.js --skip-errors power1 power2 power3', 'cyan');
    return;
  }
  
  // Check if repo exists
  const figmaRepo = path.join(REPOS_DIR, 'figma');
  if (!fs.existsSync(figmaRepo)) {
    log('\n❌ Repository not found:', 'red');
    log(`   ${figmaRepo}`, 'yellow');
    log('\n💡 Please set up the repository first', 'cyan');
    return;
  }
  
  log(`\n🎯 Installing ${POWERS_TO_INSTALL.length} power(s)...`, 'cyan');
  if (SKIP_ERRORS) {
    log('   Mode: Skip errors and continue', 'yellow');
  }
  
  // Statistics
  let installed = 0;
  let skipped = 0;
  let failed = 0;
  const results = [];
  
  // Install each power
  for (let i = 0; i < POWERS_TO_INSTALL.length; i++) {
    const powerName = POWERS_TO_INSTALL[i];
    
    log(`\n[${i + 1}/${POWERS_TO_INSTALL.length}] ${powerName}`, 'bright');
    log('─'.repeat(60), 'blue');
    
    try {
      const result = installPower(powerName);
      
      if (result === 'installed') {
        log(`  ✅ Successfully installed`, 'green');
        installed++;
        results.push({ power: powerName, status: 'success' });
      } else if (result === 'skipped') {
        skipped++;
        results.push({ power: powerName, status: 'skipped' });
      }
    } catch (error) {
      log(`  ❌ Failed: ${error.message}`, 'red');
      failed++;
      results.push({ power: powerName, status: 'failed', error: error.message });
      
      if (!SKIP_ERRORS) {
        log('\n⚠️  Installation stopped due to error', 'yellow');
        log('💡 Use --skip-errors to continue on failures', 'cyan');
        break;
      }
    }
  }
  
  // Summary
  log('\n' + '═'.repeat(60), 'blue');
  log('📊 Installation Summary', 'bright');
  log('═'.repeat(60), 'blue');
  log(`  ✅ Installed: ${installed}`, 'green');
  log(`  ⚠️  Skipped:   ${skipped}`, 'yellow');
  log(`  ❌ Failed:    ${failed}`, 'red');
  log(`  📦 Total:     ${POWERS_TO_INSTALL.length}`, 'cyan');
  
  // Show results
  if (results.length > 0) {
    log('\n📋 Detailed Results:', 'bright');
    
    const successPowers = results.filter(r => r.status === 'success');
    if (successPowers.length > 0) {
      log('\n  ✅ Successfully Installed:', 'green');
      successPowers.forEach(r => log(`     - ${r.power}`, 'green'));
    }
    
    const skippedPowers = results.filter(r => r.status === 'skipped');
    if (skippedPowers.length > 0) {
      log('\n  ⚠️  Already Installed (Skipped):', 'yellow');
      skippedPowers.forEach(r => log(`     - ${r.power}`, 'yellow'));
    }
    
    const failedPowers = results.filter(r => r.status === 'failed');
    if (failedPowers.length > 0) {
      log('\n  ❌ Failed to Install:', 'red');
      failedPowers.forEach(r => {
        log(`     - ${r.power}`, 'red');
        log(`       Reason: ${r.error}`, 'yellow');
      });
    }
  }
  
  // Next steps
  if (installed > 0) {
    log('\n💡 Next Steps:', 'bright');
    log('   - Run health check: node check-power-health.js', 'cyan');
    log('   - Configure powers in your IDE', 'cyan');
    log('   - Check power documentation in ~/.kiro/powers/installed/', 'cyan');
  }
  
  log(''); // Final newline
}

// Run batch installer
try {
  batchInstall();
} catch (error) {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  console.error(error.stack);
  process.exit(1);
}
