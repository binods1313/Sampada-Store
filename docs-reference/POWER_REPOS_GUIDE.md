# Power Repositories Guide - What They Are & How to Automate

## 📁 What Are Power Repos?

The `C:\Users\Binod\.kiro\powers\repos` directory contains **Git repositories** for Kiro powers. These are the source code repositories that powers are built from, similar to how you clone GitHub repos for development.

### Current Repos (4 folders)

1. **amazon-aurora-dsql** - Empty (placeholder)
2. **amazon-aurora-postgresql** - AWS MCP Servers repository
3. **figma** - Kiro Powers repository (contains multiple powers)
4. **saas-builder** - Kiro Powers repository (duplicate of figma)
5. **terraform** - Kiro Powers repository (duplicate of figma)

---

## 🔍 What's Inside These Repos?

### Structure Pattern

Each repo follows this pattern:
```
repos/
├── figma/                    # Main repo
│   ├── .git/                 # Git repository
│   ├── .kiro/                # Kiro configuration
│   ├── figma/                # Individual power folder
│   │   ├── POWER.md          # Power documentation
│   │   └── mcp.json          # MCP server configuration
│   ├── saas-builder/         # Another power
│   ├── terraform/            # Another power
│   ├── stripe/               # Another power
│   └── README.md             # Repository documentation
```

### Key Insight 💡

The `figma`, `saas-builder`, and `terraform` folders in `repos/` are **the same repository** - they're all clones of the **Kiro Powers Repository** which contains 19+ different powers!

---

## 🎯 Purpose of These Repos

### 1. Power Development
- Source code for building new powers
- Templates and examples
- Testing and validation

### 2. Power Updates
- Pull latest changes from upstream
- Get new power releases
- Update existing powers

### 3. Power Customization
- Modify existing powers
- Create custom powers
- Test changes locally

---

## 🤖 Automation Opportunities

### 1. Auto-Update Powers (High Priority)

**Problem:** Powers can become outdated, missing new features and bug fixes.

**Solution:** Automated update script

```javascript
// auto-update-powers.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPOS_DIR = 'C:\\Users\\Binod\\.kiro\\powers\\repos';
const INSTALLED_DIR = 'C:\\Users\\Binod\\.kiro\\powers\\installed';

async function updatePowerRepos() {
  console.log('🔄 Updating power repositories...\n');
  
  const repos = fs.readdirSync(REPOS_DIR);
  
  for (const repo of repos) {
    const repoPath = path.join(REPOS_DIR, repo);
    const gitPath = path.join(repoPath, '.git');
    
    if (!fs.existsSync(gitPath)) {
      console.log(`⏭️  Skipping ${repo} (not a git repo)`);
      continue;
    }
    
    console.log(`📦 Updating ${repo}...`);
    
    try {
      // Fetch latest changes
      execSync('git fetch origin', { cwd: repoPath, stdio: 'inherit' });
      
      // Check if updates available
      const status = execSync('git status -uno', { cwd: repoPath }).toString();
      
      if (status.includes('Your branch is behind')) {
        console.log(`  ⬇️  Updates available, pulling...`);
        execSync('git pull origin main', { cwd: repoPath, stdio: 'inherit' });
        console.log(`  ✅ ${repo} updated successfully`);
      } else {
        console.log(`  ✅ ${repo} is up to date`);
      }
    } catch (error) {
      console.error(`  ❌ Error updating ${repo}:`, error.message);
    }
    
    console.log('');
  }
}

async function syncInstalledPowers() {
  console.log('🔄 Syncing installed powers...\n');
  
  // List all powers in repos
  const figmaRepo = path.join(REPOS_DIR, 'figma');
  const powers = fs.readdirSync(figmaRepo).filter(item => {
    const itemPath = path.join(figmaRepo, item);
    return fs.statSync(itemPath).isDirectory() && 
           fs.existsSync(path.join(itemPath, 'POWER.md'));
  });
  
  console.log(`Found ${powers.length} powers in repository`);
  
  for (const power of powers) {
    const sourcePath = path.join(figmaRepo, power);
    const destPath = path.join(INSTALLED_DIR, power);
    
    if (fs.existsSync(destPath)) {
      console.log(`  🔄 Updating ${power}...`);
      // Copy updated files
      copyRecursive(sourcePath, destPath);
      console.log(`  ✅ ${power} updated`);
    } else {
      console.log(`  ⏭️  ${power} not installed, skipping`);
    }
  }
}

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    for (const file of files) {
      if (file === '.git') continue; // Skip .git folder
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Run updates
(async () => {
  await updatePowerRepos();
  await syncInstalledPowers();
  console.log('🎉 Power update complete!');
})();
```

