# Kiro Runtime - Quick Reference

## 🚀 Getting Started

```bash
# Start server with runtime
npm run dev

# Test runtime
npm run test:kiro

# View registry UI
http://localhost:3000/kiro-registry
```

## 📦 Server-Side Usage

```javascript
// Get a power
const figma = await kiro.power('figma');

// Get a skill
const skill = await kiro.skill('web-design-guidelines');

// Get any item
const item = await kiro.get('figma');

// With namespace (recommended for conflicts)
const power = await kiro.get('power:figma');
const skill = await kiro.get('skill:design');

// Get all
const powers = await kiro.powers();
const skills = await kiro.skills();

// Get stats
const stats = await kiro.stats();
// { powers: 3, skills: 5, conflicts: 0, initialized: true }
```

## 🌐 Client-Side Usage

```javascript
import { getKiroClient } from '../lib/kiroClient';

const client = getKiroClient();

// Get all powers
const { items, count } = await client.getPowers();

// Get all skills
const { items, count } = await client.getSkills();

// Get specific item
const figma = await client.get('figma');

// Get stats
const stats = await client.getStats();

// Get everything
const registry = await client.getAll();
```

## ⚛️ React Component

```javascript
import KiroRegistry from '../components/KiroRegistry';

function MyPage() {
  return <KiroRegistry />;
}
```

## 🔌 API Endpoints

```bash
# Get all
GET /api/kiro/registry

# Get powers only
GET /api/kiro/registry?type=powers

# Get skills only
GET /api/kiro/registry?type=skills

# Get stats
GET /api/kiro/registry?type=stats

# Get specific item
GET /api/kiro/registry?name=figma
```

## 📁 Directory Structure

```
C:\Users\Binod\.kiro\
├── powers\
│   └── installed\
│       ├── figma\
│       ├── terraform\
│       └── saas-builder\
└── skills\
    ├── web-design-guidelines\
    ├── react-best-practices\
    └── vercel-composition-patterns\
```

## 🎯 Common Patterns

### API Route with Power
```javascript
// pages/api/my-endpoint.js
import { kiro } from '../../../lib/startup';

export default async function handler(req, res) {
  const power = await kiro.power('figma');
  res.json({ power });
}
```

### Server-Side Props
```javascript
export async function getServerSideProps() {
  const powers = await kiro.powers();
  return { props: { powers } };
}
```

### React Hook
```javascript
function usePowers() {
  const [powers, setPowers] = useState([]);
  
  useEffect(() => {
    getKiroClient().getPowers()
      .then(data => setPowers(data.items));
  }, []);
  
  return powers;
}
```

## ⚠️ Conflict Resolution

When a name exists in both powers and skills:

```javascript
// ⚠️ Ambiguous - checks powers first
const item = await kiro.get('design');

// ✅ Explicit - recommended
const power = await kiro.get('power:design');
const skill = await kiro.get('skill:design');
```

## 🔍 Debugging

```javascript
// Check if initialized
const stats = await kiro.stats();
console.log('Initialized:', stats.initialized);

// List all loaded items
const powers = await kiro.powers();
const skills = await kiro.skills();
console.log('Powers:', powers.map(p => p.name));
console.log('Skills:', skills.map(s => s.name));

// Check for conflicts
const registry = await getRuntime();
const conflicts = registry.getConflicts();
console.log('Conflicts:', conflicts);
```

## 📊 Data Structures

### Power
```javascript
{
  name: 'figma',
  displayName: 'Design to Code with Figma',
  description: '...',
  version: '1.0.0',
  capabilities: [...],
  documentation: '...',
  loaded: true
}
```

### Skill
```javascript
{
  name: 'web-design-guidelines',
  displayName: 'Web Design Guidelines',
  description: '...',
  version: '1.0.0',
  files: [...],
  documentation: '...',
  type: 'skill',
  loaded: true
}
```

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Powers not loading | Check `C:\Users\Binod\.kiro\powers\installed\` |
| Skills not loading | Check `C:\Users\Binod\.kiro\skills\` |
| Runtime not initialized | Use `npm run dev` not `npm run dev:next` |
| Client errors | Check `/api/kiro/registry` is accessible |

## 📝 Scripts

```json
{
  "dev": "node server.js",           // Start with runtime
  "dev:next": "next dev",            // Start without runtime
  "start": "NODE_ENV=production node server.js",
  "test:kiro": "node test-kiro-runtime.js"
}
```

## 🎨 UI Components

- **KiroRegistry**: Full registry viewer
- **Location**: `/kiro-registry` page
- **Features**: Powers list, skills list, stats, conflicts

## 🔐 Security Notes

- Powers/skills are read-only
- No arbitrary code execution
- Add authentication to API routes as needed
- Validate all inputs

## 📚 Full Documentation

See `KIRO_RUNTIME.md` for complete documentation.

---

**Quick Links**:
- Demo: http://localhost:3000/kiro-registry
- API: http://localhost:3000/api/kiro/registry
- Test: `npm run test:kiro`
