/**
 * Enhanced Discover New Powers Script
 * Finds powers available in repos but not yet installed
 * Run: node discover-new-powers.js [--category <name>] [--search <term>] [--verbose]
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration
const REPOS_DIR = path.join(os.homedir(), '.kiro', 'powers', 'repos');
const INSTALLED_DIR = path.join(os.homedir(), '.kiro', 'powers', 'installed');

// CLI Arguments
const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose') || args.includes('-v');
const categoryIndex = args.indexOf('--category') || args.indexOf('-c');
const CATEGORY_FILTER = categoryIndex > -1 ? args[categoryIndex + 1] : null;
const searchIndex = args.indexOf('--search') || args.indexOf('-s');
const SEARCH_TERM = searchIndex > -1 ? args[searchIndex + 1]?.toLowerCase() : null;
const SHOW_ALL = args.includes('--all') || args.includes('-a');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Parse POWER.md metadata with enhanced fields
 */
function parsePowerMetadata(powerMdPath) {
  try {
    const content = fs.readFileSync(powerMdPath, 'utf8');
    
    return {
      displayName: (content.match(/displayName:\s*"([^"]+)"/) || [])[1] || null,
      description: (content.match(/description:\s*"([^"]+)"/) || [])[1] || 'No description available',
      version: (content.match(/version:\s*"([^"]+)"/) || [])[1] || '1.0.0',
      author: (content.match(/author:\s*"([^"]+)"/) || [])[1] || 'Unknown',
      category: (content.match(/category:\s*"([^"]+)"/) || [])[1] || 'uncategorized',
      keywords: (content.match(/keywords:\s*\[([^\]]+)\]/) || [])[1]
        ?.replace(/"/g, '')
        .split(',')
        .map(k => k.trim())
        .filter(k => k) || [],
      dependencies: (content.match(/dependencies:\s*\[([^\]]+)\]/) || [])[1]
        ?.replace(/"/g, '')
        .split(',')
        .map(d => d.trim())
        .filter(d => d) || [],
      tags: (content.match(/tags:\s*\[([^\]]+)\]/) || [])[1]
        ?.replace(/"/g, '')
        .split(',')
        .map(t => t.trim())
        .filter(t => t) || [],
    };
  } catch (error) {
    return null;
  }
}

/**
 * Check if power has additional resources
 */
function checkPowerResources(powerPath) {
  const resources = {
    hasReadme: fs.existsSync(path.join(powerPath, 'README.md')),
    hasExamples: fs.existsSync(path.join(powerPath, 'examples')),
    hasTests: fs.existsSync(path.join(powerPath, 'tests')) || fs.existsSync(path.join(powerPath, '__tests__')),
    hasPackageJson: fs.existsSync(path.join(powerPath, 'package.json')),
    hasMcpJson: fs.existsSync(path.join(powerPath, 'mcp.json')),
  };
  
  return resources;
}

/**
 * Get power size
 */
function getPowerSize(powerPath) {
  try {
    let totalSize = 0;
    
    function calculateSize(dirPath) {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          calculateSize(itemPath);
        } else {
          totalSize += stats.size;
        }
      }
    }
    
    calculateSize(powerPath);
    
    // Convert to human readable
    if (totalSize < 1024) return `${totalSize} B`;
    if (totalSize < 1024 * 1024) return `${(totalSize / 1024).toFixed(1)} KB`;
    return `${(totalSize / (1024 * 1024)).toFixed(1)} MB`;
  } catch (error) {
    return 'Unknown';
  }
}

/**
 * Check if power matches search/filter criteria
 */
function matchesCriteria(powerName, metadata) {
  if (CATEGORY_FILTER && metadata?.category?.toLowerCase() !== CATEGORY_FILTER.toLowerCase()) {
    return false;
  }
  
  if (SEARCH_TERM) {
    const searchableText = [
      powerName,
      metadata?.displayName,
      metadata?.description,
      ...(metadata?.keywords || []),
      ...(metadata?.tags || []),
    ].join(' ').toLowerCase();
    
    return searchableText.includes(SEARCH_TERM);
  }
  
  return true;
}

