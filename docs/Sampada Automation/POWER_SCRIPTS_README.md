# Enhanced Power Management Scripts

## Overview

These are improved and enhanced versions of the Kiro Power management scripts with better error handling, progress indicators, detailed diagnostics, and user-friendly features.

## What's New? 🎉

### check-power-health.js Improvements

#### ✨ New Features
1. **Automatic Fixing** - `--fix` flag to automatically repair corrupted powers
2. **Better Diagnostics** - File hash comparison for accurate version checking
3. **Backup System** - Automatic backups before fixing corrupted powers
4. **Colored Output** - Easy-to-read terminal colors
5. **Verbose Mode** - Detailed debugging information with `--verbose`
6. **Cross-platform** - Uses `os.homedir()` instead of hardcoded paths
7. **Enhanced Error Handling** - Graceful failure with helpful messages

#### 🔧 Technical Improvements
- MD5 hash comparison for accurate change detection
- Checks both required and optional files
- Parses metadata from POWER.md (version, author, description)
- Creates backup directory automatically
- Better timestamp formatting for backups
- Comprehensive error recovery

#### 📝 Usage
```bash
# Basic health check
node check-power-health.js

# Show detailed information
node check-power-health.js --verbose

# Automatically fix corrupted powers
node check-power-health.js --fix

# Both verbose and fix
node check-power-health.js --verbose --fix
```

#### 📊 Output Example
```
🏥 Power Health Check
══════════════════════════════════════════════════

🔍 Checking 5 installed power(s)...

📦 data-analyzer
   ✅ HEALTHY

📦 api-connector
   ⚠️  OUTDATED (15 days behind)

📦 report-generator
   ❌ CORRUPTED - Missing: POWER.md

══════════════════════════════════════════════════
📊 Health Summary
══════════════════════════════════════════════════
  ✅ Healthy:   3
  ⚠️  Outdated:  1
  ❌ Corrupted: 1
  📦 Total:     5

🔧 Recommended Actions:
─────────────────────────────────────────────────

  📥 Update outdated powers:
     node auto-update-powers.js

  🔨 Reinstall corrupted powers:
     node install-power.js report-generator
```

---

### discover-new-powers.js Improvements

#### ✨ New Features
1. **Search Functionality** - Search powers by name, description, or keywords
2. **Category Filtering** - Filter powers by category
3. **Show All Mode** - View all powers including installed ones
4. **Enhanced Metadata** - Display version, author, category, tags
5. **Resource Detection** - Shows if README, examples, tests exist
6. **Size Information** - Display power size in verbose mode
7. **Grouped Display** - Powers grouped by category in verbose mode
8. **Better Formatting** - Beautiful card-style display for each power

#### 🔧 Technical Improvements
- Parses extended metadata (category, tags, dependencies)
- Checks for additional resources (README, examples, tests)
- Calculates and displays power sizes
- Flexible filtering system
- Better error handling for missing files
- Cross-platform path handling

#### 📝 Usage
```bash
# Discover new powers
node discover-new-powers.js

# Show all powers (including installed)
node discover-new-powers.js --all

# Filter by category
node discover-new-powers.js --category automation

# Search for specific term
node discover-new-powers.js --search "data"

# Verbose mode with details
node discover-new-powers.js --verbose

# Combine filters
node discover-new-powers.js --category automation --search "api" --verbose
```

#### 📊 Output Example
```
🔍 Power Discovery Tool
════════════════════════════════════════════════════════════

📊 Statistics:
   Total available:     12
   Currently installed: 5
   New/uninstalled:     7
   Matching filters:    7

🆕 New Powers:

────────────────────────────────────────────────────────────
📦 [1/7] Advanced Data Analyzer
────────────────────────────────────────────────────────────
   Analyze complex datasets with AI-powered insights
   v2.1.0 • by DataTeam • [analytics]
   🏷️  data, analytics, visualization, insights
   📖 README  📝 Examples  ✓ Tests  ⚙️  MCP
   💾 Size: 2.4 MB

   Install: node install-power.js advanced-data-analyzer
```

---

## Installation

1. **Replace existing scripts** in your power-automation directory:
```bash
cd E:\Agentic AIs\Groq_ChainMorph\abscommerce\abscommerce\power-automation
# Backup originals
cp check-power-health.js check-power-health.js.backup
cp discover-new-powers.js discover-new-powers.js.backup
# Copy new versions
# (copy the enhanced scripts)
```

2. **No dependencies required** - Uses only Node.js built-in modules:
   - `fs` (file system)
   - `path` (path handling)
   - `os` (operating system)
   - `crypto` (for MD5 hashing)

---

## Configuration

### Directory Structure
The scripts now use cross-platform paths automatically:

**Windows:**
```
C:\Users\<username>\.kiro\powers\
  ├── repos\
  │   └── figma\
  │       ├── power1\
  │       ├── power2\
  │       └── ...
  ├── installed\
  │   ├── power1\
  │   ├── power2\
  │   └── ...
  └── backups\
      ├── power1_2026-02-15T10-30-45/
      └── ...
```

**Linux/Mac:**
```
~/.kiro/powers/
  ├── repos/
  │   └── figma/
  ├── installed/
  └── backups/
```

### Customization

If you need different paths, modify the constants at the top of each script:

