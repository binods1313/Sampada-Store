/**
 * Enhanced Power Health Check Script
 * Checks if installed powers are healthy, outdated, or corrupted
 * Run: node check-power-health.js [--verbose] [--fix]
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration
const REPOS_DIR = path.join(os.homedir(), '.kiro', 'powers', 'repos');
const INSTALLED_DIR = path.join(os.homedir(), '.kiro', 'powers', 'installed');
const BACKUP_DIR = path.join(os.homedir(), '.kiro', 'powers', 'backups');

// CLI Arguments
const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose') || args.includes('-v');
const AUTO_FIX = args.includes('--fix') || args.includes('-f');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function verboseLog(message) {
  if (VERBOSE) {
    log(`  └─ ${message}`, 'cyan');
  }
}

/**
 * Ensure directory exists
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    verboseLog(`Created directory: ${dirPath}`);
  }
}

/**
 * Get file hash for comparison
 */
function getFileHash(filePath) {
  try {
    const crypto = require('crypto');
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(fileBuffer).digest('hex');
  } catch (error) {
    return null;
  }
}

/**
 * Check if power has all required files
 */
function checkRequiredFiles(powerPath, powerName) {
  const required = ['POWER.md'];
  const optional = ['mcp.json', 'README.md', 'package.json'];
  const missing = [];
  const present = [];
  
  for (const file of required) {
    const filePath = path.join(powerPath, file);
    if (!fs.existsSync(filePath)) {
      missing.push(file);
    } else {
      present.push(file);
    }
  }
  
  const optionalPresent = optional.filter(file => 
    fs.existsSync(path.join(powerPath, file))
  );
  
  return { missing, present, optionalPresent, isValid: missing.length === 0 };
}

/**
 * Parse POWER.md metadata
 */
function parsePowerMetadata(powerMdPath) {
  try {
    const content = fs.readFileSync(powerMdPath, 'utf8');
    
    return {
      displayName: (content.match(/displayName:\s*"([^"]+)"/) || [])[1] || 'Unknown',
      description: (content.match(/description:\s*"([^"]+)"/) || [])[1] || 'No description',
      version: (content.match(/version:\s*"([^"]+)"/) || [])[1] || '1.0.0',
      author: (content.match(/author:\s*"([^"]+)"/) || [])[1] || 'Unknown',
      keywords: (content.match(/keywords:\s*\[([^\]]+)\]/) || [])[1]?.replace(/"/g, '').split(',').map(k => k.trim()) || [],
    };
  } catch (error) {
    return null;
  }
}

/**
 * Check if power is outdated
 */
function checkIfOutdated(installedPath, repoPath) {
  try {
    const installedMd = path.join(installedPath, 'POWER.md');
    const repoMd = path.join(repoPath, 'POWER.md');
    
    if (!fs.existsSync(repoMd)) {
      return { outdated: false, reason: 'no_repo_version' };
    }
    
    // Compare by modification time
    const installedMtime = fs.statSync(installedMd).mtime;
    const repoMtime = fs.statSync(repoMd).mtime;
    const daysDiff = Math.floor((repoMtime - installedMtime) / (1000 * 60 * 60 * 24));
    
    // Compare by hash (more accurate)
    const installedHash = getFileHash(installedMd);
    const repoHash = getFileHash(repoMd);
    const isDifferent = installedHash !== repoHash;
    
    return {
      outdated: isDifferent && repoMtime > installedMtime,
      daysDiff,
      hashDifferent: isDifferent,
      installedHash: installedHash?.substring(0, 8),
      repoHash: repoHash?.substring(0, 8),
    };
  } catch (error) {
    return { outdated: false, error: error.message };
  }
}

/**
 * Create backup of power
 */
function backupPower(powerPath, powerName) {
  try {
    ensureDir(BACKUP_DIR);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `${powerName}_${timestamp}`);
    
    fs.cpSync(powerPath, backupPath, { recursive: true });
    verboseLog(`Backed up to: ${backupPath}`);
    return backupPath;
  } catch (error) {
    log(`Failed to backup ${powerName}: ${error.message}`, 'red');
    return null;
  }
}

/**
 * Attempt to fix corrupted power
 */
function fixCorruptedPower(powerName, repoPath, installedPath) {
  if (!AUTO_FIX) {
    return false;
  }
  
  try {
    log(`  Attempting to fix ${powerName}...`, 'yellow');
    
    // Backup existing installation
    backupPower(installedPath, powerName);
    
    // Remove corrupted installation
    fs.rmSync(installedPath, { recursive: true, force: true });
    
    // Copy from repo
    fs.cpSync(repoPath, installedPath, { recursive: true });
    
    log(`  ✓ Fixed ${powerName}`, 'green');
    return true;
  } catch (error) {
    log(`  ✗ Failed to fix ${powerName}: ${error.message}`, 'red');
    return false;
  }
}

/**
 * Main health check function
 */