**Usage:**
```bash
node auto-update-powers.js
```

**Schedule:** Run weekly or monthly

---

### 2. Discover New Powers (Medium Priority)

**Problem:** You might not know about new powers that get added to the repository.

**Solution:** Power discovery script

```javascript
// discover-new-powers.js
const fs = require('fs');
const path = require('path');

const REPOS_DIR = 'C:\\Users\\Binod\\.kiro\\powers\\repos';
const INSTALLED_DIR = 'C:\\Users\\Binod\\.kiro\\powers\\installed';

function discoverNewPowers() {
  console.log('🔍 Discovering new powers...\n');
  
  const figmaRepo = path.join(REPOS_DIR, 'figma');
  
  if (!fs.existsSync(figmaRepo)) {
    console.log('❌ Figma repo not found');
    return;
  }
  
  const allPowers = fs.readdirSync(figmaRepo).filter(item => {
    const itemPath = path.join(figmaRepo, item);
    return fs.statSync(itemPath).isDirectory() && 
           fs.existsSync(path.join(itemPath, 'POWER.md'));
  });
  
  const installedPowers = fs.existsSync(INSTALLED_DIR) 
    ? fs.readdirSync(INSTALLED_DIR) 
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
      const content = fs.readFileSync(powerMdPath, 'utf8');
      
      // Extract description from POWER.md frontmatter
      const descMatch = content.match(/description:\s*"([^"]+)"/);
      const keywordsMatch = content.match(/keywords:\s*\[([^\]]+)\]/);
      
      const description = descMatch ? descMatch[1] : 'No description';
      const keywords = keywordsMatch ? keywordsMatch[1] : '';
      
      console.log(`  📦 ${power}`);
      console.log(`     ${description}`);
      console.log(`     Keywords: ${keywords}`);
      console.log('');
    }
    
    console.log('💡 To install a power, use Kiro Powers panel or copy from repos to installed folder');
  } else {
    console.log('✅ All available powers are already installed!');
  }
}

discoverNewPowers();
```

**Usage:**
```bash
node discover-new-powers.js
```

---

### 3. Power Health Check (Medium Priority)

**Problem:** Installed powers might be outdated or corrupted.

**Solution:** Health check script

```javascript
// check-power-health.js
const fs = require('fs');
const path = require('path');

const REPOS_DIR = 'C:\\Users\\Binod\\.kiro\\powers\\repos';
const INSTALLED_DIR = 'C:\\Users\\Binod\\.kiro\\powers\\installed';

function checkPowerHealth() {
  console.log('🏥 Checking power health...\n');
  
  const installedPowers = fs.readdirSync(INSTALLED_DIR);
  const figmaRepo = path.join(REPOS_DIR, 'figma');
  
  let healthy = 0;
  let outdated = 0;
  let corrupted = 0;
  
  for (const power of installedPowers) {
    const installedPath = path.join(INSTALLED_DIR, power);
    const repoPath = path.join(figmaRepo, power);
    
    // Check if power exists
    if (!fs.statSync(installedPath).isDirectory()) {
      continue;
    }
    
    // Check required files
    const powerMd = path.join(installedPath, 'POWER.md');
    const mcpJson = path.join(installedPath, 'mcp.json');
    
    if (!fs.existsSync(powerMd)) {
      console.log(`❌ ${power} - Missing POWER.md (corrupted)`);
      corrupted++;
      continue;
    }
    
    // Check if outdated
    if (fs.existsSync(repoPath)) {
      const installedMtime = fs.statSync(powerMd).mtime;
      const repoMtime = fs.statSync(path.join(repoPath, 'POWER.md')).mtime;
      
      if (repoMtime > installedMtime) {
        console.log(`⚠️  ${power} - Outdated (repo version is newer)`);
        outdated++;
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
  
  if (outdated > 0) {
    console.log('\n💡 Run auto-update-powers.js to update outdated powers');
  }
}

checkPowerHealth();
```