```javascript
// In both scripts
const REPOS_DIR = path.join(os.homedir(), '.kiro', 'powers', 'repos');
const INSTALLED_DIR = path.join(os.homedir(), '.kiro', 'powers', 'installed');
const BACKUP_DIR = path.join(os.homedir(), '.kiro', 'powers', 'backups');
```

---

## Features Comparison

| Feature | Original | Enhanced |
|---------|----------|----------|
| Basic health check | ✅ | ✅ |
| Detect outdated | ✅ | ✅ |
| Detect corrupted | ✅ | ✅ |
| Auto-fix corrupted | ❌ | ✅ |
| Backup system | ❌ | ✅ |
| Hash comparison | ❌ | ✅ |
| Verbose mode | ❌ | ✅ |
| Colored output | ❌ | ✅ |
| Cross-platform | ❌ | ✅ |
| Search powers | ❌ | ✅ |
| Filter by category | ❌ | ✅ |
| Show resources | ❌ | ✅ |
| Power size display | ❌ | ✅ |
| Grouped display | ❌ | ✅ |
| Parse metadata | Partial | Full |
| Error handling | Basic | Comprehensive |

---

## Command Reference

### check-power-health.js

| Command | Description |
|---------|-------------|
| `node check-power-health.js` | Basic health check |
| `--verbose` or `-v` | Show detailed information |
| `--fix` or `-f` | Automatically fix corrupted powers |
| `--verbose --fix` | Detailed output + auto-fix |

### discover-new-powers.js

| Command | Description |
|---------|-------------|
| `node discover-new-powers.js` | Discover new uninstalled powers |
| `--all` or `-a` | Show all powers (including installed) |
| `--category <name>` or `-c <name>` | Filter by category |
| `--search <term>` or `-s <term>` | Search in names/descriptions |
| `--verbose` or `-v` | Show detailed information |
| Combined | Use multiple flags together |

---

## Troubleshooting

### "Directory not found" errors

**Solution:** The scripts will tell you which directories are missing. Create them:

```bash
# Windows
mkdir C:\Users\%USERNAME%\.kiro\powers\repos
mkdir C:\Users\%USERNAME%\.kiro\powers\installed

# Linux/Mac
mkdir -p ~/.kiro/powers/repos
mkdir -p ~/.kiro/powers/installed
```

### "No powers installed yet"

**Solution:** This is normal if you haven't installed any powers. Use discover script to find and install powers.

### "Repository not found"

**Solution:** Clone the powers repository:

```bash
cd ~/.kiro/powers/repos  # or C:\Users\<username>\.kiro\powers\repos on Windows
git clone <repository-url> figma
```

### "Permission denied" errors

**Solution:** Run with appropriate permissions or check file/directory ownership.

---

## Best Practices

1. **Regular Health Checks**: Run health check weekly
   ```bash
   node check-power-health.js --verbose
   ```

2. **Keep Powers Updated**: Check for new powers monthly
   ```bash
   node discover-new-powers.js --verbose
   ```

3. **Use Backups**: Always backup before manual changes
   - Automatic backups are created when using `--fix`
   - Located in `~/.kiro/powers/backups/`

4. **Search Before Install**: Use search to find specific powers
   ```bash
   node discover-new-powers.js --search "api"
   ```

5. **Category Organization**: Filter by category to explore powers
   ```bash
   node discover-new-powers.js --category automation
   ```

---

## Integration with Your Website (Sampada)

These scripts can be integrated into your website's backend to:

1. **Power Marketplace**: Display available powers to users
2. **Health Dashboard**: Show system health status
3. **Auto-updates**: Automatically check and update powers
4. **Search Interface**: Let users search and filter powers
5. **Installation API**: Provide endpoints for power installation

### Example API Integration

```javascript
// Express.js example
const { exec } = require('child_process');

// Health check endpoint
app.get('/api/powers/health', (req, res) => {
  exec('node check-power-health.js --verbose', (error, stdout) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ output: stdout });
  });
});

// Discover powers endpoint
app.get('/api/powers/discover', (req, res) => {
  const { category, search } = req.query;
  let cmd = 'node discover-new-powers.js --verbose';
  if (category) cmd += ` --category ${category}`;
  if (search) cmd += ` --search ${search}`;
  
  exec(cmd, (error, stdout) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ output: stdout });
  });
});
```

---

## Future Enhancements (Roadmap)

- [ ] JSON output mode for API integration
- [ ] Interactive mode with prompts
- [ ] Bulk operations (install/update multiple)
- [ ] Dependency resolution
- [ ] Version pinning
- [ ] Rollback functionality
- [ ] Power testing/validation
- [ ] Performance benchmarking
- [ ] Git integration for updates
- [ ] Power marketplace sync

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Run with `--verbose` to see detailed error messages
3. Check the error stack trace
4. Verify directory permissions and structure

---

## License

Same as original Kiro Powers project

---

## Changelog

### Version 2.0 (Enhanced)
- Added auto-fix functionality
- Implemented backup system
- Added search and filtering
- Enhanced metadata parsing
- Improved error handling
- Cross-platform support
- Colored terminal output
- Verbose mode
- Resource detection
- Size calculation
- Category grouping

### Version 1.0 (Original)
- Basic health checking
- Simple discovery
- Outdated detection
- Corruption detection

---

**Made with ❤️ for the Kiro Powers ecosystem**