/**
 * Group powers by category
 */
function groupByCategory(powers) {
  const grouped = {};
  
  for (const power of powers) {
    const category = power.metadata?.category || 'uncategorized';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(power);
  }
  
  return grouped;
}

/**
 * Display power card with formatting
 */
function displayPowerCard(power, index, total) {
  const { name, metadata, resources, size, repoPath } = power;
  const displayName = metadata?.displayName || name;
  
  log(`\n${'─'.repeat(60)}`, 'blue');
  log(`📦 [${index + 1}/${total}] ${displayName}`, 'bright');
  log(`${'─'.repeat(60)}`, 'blue');
  
  // Description
  if (metadata?.description) {
    log(`   ${metadata.description}`, 'white');
  }
  
  // Metadata row
  const metaInfo = [];
  if (metadata?.version) metaInfo.push(`v${metadata.version}`);
  if (metadata?.author) metaInfo.push(`by ${metadata.author}`);
  if (metadata?.category) metaInfo.push(`[${metadata.category}]`);
  
  if (metaInfo.length > 0) {
    log(`   ${metaInfo.join(' • ')}`, 'dim');
  }
  
  // Keywords/Tags
  if (metadata?.keywords && metadata.keywords.length > 0) {
    log(`   🏷️  ${metadata.keywords.join(', ')}`, 'cyan');
  }
  
  // Resources
  if (VERBOSE && resources) {
    const resourceIcons = [];
    if (resources.hasReadme) resourceIcons.push('📖 README');
    if (resources.hasExamples) resourceIcons.push('📝 Examples');
    if (resources.hasTests) resourceIcons.push('✓ Tests');
    if (resources.hasMcpJson) resourceIcons.push('⚙️  MCP');
    
    if (resourceIcons.length > 0) {
      log(`   ${resourceIcons.join('  ')}`, 'dim');
    }
  }
  
  // Dependencies
  if (VERBOSE && metadata?.dependencies && metadata.dependencies.length > 0) {
    log(`   📦 Requires: ${metadata.dependencies.join(', ')}`, 'yellow');
  }
  
  // Size
  if (VERBOSE && size) {
    log(`   💾 Size: ${size}`, 'dim');
  }
  
  // Installation command
  log(`\n   Install: ${colors.green}node install-power.js ${name}${colors.reset}`, 'cyan');
}

/**
 * Main discovery function
 */
