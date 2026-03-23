const fs = require('fs');
const path = require('path');

const skillPath = path.join(process.env.USERPROFILE || process.env.HOME, '.kiro', 'skills');

console.log('Skill path:', skillPath);
console.log('Exists:', fs.existsSync(skillPath));

if (fs.existsSync(skillPath)) {
  const items = fs.readdirSync(skillPath, { withFileTypes: true });
  console.log('\nAll items:');
  items.forEach(item => {
    console.log(`  ${item.name} - isDirectory: ${item.isDirectory()}`);
  });
  
  const skillDirs = items
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  console.log('\nFiltered directories:', skillDirs);
  console.log('Count:', skillDirs.length);
  
  // Try loading one skill
  if (skillDirs.length > 0) {
    const testSkill = skillDirs[0];
    const testSkillDir = path.join(skillPath, testSkill);
    console.log(`\nTesting skill: ${testSkill}`);
    console.log(`Path: ${testSkillDir}`);
    
    const files = fs.readdirSync(testSkillDir);
    console.log(`Files in ${testSkill}:`, files);
  }
}
