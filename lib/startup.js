// lib/startup.js
/**
 * Startup initialization for Kiro Powers and Skills
 * This module initializes the runtime registry at application startup
 */

const { getRuntimeRegistry } = require('./runtimeRegistry');

let initializationPromise = null;

/**
 * Initialize the runtime registry
 * This should be called once at application startup
 */
async function initializeRuntime() {
  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    console.log('🚀 Starting Kiro runtime initialization...');
    const startTime = Date.now();

    try {
      const registry = getRuntimeRegistry();
      await registry.initialize();

      const stats = registry.getStats();
      const duration = Date.now() - startTime;

      console.log('✅ Kiro runtime initialized successfully');
      console.log(`   Powers: ${stats.powers}`);
      console.log(`   Skills: ${stats.skills}`);
      console.log(`   Conflicts: ${stats.conflicts}`);
      console.log(`   Duration: ${duration}ms`);

      // List loaded powers
      if (stats.powers > 0) {
        const powers = registry.getAllPowers();
        console.log('   Loaded powers:', powers.map(p => p.name).join(', '));
      }

      // List loaded skills
      if (stats.skills > 0) {
        const skills = registry.getAllSkills();
        console.log('   Loaded skills:', skills.map(s => s.name).join(', '));
      }

      // Warn about conflicts
      if (stats.conflicts > 0) {
        const conflicts = registry.getConflicts();
        console.warn('⚠️  Naming conflicts detected:');
        conflicts.forEach(conflict => {
          console.warn(`   - "${conflict.name}": ${conflict.resolution}`);
        });
      }

      return registry;
    } catch (error) {
      console.error('❌ Failed to initialize Kiro runtime:', error);
      throw error;
    }
  })();

  return initializationPromise;
}

/**
 * Get the runtime registry (initializes if needed)
 */
async function getRuntime() {
  await initializeRuntime();
  return getRuntimeRegistry();
}

/**
 * Global helper functions for accessing powers and skills
 */
const kiro = {
  /**
   * Get a power by name
   */
  power: async (name) => {
    const runtime = await getRuntime();
    return runtime.getPower(name);
  },

  /**
   * Get a skill by name
   */
  skill: async (name) => {
    const runtime = await getRuntime();
    return runtime.getSkill(name);
  },

  /**
   * Get any item (power or skill) by name
   */
  get: async (name) => {
    const runtime = await getRuntime();
    return runtime.get(name);
  },

  /**
   * Execute a power or skill function
   */
  execute: async (path, ...args) => {
    const runtime = await getRuntime();
    return runtime.execute(path, ...args);
  },

  /**
   * Get all powers
   */
  powers: async () => {
    const runtime = await getRuntime();
    return runtime.getAllPowers();
  },

  /**
   * Get all skills
   */
  skills: async () => {
    const runtime = await getRuntime();
    return runtime.getAllSkills();
  },

  /**
   * Get runtime stats
   */
  stats: async () => {
    const runtime = await getRuntime();
    return runtime.getStats();
  }
};

// Make kiro globally available
if (typeof global !== 'undefined') {
  global.kiro = kiro;
}

module.exports = { initializeRuntime, getRuntime, kiro };