---

### 4. Clean Up Duplicate Repos (Low Priority)

**Problem:** `figma`, `saas-builder`, and `terraform` folders are duplicates of the same repo.

**Solution:** Cleanup script

```javascript
// cleanup-duplicate-repos.js
const fs = require('fs');
const path = require('path');

const REPOS_DIR = 'C:\\Users\\Binod\\.kiro\\powers\\repos';

function cleanupDuplicates() {
  console.log('🧹 Cleaning up duplicate repositories...\n');
  
  const duplicates = ['saas-builder', 'terraform'];
  const keep = 'figma';
  
  console.log(`Keeping: ${keep}`);
  console.log(`Removing: ${duplicates.join(', ')}\n`);
  
  for (const dup of duplicates) {
    const dupPath = path.join(REPOS_DIR, dup);
    
    if (fs.existsSync(dupPath)) {
      console.log(`🗑️  Removing ${dup}...`);
      fs.rmSync(dupPath, { recursive: true, force: true });
      console.log(`  ✅ Removed`);
    } else {
      console.log(`  ⏭️  ${dup} not found, skipping`);
    }
  }
  
  console.log('\n✅ Cleanup complete!');
  console.log(`\n💡 All powers are still available in ${keep} folder`);
}

// Confirm before running
console.log('⚠️  WARNING: This will delete duplicate repository folders');
console.log('   saas-builder and terraform folders will be removed');
console.log('   All powers will still be available in figma folder\n');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Continue? (yes/no): ', (answer) => {
  if (answer.toLowerCase() === 'yes') {
    cleanupDuplicates();
  } else {
    console.log('❌ Cleanup cancelled');
  }
  readline.close();
});
```

---

### 5. Automated Power Installation (High Priority)

**Problem:** Installing new powers manually is tedious.

**Solution:** Power installer script

```javascript
// install-power.js
const fs = require('fs');
const path = require('path');

const REPOS_DIR = 'C:\\Users\\Binod\\.kiro\\powers\\repos';
const INSTALLED_DIR = 'C:\\Users\\Binod\\.kiro\\powers\\installed';

function installPower(powerName) {
  console.log(`📦 Installing ${powerName}...\n`);
  
  const figmaRepo = path.join(REPOS_DIR, 'figma');
  const sourcePath = path.join(figmaRepo, powerName);
  const destPath = path.join(INSTALLED_DIR, powerName);
  
  // Check if power exists in repo
  if (!fs.existsSync(sourcePath)) {
    console.log(`❌ Power '${powerName}' not found in repository`);
    console.log(`\n💡 Available powers:`);
    
    const powers = fs.readdirSync(figmaRepo).filter(item => {
      const itemPath = path.join(figmaRepo, item);
      return fs.statSync(itemPath).isDirectory() && 
             fs.existsSync(path.join(itemPath, 'POWER.md'));
    });
    
    powers.forEach(p => console.log(`  - ${p}`));
    return;
  }
  
  // Check if already installed
  if (fs.existsSync(destPath)) {
    console.log(`⚠️  ${powerName} is already installed`);
    console.log(`   Use auto-update-powers.js to update it`);
    return;
  }
  
  // Copy power to installed directory
  console.log(`📋 Copying files...`);
  copyRecursive(sourcePath, destPath);
  
  console.log(`✅ ${powerName} installed successfully!`);
  console.log(`\n📍 Location: ${destPath}`);
  console.log(`\n💡 Restart Kiro to load the new power`);
}

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    for (const file of files) {
      if (file === '.git') continue;
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Get power name from command line
const powerName = process.argv[2];

if (!powerName) {
  console.log('Usage: node install-power.js <power-name>');
  console.log('Example: node install-power.js stripe');
  process.exit(1);
}

installPower(powerName);
```

