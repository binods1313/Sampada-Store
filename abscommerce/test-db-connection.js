// test-db-connection.js
// Quick script to test PostgreSQL connection with different passwords

const { Client } = require('pg');

const passwords = [
  '', // No password
  'postgres', // Common default
  'admin',
  'root',
  '123456',
  'password'
];

async function testConnection(password) {
  const connectionString = password 
    ? `postgresql://postgres:${password}@127.0.0.1:5432/postgres`
    : `postgresql://postgres@127.0.0.1:5432/postgres`;
  
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log(`✅ SUCCESS! Password: "${password || '(no password)'}"`);
    console.log(`\nAdd this to your .env file:`);
    console.log(`DATABASE_URL="${connectionString}"`);
    await client.end();
    return true;
  } catch (error) {
    console.log(`❌ Failed with password: "${password || '(no password)'}"`);
    return false;
  }
}

async function main() {
  console.log('Testing PostgreSQL connection with common passwords...\n');
  
  for (const password of passwords) {
    const success = await testConnection(password);
    if (success) {
      process.exit(0);
    }
  }
  
  console.log('\n❌ None of the common passwords worked.');
  console.log('\nYou need to reset your PostgreSQL password. Run this in PowerShell as Administrator:');
  console.log('\npsql -U postgres -c "ALTER USER postgres PASSWORD \'newpassword\';"');
  console.log('\nOr use pgAdmin to reset the password.');
}

main();