function discoverNewPowers() {
  log('\n🔍 Power Discovery Tool', 'bright');
  log('═'.repeat(60), 'blue');
  
  const figmaRepo = path.join(REPOS_DIR, 'figma');
  
  // Check if repo exists
  if (!fs.existsSync(figmaRepo)) {
    log('\n❌ Power repository not found:', 'red');
    log(`   ${figmaRepo}`, 'yellow');
    log('\n💡 To set up the repository:', 'cyan');
    log('   1. Create directory: mkdir -p ~/.kiro/powers/repos', 'cyan');
    log('   2. Clone repository: cd ~/.kiro/powers/repos && git clone <repo-url> figma', 'cyan');
    return;
  }
  
  // Get all powers from repo
  let allPowers;
  try {
    allPowers = fs.readdirSync(figmaRepo).filter(item => {
      const itemPath = path.join(figmaRepo, item);
      try {
        return fs.statSync(itemPath).isDirectory() && 
               fs.existsSync(path.join(itemPath, 'POWER.md'));
      } catch (error) {
        return false;
      }
    });
  } catch (error) {
    log(`\n❌ Error reading repository: ${error.message}`, 'red');
    return;
  }
  
  // Get installed powers
  const installedPowers = fs.existsSync(INSTALLED_DIR) 
    ? fs.readdirSync(INSTALLED_DIR).filter(item => {
        try {
          const itemPath = path.join(INSTALLED_DIR, item);
          return fs.statSync(itemPath).isDirectory();
        } catch (error) {
          return false;
        }
      })
    : [];
  
  // Filter for new powers or show all
  const powersToShow = SHOW_ALL 
    ? allPowers 
    : allPowers.filter(p => !installedPowers.includes(p));
  
  // Parse metadata and filter
  const powerDetails = [];
  
  for (const powerName of powersToShow) {
    const powerPath = path.join(figmaRepo, powerName);
    const powerMdPath = path.join(powerPath, 'POWER.md');
    
    const metadata = parsePowerMetadata(powerMdPath);
    
    // Apply filters
    if (!matchesCriteria(powerName, metadata)) {
      continue;
    }
    
    const resources = checkPowerResources(powerPath);
    const size = VERBOSE ? getPowerSize(powerPath) : null;
    
    powerDetails.push({
      name: powerName,
      metadata,
      resources,
      size,
      repoPath: powerPath,
      isInstalled: installedPowers.includes(powerName),
    });
  }
  
  // Statistics
  log(`\n📊 Statistics:`, 'bright');
  log(`   Total available:     ${allPowers.length}`, 'white');
  log(`   Currently installed: ${installedPowers.length}`, 'green');
  log(`   New/uninstalled:     ${powersToShow.length}`, 'yellow');
  log(`   Matching filters:    ${powerDetails.length}`, 'cyan');
  
  // Show active filters
  if (CATEGORY_FILTER || SEARCH_TERM) {
    log('\n🔎 Active Filters:', 'bright');
    if (CATEGORY_FILTER) log(`   Category: ${CATEGORY_FILTER}`, 'cyan');
    if (SEARCH_TERM) log(`   Search: ${SEARCH_TERM}`, 'cyan');
  }
  
  // Display results
  if (powerDetails.length === 0) {
    log('\n✅ No new powers found matching your criteria', 'green');
    log('💡 Try removing filters or use --all to see installed powers', 'cyan');
    return;
  }
  
  // Group by category if verbose
  if (VERBOSE && !SEARCH_TERM) {
    const grouped = groupByCategory(powerDetails);
    
    log('\n📂 Powers by Category:', 'bright');
    
    for (const [category, powers] of Object.entries(grouped)) {
      log(`\n${category.toUpperCase()}`, 'magenta');
      powers.forEach((power, idx) => {
        displayPowerCard(power, idx, powers.length);
      });
    }
  } else {
    log(`\n🆕 ${SHOW_ALL ? 'Available' : 'New'} Powers:`, 'bright');
    
    powerDetails.forEach((power, idx) => {
      displayPowerCard(power, idx, powerDetails.length);
    });
  }
  
  // Installation tips
  log('\n' + '═'.repeat(60), 'blue');
  log('💡 Quick Actions:', 'bright');
  log('═'.repeat(60), 'blue');
  log('   Install a power:     node install-power.js <name>', 'cyan');
  log('   Install all new:     node install-all-new-powers.js', 'cyan');
  log('   Use IDE panel:       Open Kiro Powers in your IDE', 'cyan');
  
  // Show installed powers if not empty
  if (!SHOW_ALL && installedPowers.length > 0 && VERBOSE) {
    log('\n📦 Currently Installed:', 'bright');
    installedPowers.forEach(p => log(`   ✓ ${p}`, 'green'));
  }
  
  // Usage tips
  log('\n💡 Usage:', 'bright');
  log('   --all, -a              : Show all powers (including installed)', 'dim');
  log('   --category <name>, -c  : Filter by category', 'dim');
  log('   --search <term>, -s    : Search in names/descriptions/keywords', 'dim');
  log('   --verbose, -v          : Show detailed information', 'dim');
  
  log(''); // Final newline
}

// Run discovery
try {
  discoverNewPowers();
} catch (error) {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  if (VERBOSE) {
    console.error(error.stack);
  }
  process.exit(1);
}