**Usage:**
```bash
node install-power.js stripe
node install-power.js postman
node install-power.js neon
```

---

## 🎯 Recommended Automation Workflow

### Daily/Weekly Tasks

1. **Check for updates**
   ```bash
   node check-power-health.js
   ```

2. **Update if needed**
   ```bash
   node auto-update-powers.js
   ```

### Monthly Tasks

1. **Discover new powers**
   ```bash
   node discover-new-powers.js
   ```

2. **Install interesting powers**
   ```bash
   node install-power.js <power-name>
   ```

### One-Time Tasks

1. **Clean up duplicates** (optional)
   ```bash
   node cleanup-duplicate-repos.js
   ```

---

## 📦 Available Powers in Repository

Based on the README, here are 19+ powers available:

### Infrastructure & Deployment
- **aws-agentcore** - Build AI agents with Amazon Bedrock
- **aws-infrastructure-as-code** - CDK and CloudFormation
- **cloud-architect** - AWS infrastructure with CDK
- **terraform** - Terraform workflows (already installed)

### Observability
- **cloudwatch-application-signals** - AWS monitoring
- **datadog** - Datadog observability
- **dynatrace** - Dynatrace observability

### Design & Development
- **figma** - Design to code (already installed)
- **postman** - API testing
- **power-builder** - Build custom powers

### SaaS & Payments
- **saas-builder** - Multi-tenant SaaS (already installed)
- **stripe** - Stripe payments
- **strands** - Build agents with Strands SDK

### Databases
- **neon** - Serverless Postgres

### And more...

---

## 🚀 Quick Start

### 1. Create automation scripts folder
```bash
cd abscommerce
mkdir power-automation
cd power-automation
```

### 2. Create the scripts
Copy the scripts above into separate files:
- `auto-update-powers.js`
- `discover-new-powers.js`
- `check-power-health.js`
- `install-power.js`
- `cleanup-duplicate-repos.js`

### 3. Run health check
```bash
node check-power-health.js
```

### 4. Discover new powers
```bash
node discover-new-powers.js
```

### 5. Install a new power
```bash
node install-power.js stripe
```

---

## 💡 Power Recommendations for Sampada

Based on your e-commerce platform, consider installing:

### High Priority
1. **stripe** - Enhanced Stripe integration (you already use Stripe)
2. **postman** - API testing for your REST APIs
3. **neon** - Serverless Postgres (alternative to Cloud SQL)

### Medium Priority
4. **datadog** or **dynatrace** - Production monitoring
5. **aws-infrastructure-as-code** - If migrating to AWS
6. **power-builder** - If you want to create custom powers

### Low Priority
7. **strands** - If building AI agents
8. **cloud-architect** - AWS infrastructure patterns

---

## 🔒 Security Considerations

1. **Git credentials** - Repos might need authentication for private repos
2. **API keys** - MCP configurations may contain sensitive data
3. **Backup** - Always backup before running cleanup scripts
4. **Testing** - Test automation scripts on a copy first

---

## 📝 Summary

**What are power repos?**
- Git repositories containing source code for Kiro powers
- Used for development, updates, and customization

**Why automate?**
- Keep powers up to date automatically
- Discover new powers as they're released
- Maintain power health and integrity
- Simplify power installation

**What to automate?**
1. ✅ Auto-update powers (high priority)
2. ✅ Discover new powers (medium priority)
3. ✅ Health checks (medium priority)
4. ✅ Power installation (high priority)
5. ⚠️  Cleanup duplicates (low priority, optional)

**Next steps:**
1. Create automation scripts folder
2. Run health check to see current status
3. Discover new powers you might want
4. Set up weekly update automation
5. Install powers relevant to Sampada (stripe, postman, neon)
