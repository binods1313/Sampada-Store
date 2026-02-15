// lib/skillLoader.js
/**
 * Skill Loader - Dynamically loads and registers Kiro Skills
 * Skills are loaded from C:\Users\Binod\.kiro\skills
 */

const fs = require('fs');
const path = require('path');

class SkillLoader {
  constructor() {
    this.skills = new Map();
    this.skillPath = path.join(process.env.USERPROFILE || process.env.HOME, '.kiro', 'skills');
  }

  /**
   * Load all available skills from the skills directory
   */
  async loadSkills() {
    try {
      if (!fs.existsSync(this.skillPath)) {
        console.warn(`Skills directory not found: ${this.skillPath}`);
        return;
      }

      // Get all items in the skills directory
      const items = fs.readdirSync(this.skillPath);
      
      // Filter for directories (including symlinks)
      const skillDirs = items.filter(item => {
        const itemPath = path.join(this.skillPath, item);
        try {
          const stats = fs.statSync(itemPath);
          return stats.isDirectory();
        } catch (e) {
          return false;
        }
      });

      console.log(`Found ${skillDirs.length} skills: ${skillDirs.join(', ')}`);

      for (const skillName of skillDirs) {
        try {
          await this.loadSkill(skillName);
        } catch (error) {
          console.error(`Failed to load skill "${skillName}":`, error.message);
        }
      }

      console.log(`Successfully loaded ${this.skills.size} skills`);
    } catch (error) {
      console.error('Error loading skills:', error);
    }
  }

  /**
   * Load a single skill
   */
  async loadSkill(skillName) {
    const skillDir = path.join(this.skillPath, skillName);
    
    // Check if directory has any files
    const files = fs.readdirSync(skillDir);
    
    let skillConfig = {
      name: skillName,
      displayName: this.formatDisplayName(skillName),
      description: '',
      version: '1.0.0',
      files: files,
      loaded: true,
      type: 'skill'
    };

    // Look for markdown files
    const mdFiles = files.filter(f => f.endsWith('.md'));
    if (mdFiles.length > 0) {
      const mdPath = path.join(skillDir, mdFiles[0]);
      const content = fs.readFileSync(mdPath, 'utf8');
      skillConfig.documentation = content;
      
      // Try to extract description from first paragraph
      const lines = content.split('\n').filter(l => l.trim());
      for (const line of lines) {
        if (!line.startsWith('#') && line.length > 20) {
          skillConfig.description = line.substring(0, 200);
          break;
        }
      }
    }

    // Look for JSON config
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    if (jsonFiles.length > 0) {
      try {
        const jsonPath = path.join(skillDir, jsonFiles[0]);
        const config = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        skillConfig = { ...skillConfig, ...config };
      } catch (e) {
        console.warn(`Failed to parse JSON config for skill "${skillName}"`);
      }
    }

    this.skills.set(skillName, skillConfig);
    console.log(`✓ Loaded skill: ${skillName}`);
  }

  /**
   * Format skill name for display
   */
  formatDisplayName(name) {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get a specific skill by name
   */
  getSkill(skillName) {
    return this.skills.get(skillName);
  }

  /**
   * Get all loaded skills
   */
  getAllSkills() {
    return Array.from(this.skills.values());
  }

  /**
   * Check if a skill is loaded
   */
  hasSkill(skillName) {
    return this.skills.has(skillName);
  }

  /**
   * Get skill documentation
   */
  getSkillDocumentation(skillName) {
    const skill = this.skills.get(skillName);
    return skill ? skill.documentation : null;
  }
}

// Singleton instance
let skillLoaderInstance = null;

function getSkillLoader() {
  if (!skillLoaderInstance) {
    skillLoaderInstance = new SkillLoader();
  }
  return skillLoaderInstance;
}

module.exports = { SkillLoader, getSkillLoader };
