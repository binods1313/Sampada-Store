const fs = require('fs');
const path = require('path');

const skillPath = path.join(process.env.USERPROFILE, '.kiro', 'skills', 'vercel-react-native-skills');

console.log('Checking skill directory:', skillPath);
console.log('Exists:', fs.existsSync(skillPath));

if (fs.existsSync(skillPath)) {
  const files = fs.readdirSync(skillPath);
  console.log('Files found:', files);
  
  const agentsPath = path.join(skillPath, 'AGENTS.md');
  if (fs.existsSync(agentsPath)) {
    const content = fs.readFileSync(agentsPath, 'utf8');
    console.log('\nAGENTS.md exists!');
    console.log('Size:', content.length, 'characters');
    console.log('First 200 chars:', content.substring(0, 200));
  }
}
