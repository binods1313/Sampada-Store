const { getSkillLoader } = require('./lib/skillLoader');

async function test() {
  console.log('Testing Skill Loader...\n');
  
  const loader = getSkillLoader();
  await loader.loadSkills();
  
  const allSkills = loader.getAllSkills();
  console.log(`Loaded ${allSkills.length} skills\n`);
  
  allSkills.forEach(skill => {
    console.log(`Skill: ${skill.name}`);
    console.log(`  Display: ${skill.displayName}`);
    console.log(`  Files: ${skill.files.length}`);
    console.log(`  Files list: ${skill.files.join(', ')}`);
    console.log(`  Has documentation: ${!!skill.documentation}`);
    if (skill.documentation) {
      console.log(`  Doc length: ${skill.documentation.length} chars`);
      console.log(`  First 100 chars: ${skill.documentation.substring(0, 100)}...`);
    }
    console.log('');
  });
}

test().catch(console.error);
