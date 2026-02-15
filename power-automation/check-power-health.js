/**
 * Power Health Check Script
 * Checks if installed powers are healthy, outdated, or corrupted
 * Run: node check-power-health.js
 */

const fs = require('fs');
const path = require('path');

const REPOS_DIR = 'C:\\Users\\Binod\\.kiro\\powers\\repos';
const INSTALLED_DIR = 'C:\\Users\\Binod\\.kiro\\powers\\installed';

function checkPowerHealth() {
  console.log('🏥 Checking power health...\n');
  
  if (!fs.existsSync(INSTALLED_DIR)) {
    console.log('❌ Installed powers directory not found');
    return;
  }
  
  const installedPowers = fs.readdirSync(INSTALLED_DIR);
  const figmaRepo = path.join(REPOS_DIR, 'figma');
  
  let healthy = 0;
  let outdated = 0;
  let corrupted = 0;
  const issues = [];
  
  for (const power of installedPowers) {
    const installedPath = path.join(INSTALLED_DIR, power);
    const repoPath = path.join(figmaRepo, power);
    
    // Check if power is a directory
    if (!fs.statSync(installedPath).isDirectory()) {
      continue;
    }
    
    // Check required files
    const powerMd = path.join(installedPath, 'POWER.md');
    const mcpJson = path.join(installedPath, 'mcp.json');
    
    if (!fs.existsSync(powerMd)) {
      console.log(`❌ ${power} - Missing POWER.md (corrupted)`);
      corrupted++;
      issues.push({ power, issue: 'corrupted', reason: 'Missing POWER.md' });
      continue;
    }
    
    // Check if outdated (compare with repo)
    if (fs.existsSync(repoPath) && fs.existsSync(path.join(repoPath, 'POWER.md'))) {
      const installedMtime = fs.statSync(powerMd).mtime;
      const repoMtime = fs.statSync(path.join(repoPath, 'POWER.md')).mtime;
      
      if (repoMtime > installedMtime) {
        const daysDiff = Math.floor((repoMtime - installedMtime) / (1000 * 60 * 60 * 24));
        console.log(`⚠️  ${power} - Outdated (${daysDiff} days behind repo)`);
        outdated++;
        issues.push({ power, issue: 'outdated', days: daysDiff });
        continue;
      }
    }
    
    console.log(`✅ ${power} - Healthy`);
    healthy++;
  }
  
  console.log('\n📊 Health Summary:');
  console.log(`  ✅ Healthy: ${healthy}`);
  console.log(`  ⚠️  Outdated: ${outdated}`);
  console.log(`  ❌ Corrupted: ${corrupted}`);
  console.log(`  📦 Total: ${healthy + outdated + corrupted}`);
  
  if (issues.length > 0) {
    console.log('\n🔧 Recommended Actions:');
    
    const outdatedPowers = issues.filter(i => i.issue === 'outdated');
    if (outdatedPowers.length > 0) {
      console.log('\n  Update outdated powers:');
      console.log('  node auto-update-powers.js');
    }
    
    const corruptedPowers = issues.filter(i => i.issue === 'corrupted');
    if (corruptedPowers.length > 0) {
      console.log('\n  Reinstall corrupted powers:');
      corruptedPowers.forEach(p => {
        console.log(`  node install-power.js ${p.power}`);
      });
    }
  } else {
    console.log('\n🎉 All powers are healthy!');
  }
}

checkPowerHealth();