function checkPowerHealth() {
  log('\n🏥 Power Health Check', 'bright');
  log('═'.repeat(50), 'blue');
  
  // Verify directories exist
  if (!fs.existsSync(INSTALLED_DIR)) {
    log('\n❌ Installed powers directory not found:', 'red');
    log(`   ${INSTALLED_DIR}`, 'yellow');
    log('\n💡 Tip: Install your first power to create this directory', 'cyan');
    return;
  }
  
  const figmaRepo = path.join(REPOS_DIR, 'figma');
  const hasRepo = fs.existsSync(figmaRepo);
  
  if (!hasRepo && VERBOSE) {
    log('\n⚠️  Repository not found - cannot check for updates', 'yellow');
    log(`   ${figmaRepo}`, 'yellow');
  }
  
  // Get all installed powers
  let installedPowers;
  try {
    installedPowers = fs.readdirSync(INSTALLED_DIR).filter(item => {
      const itemPath = path.join(INSTALLED_DIR, item);
      return fs.statSync(itemPath).isDirectory();
    });
  } catch (error) {
    log(`\n❌ Error reading installed powers: ${error.message}`, 'red');
    return;
  }
  
  if (installedPowers.length === 0) {
    log('\n📦 No powers installed yet', 'yellow');
    return;
  }
  
  // Statistics
  let healthy = 0;
  let outdated = 0;
  let corrupted = 0;
  let fixed = 0;
  const issues = [];
  
  log(`\n🔍 Checking ${installedPowers.length} installed power(s)...\n`, 'cyan');
  
  // Check each power
  for (const power of installedPowers) {
    const installedPath = path.join(INSTALLED_DIR, power);
    const repoPath = path.join(figmaRepo, power);
    
    log(`📦 ${power}`, 'bright');
    
    // Check required files
    const fileCheck = checkRequiredFiles(installedPath, power);
    
    if (!fileCheck.isValid) {
      log(`   ❌ CORRUPTED - Missing: ${fileCheck.missing.join(', ')}`, 'red');
      corrupted++;
      issues.push({ 
        power, 
        issue: 'corrupted', 
        reason: `Missing files: ${fileCheck.missing.join(', ')}`,
        fixable: hasRepo && fs.existsSync(repoPath)
      });
      
      verboseLog(`Present: ${fileCheck.present.join(', ')}`);
      
      // Attempt to fix if --fix flag is set
      if (hasRepo && fs.existsSync(repoPath)) {
        if (fixCorruptedPower(power, repoPath, installedPath)) {
          fixed++;
          corrupted--;
          healthy++;
        }
      }
      continue;
    }
    
    // Parse metadata
    const metadata = parsePowerMetadata(path.join(installedPath, 'POWER.md'));
    if (metadata && VERBOSE) {
      verboseLog(`Version: ${metadata.version}`);
      verboseLog(`Description: ${metadata.description}`);
    }
    
    // Check if outdated
    if (hasRepo && fs.existsSync(repoPath)) {
      const outdatedCheck = checkIfOutdated(installedPath, repoPath);
      
      if (outdatedCheck.outdated) {
        log(`   ⚠️  OUTDATED (${outdatedCheck.daysDiff} days behind)`, 'yellow');
        outdated++;
        issues.push({ 
          power, 
          issue: 'outdated', 
          days: outdatedCheck.daysDiff,
          installedHash: outdatedCheck.installedHash,
          repoHash: outdatedCheck.repoHash
        });
        
        if (VERBOSE) {
          verboseLog(`Installed hash: ${outdatedCheck.installedHash}`);
          verboseLog(`Repo hash: ${outdatedCheck.repoHash}`);
        }
        continue;
      }
    }
    
    log(`   ✅ HEALTHY`, 'green');
    healthy++;
    
    if (VERBOSE && fileCheck.optionalPresent.length > 0) {
      verboseLog(`Optional files: ${fileCheck.optionalPresent.join(', ')}`);
    }
  }
  
  // Print summary
  log('\n' + '═'.repeat(50), 'blue');
  log('📊 Health Summary', 'bright');
  log('═'.repeat(50), 'blue');
  log(`  ✅ Healthy:   ${healthy}`, 'green');
  log(`  ⚠️  Outdated:  ${outdated}`, 'yellow');
  log(`  ❌ Corrupted: ${corrupted}`, 'red');
  if (fixed > 0) {
    log(`  🔧 Fixed:     ${fixed}`, 'green');
  }
  log(`  📦 Total:     ${healthy + outdated + corrupted}`, 'cyan');
  
  // Recommendations
  if (issues.length > 0) {
    log('\n🔧 Recommended Actions:', 'bright');
    log('─'.repeat(50), 'blue');
    
    const outdatedPowers = issues.filter(i => i.issue === 'outdated');
    if (outdatedPowers.length > 0) {
      log('\n  📥 Update outdated powers:', 'yellow');
      log('     node auto-update-powers.js', 'cyan');
      if (VERBOSE) {
        outdatedPowers.forEach(p => {
          log(`     - ${p.power} (${p.days} days behind)`, 'yellow');
        });
      }
    }
    
    const corruptedPowers = issues.filter(i => i.issue === 'corrupted');
    if (corruptedPowers.length > 0) {
      log('\n  🔨 Reinstall corrupted powers:', 'red');
      corruptedPowers.forEach(p => {
        log(`     node install-power.js ${p.power}`, 'cyan');
        if (p.reason && VERBOSE) {
          log(`     └─ ${p.reason}`, 'yellow');
        }
      });
    }
    
    if (!AUTO_FIX && corrupted > 0) {
      log('\n  💡 Tip: Run with --fix to automatically repair corrupted powers', 'cyan');
    }
  } else {
    log('\n🎉 All powers are healthy!', 'green');
  }
  
  // Usage tips
  if (VERBOSE) {
    log('\n💡 Usage Tips:', 'bright');
    log('   --verbose, -v : Show detailed information', 'cyan');
    log('   --fix, -f     : Automatically fix corrupted powers', 'cyan');
  }
  
  log(''); // Final newline
}

// Run the health check
try {
  checkPowerHealth();
} catch (error) {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  if (VERBOSE) {
    console.error(error.stack);
  }
  process.exit(1);
}
