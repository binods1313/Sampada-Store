/**
 * Discover New Powers Script
 * Finds powers available in repos but not yet installed
 * Run: node discover-new-powers.js
 */

const fs = require('fs');
const path = require('path');

const REPOS_DIR = 'C:\\Users\\Binod\\.kiro\\powers\\repos';
const INSTALLED_DIR = 'C:\\Users\\Binod\\.kiro\\powers\\installed';

function discoverNewPowers() {
  console.log('🔍 Discovering new powers...\n');
  
  const figmaRepo = path.join(REPOS_DIR, 'figma');
  
  if (!fs.existsSync(figmaRepo)) {
    console.log('❌ Figma repo not found at:', figmaRepo);
    console.log('💡 Run: git clone <repo-url> in repos directory');
    return;
  }
  
  // Get all powers from repo
  const allPowers = fs.readdirSync(figmaRepo).filter(item => {
    const itemPath = path.join(figmaRepo, item);
    try {
      return fs.statSync(itemPath).isDirectory() && 
             fs.existsSync(path.join(itemPath, 'POWER.md'));
    } catch (error) {
      return false;
    }
  });
  
  // Get installed powers
  const installedPowers = fs.existsSync(INSTALLED_DIR) 
    ? fs.readdirSync(INSTALLED_DIR).filter(item => {
        const itemPath = path.join(INSTALLED_DIR, item);
        return fs.statSync(itemPath).isDirectory();
      })
    : [];
  
  const newPowers = allPowers.filter(p => !installedPowers.includes(p));
  
  console.log(`📊 Power Statistics:`);
  console.log(`  Total available: ${allPowers.length}`);
  console.log(`  Currently installed: ${installedPowers.length}`);
  console.log(`  New/uninstalled: ${newPowers.length}\n`);
  
  if (newPowers.length > 0) {
    console.log('🆕 New powers available:\n');
    
    for (const power of newPowers) {
      const powerMdPath = path.join(figmaRepo, power, 'POWER.md');
      
      try {
        const content = fs.readFileSync(powerMdPath, 'utf8');
        
        // Extract metadata from POWER.md frontmatter
        const nameMatch = content.match(/displayName:\s*"([^"]+)"/);
        const descMatch = content.match(/description:\s*"([^"]+)"/);
        const keywordsMatch = content.match(/keywords:\s*\[([^\]]+)\]/);
        
        const displayName = nameMatch ? nameMatch[1] : power;
        const description = descMatch ? descMatch[1] : 'No description';
        const keywords = keywordsMatch ? keywordsMatch[1].replace(/"/g, '') : '';
        
        console.log(`  📦 ${displayName}`);
        console.log(`     ${description}`);
        if (keywords) {
          console.log(`     Keywords: ${keywords}`);
        }
        console.log(`     Install: node install-power.js ${power}`);
        console.log('');
      } catch (error) {
        console.log(`  📦 ${power}`);
        console.log(`     (Unable to read details)`);
        console.log('');
      }
    }
    
    console.log('💡 To install a power:');
    console.log('   node install-power.js <power-name>');
    console.log('\n💡 Or use Kiro Powers panel in the IDE');
  } else {
    console.log('✅ All available powers are already installed!');
  }
  
  // Show installed powers
  if (installedPowers.length > 0) {
    console.log('\n📦 Currently installed powers:');
    installedPowers.forEach(p => console.log(`  - ${p}`));
  }
}

discoverNewPowers();
