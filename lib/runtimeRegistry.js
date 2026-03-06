// lib/runtimeRegistry.js
/**
 * Runtime Registry - Global registry for Powers and Skills
 * Provides namespace separation and conflict resolution
 */

const { getPowerLoader } = require('./powerLoader');
const { getSkillLoader } = require('./skillLoader');

class RuntimeRegistry {
  constructor() {
    this.initialized = false;
    this.powerLoader = getPowerLoader();
    this.skillLoader = getSkillLoader();
    this.registry = {
      powers: new Map(),
      skills: new Map(),
      conflicts: []
    };
  }

  /**
   * Initialize the runtime registry
   * Loads all powers and skills at startup
   */
  async initialize() {
    const shouldLog = process.env.NODE_ENV === 'production' || process.env.DEBUG_KIRO === 'true';
    
    if (this.initialized) {
      if (shouldLog) console.log('Runtime registry already initialized');
      return;
    }

    if (shouldLog) console.log('Initializing runtime registry...');

    try {
      // Load powers
      await this.powerLoader.loadPowers();
      const powers = this.powerLoader.getAllPowers();
      powers.forEach(power => {
        this.registry.powers.set(power.name, power);
      });

      // Load skills
      await this.skillLoader.loadSkills();
      const skills = this.skillLoader.getAllSkills();
      skills.forEach(skill => {
        this.registry.skills.set(skill.name, skill);
      });

      // Check for conflicts
      this.detectConflicts();

      this.initialized = true;
      if (shouldLog) console.log(`✓ Runtime registry initialized with ${this.registry.powers.size} powers and ${this.registry.skills.size} skills`);
      
      if (this.registry.conflicts.length > 0) {
        console.warn(`⚠ Found ${this.registry.conflicts.length} naming conflicts`);
        this.registry.conflicts.forEach(conflict => {
          console.warn(`  - "${conflict.name}" exists in both ${conflict.types.join(' and ')}`);
        });
      }
    } catch (error) {
      console.error('Failed to initialize runtime registry:', error);
      throw error;
    }
  }

  /**
   * Detect naming conflicts between powers and skills
   */
  detectConflicts() {
    this.registry.conflicts = [];
    
    this.registry.powers.forEach((power, name) => {
      if (this.registry.skills.has(name)) {
        this.registry.conflicts.push({
          name,
          types: ['power', 'skill'],
          resolution: 'Use namespace prefix (power:name or skill:name)'
        });
      }
    });
  }

  /**
   * Get a power or skill by name
   * Supports namespace prefixes: power:name or skill:name
   */
  get(name) {
    // Check for namespace prefix
    if (name.includes(':')) {
      const [namespace, itemName] = name.split(':');
      if (namespace === 'power') {
        return this.registry.powers.get(itemName);
      } else if (namespace === 'skill') {
        return this.registry.skills.get(itemName);
      }
      return null;
    }

    // Check powers first, then skills
    if (this.registry.powers.has(name)) {
      return this.registry.powers.get(name);
    }
    
    if (this.registry.skills.has(name)) {
      // Warn if there's a conflict (only in debug mode)
      const shouldLog = process.env.NODE_ENV === 'production' || process.env.DEBUG_KIRO === 'true';
      if (shouldLog && this.registry.conflicts.some(c => c.name === name)) {
        console.warn(`Ambiguous name "${name}" - use "power:${name}" or "skill:${name}" for clarity`);
      }
      return this.registry.skills.get(name);
    }

    return null;
  }

  /**
   * Get a power by name
   */
  getPower(name) {
    return this.registry.powers.get(name);
  }

  /**
   * Get a skill by name
   */
  getSkill(name) {
    return this.registry.skills.get(name);
  }

  /**
   * Get all powers
   */
  getAllPowers() {
    return Array.from(this.registry.powers.values());
  }

  /**
   * Get all skills
   */
  getAllSkills() {
    return Array.from(this.registry.skills.values());
  }

  /**
   * Get all conflicts
   */
  getConflicts() {
    return this.registry.conflicts;
  }

  /**
   * Check if initialized
   */
  isInitialized() {
    return this.initialized;
  }

  /**
   * Get registry stats
   */
  getStats() {
    return {
      powers: this.registry.powers.size,
      skills: this.registry.skills.size,
      conflicts: this.registry.conflicts.length,
      initialized: this.initialized
    };
  }

  /**
   * Execute a power or skill function
   * Supports namespace: power:name.function or skill:name.function
   */
  async execute(path, ...args) {
    const parts = path.split('.');
    const itemPath = parts[0];
    const functionName = parts.slice(1).join('.');

    const item = this.get(itemPath);
    if (!item) {
      throw new Error(`Item not found: ${itemPath}`);
    }

    // For now, return the item config
    // In a full implementation, this would execute actual functions
    return {
      item,
      function: functionName,
      args,
      note: 'Execution placeholder - extend based on power/skill capabilities'
    };
  }
}

// Singleton instance
let registryInstance = null;

function getRuntimeRegistry() {
  if (!registryInstance) {
    registryInstance = new RuntimeRegistry();
  }
  return registryInstance;
}

// Global accessor
if (typeof global !== 'undefined') {
  global.kiroRegistry = getRuntimeRegistry();
}

module.exports = { RuntimeRegistry, getRuntimeRegistry };