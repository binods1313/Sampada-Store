// lib/powerLoader.js
/**
 * Power Loader - Dynamically loads and registers Kiro Powers
 * Powers are loaded from C:\Users\Binod\.kiro\powers\installed
 */

const fs = require('fs');
const path = require('path');

class PowerLoader {
  constructor() {
    this.powers = new Map();
    this.powerPath = path.join(process.env.USERPROFILE || process.env.HOME, '.kiro', 'powers', 'installed');
  }

  /**
   * Load all available powers from the powers directory
   */
  async loadPowers() {
    try {
      if (!fs.existsSync(this.powerPath)) {
        console.warn(`Powers directory not found: ${this.powerPath}`);
        return;
      }

      const powerDirs = fs.readdirSync(this.powerPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      console.log(`Found ${powerDirs.length} powers: ${powerDirs.join(', ')}`);

      for (const powerName of powerDirs) {
        try {
          await this.loadPower(powerName);
        } catch (error) {
          console.error(`Failed to load power "${powerName}":`, error.message);
        }
      }

      console.log(`Successfully loaded ${this.powers.size} powers`);
    } catch (error) {
      console.error('Error loading powers:', error);
    }
  }

  /**
   * Load a single power
   */
  async loadPower(powerName) {
    const powerDir = path.join(this.powerPath, powerName);
    const powerMdPath = path.join(powerDir, 'POWER.md');
    const packageJsonPath = path.join(powerDir, 'package.json');

    let powerConfig = {
      name: powerName,
      displayName: powerName,
      description: '',
      version: '1.0.0',
      capabilities: [],
      loaded: true
    };

    // Load package.json if exists
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      powerConfig.version = packageJson.version || '1.0.0';
      powerConfig.description = packageJson.description || '';
    }

    // Load POWER.md if exists
    if (fs.existsSync(powerMdPath)) {
      const powerMd = fs.readFileSync(powerMdPath, 'utf8');
      powerConfig.documentation = powerMd;
      
      // Extract capabilities from markdown
      const capabilitiesMatch = powerMd.match(/##\s*Capabilities\s*\n([\s\S]*?)(?=\n##|$)/i);
      if (capabilitiesMatch) {
        powerConfig.capabilities = capabilitiesMatch[1]
          .split('\n')
          .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
          .map(line => line.replace(/^[-*]\s*/, '').trim())
          .filter(Boolean);
      }
    }

    this.powers.set(powerName, powerConfig);
    console.log(`✓ Loaded power: ${powerName}`);
  }

  /**
   * Get a specific power by name
   */
  getPower(powerName) {
    return this.powers.get(powerName);
  }

  /**
   * Get all loaded powers
   */
  getAllPowers() {
    return Array.from(this.powers.values());
  }

  /**
   * Check if a power is loaded
   */
  hasPower(powerName) {
    return this.powers.has(powerName);
  }

  /**
   * Get power capabilities
   */
  getPowerCapabilities(powerName) {
    const power = this.powers.get(powerName);
    return power ? power.capabilities : [];
  }
}

// Singleton instance
let powerLoaderInstance = null;

function getPowerLoader() {
  if (!powerLoaderInstance) {
    powerLoaderInstance = new PowerLoader();
  }
  return powerLoaderInstance;
}

module.exports = { PowerLoader, getPowerLoader };
