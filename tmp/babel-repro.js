const babel = require('@babel/core');
const path = require('path');
const fs = require('fs');

const f = path.join(__dirname, 'repro-sample.tsx');
fs.writeFileSync(f, 'const x = ({ children }) => <div>{children}</div>;\n');

const attempts = {
  'filename only (let babel infer)': { filename: f },
  'explicit plugins tsx': { plugins: ['jsx', 'typescript'], babelrc: false, configFile: false, filename: f },
  'preset-react alone': { presets: [['@babel/preset-react', { runtime: 'automatic' }]], babelrc: false, configFile: false, filename: f },
  'preset-typescript alone': { presets: ['@babel/preset-typescript'], babelrc: false, configFile: false, filename: f },
};

for (const [name, opts] of Object.entries(attempts)) {
  try {
    const res = babel.transformSync(fs.readFileSync(f, 'utf8'), opts);
    console.log('PASS:', name);
  } catch (e) {
    console.log('FAIL:', name, '->', e.message.split('\n')[0]);
  }
}
fs.unlinkSync(f);

// Print versions
console.log('---');
console.log('parser:', require('@babel/parser/package.json').version);
console.log('preset-typescript:', require('@babel/preset-typescript/package.json').version);
console.log('preset-react:', require('@babel/preset-react/package.json').version);
console.log('core:', require('@babel/core/package.json').version);
