# Onyx AI Platform - Integration Skill for Sampada-Store

> **Source**: [onyx-dot-app/onyx](https://github.com/onyx-dot-app/onyx)  
> **Stars**: 23.9k+ | **License**: MIT  
> **Local Path**: `E:\Sampada-Store\onyx`  
> **Created**: April 4, 2026

---

## 📋 What Is Onyx?

Onyx is an **open-source AI platform and application layer for LLMs** that provides:
- **Agentic RAG**: Hybrid vector + keyword search with AI agents
- **Deep Research**: Multi-step research flow for in-depth reports
- **Custom Agents**: Build AI agents with tailored instructions, knowledge bases, and actions
- **50+ Data Connectors**: Connect to external apps/data sources out-of-the-box or via MCP
- **Web Search**: Real-time browsing via Serper, Google PSE, Brave, SearXNG
- **Code Execution**: Sandboxed environment for data analysis, graph rendering
- **Artifacts & Image Generation**: Create downloadable documents, graphics, AI-generated images
- **Voice Mode**: Full text-to-speech and speech-to-text chat
- **Enterprise Features**: SSO, RBAC, usage analytics, query auditing, PII-filtering

---

## 🏗️ Architecture Overview

### Tech Stack
| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.11, FastAPI, SQLAlchemy, Alembic, Celery |
| **Frontend** | Next.js 15+, React 18, TypeScript, Tailwind CSS |
| **Database** | PostgreSQL with Redis caching |
| **Search** | Vespa vector database |
| **Auth** | OAuth2, SAML, multi-provider support |
| **AI/ML** | LangChain, LiteLLM, multiple embedding models |
| **Infrastructure** | Docker, Kubernetes, Helm, Terraform, Redis, MinIO |

### Directory Structure
```
onyx/
├── backend/
│   ├── onyx/
│   │   ├── auth/           # Authentication & authorization
│   │   ├── chat/           # Chat functionality & LLM interactions
│   │   ├── connectors/     # Data source connectors (50+)
│   │   ├── db/             # Database models & operations
│   │   ├── document_index/ # Vespa integration
│   │   ├── llm/            # LLM provider integrations
│   │   └── server/         # API endpoints & routers
│   ├── ee/                 # Enterprise Edition features
│   ├── alembic/            # Database migrations
│   └── tests/              # Test suites
├── web/
│   ├── src/app/            # Next.js app router pages
│   ├── src/components/     # Reusable React components
│   └── src/lib/            # Utilities & business logic
├── deployment/             # Docker, K8s, Helm, Terraform configs
├── extensions/             # Browser extensions, integrations
└── tools/                  # CLI tools, utilities
```

### Background Workers (Celery)
Onyx uses 9 specialized Celery workers:
1. **Primary Worker**: Core background tasks, connector management
2. **Docfetching Worker**: Fetches documents from external data sources
3. **Docprocessing Worker**: Processes documents through indexing pipeline
4. **Light Worker**: Lightweight, fast operations
5. **Heavy Worker**: Resource-intensive operations (pruning)
6. **KG Processing Worker**: Knowledge Graph processing
7. **Monitoring Worker**: System health monitoring
8. **User File Processing Worker**: User-uploaded file processing
9. **Beat Worker**: Celery's scheduler for periodic tasks

---

## 🚀 Deployment Options

### Onyx Lite (Quick Start)
- **Requirements**: <1GB RAM
- **Use Case**: Quick testing, basic chat/agent functionality
- **Install**: Single bash command
```bash
curl -fsSL https://onyx.app/install_onyx.sh | bash
```

### Standard Onyx (Full Features)
- **Components**: Vector + Keyword indexes, background workers, AI inference servers
- **Optimizations**: Redis cache, MinIO blob storage
- **Use Case**: Production deployments, enterprise features

### Deployment Platforms
- Docker (recommended for local dev)
- Kubernetes (production)
- Helm charts
- Terraform (AWS, GCP, Azure)

---

## 🎯 How Onyx Benefits Sampada-Store

### 1. AI-Powered Product Search & Discovery
**Current**: Basic Sanity GROQ queries  
**With Onyx**:
- Connect to Sanity CMS via custom connector
- Hybrid vector + keyword search over product catalog
- Natural language queries: *"Show me headphones under $100 with good bass"*
- RAG-powered product recommendations

**Implementation Path**:
```
backend/onyx/connectors/ → Create Sanity CMS connector
backend/onyx/chat/       → Configure product search agent
web/src/app/             → Embed Onyx widget or custom UI
```

### 2. Intelligent Customer Support Agent
**Current**: Contact form only  
**With Onyx**:
- Build custom support agent trained on:
  - Product specifications
  - Order policies
  - Shipping information
  - Return/refund policies
- Connect to order database via connector
- 24/7 automated support

**Implementation Path**:
```
backend/onyx/chat/persona/ → Create support agent persona
backend/onyx/connectors/   → Connect to order DB
web/src/components/        → Add chat widget to storefront
```

### 3. Internal Knowledge Base
**Current**: Scattered docs (About.md, Build.md, Errors.md, etc.)  
**With Onyx**:
- Connect to GitHub repo, Notion, Google Drive
- Team asks: *"How do I fix the Stripe webhook?"* → Onyx searches all docs
- Code execution sandbox for debugging

**Implementation Path**:
```
backend/onyx/connectors/github.py  → Connect to Sampada repo
backend/onyx/connectors/file.py    → Index local docs
web/src/app/                       → Internal admin portal
```

### 4. Business Intelligence & Analytics
**Current**: No analytics dashboard  
**With Onyx**:
- Connect to Stripe, Google Analytics
- Ask: *"What was our revenue last month?"*
- Code execution for data analysis and graph rendering

**Implementation Path**:
```
backend/onyx/connectors/stripe.py  → Connect payment data
backend/onyx/chat/actions/         → Create analytics actions
web/src/components/                → Analytics dashboard
```

### 5. AI-Generated Marketing Content
**Current**: Manual content creation  
**With Onyx**:
- Artifacts generation for product descriptions
- Image generation for social media
- Deep research for competitor analysis

**Implementation Path**:
```
backend/onyx/chat/artifacts/  → Generate marketing content
backend/onyx/llm/             → Configure image generation models
web/src/app/artifacts/        → Content management UI
```

---

## 🔧 Integration Patterns for Sampada

### Pattern 1: Embedded Chat Widget
Add Onyx chat widget to Sampada storefront for customer support:

```javascript
// In Sampada's pages/_app.js or Layout.jsx
<OnyxChatWidget
  apiUrl="http://localhost:3000/api/chat"
  personaId="sampada-support"
  theme="custom"
/>
```

### Pattern 2: Product Search API
Use Onyx RAG to power product search:

```python
# Custom connector for Sanity CMS
from onyx.connectors.models import ConnectorBase

class SanityConnector(ConnectorBase):
    def retrieve_documents(self):
        # Fetch products from Sanity
        return sanity_client.fetch('*[_type == "product"]')
    
    def poll_source(self):
        # Poll for product updates
        return self.retrieve_documents()
```

### Pattern 3: Internal Admin Portal
Build admin dashboard with Onyx-powered insights:

```typescript
// web/src/app/admin/dashboard/page.tsx
import { OnyxAnalytics } from '@/components/onyx';

export default function AdminDashboard() {
  return (
    <div>
      <OnyxAnalytics 
        connectors={['stripe', 'sanity', 'google-analytics']}
        queries={[
          'Revenue this month',
          'Top selling products',
          'Customer satisfaction trends'
        ]}
      />
    </div>
  );
}
```

---

## 📊 Key API Endpoints

### Chat & Agents
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/send` | Send chat message |
| POST | `/api/persona` | Create custom agent |
| GET | `/api/persona` | List available agents |
| POST | `/api/query/answer-streamed` | Stream RAG answers |

### Connectors
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/connector` | Create data connector |
| GET | `/api/connector` | List connectors |
| POST | `/api/connector/{id}/sync` | Trigger sync |

### Admin & Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/analytics/usage` | Usage statistics |
| GET | `/api/admin/query-history` | Query audit log |
| POST | `/api/admin/settings` | Update settings |

---

## 🛠️ Development Setup

### Prerequisites
- Docker & Docker Compose
- Python 3.11+
- Node.js 18+
- PostgreSQL, Redis, Vespa (via Docker)

### Quick Start
```bash
# 1. Clone (already done)
cd E:\Sampada-Store\onyx

# 2. Install backend dependencies
cd backend
python -m venv .venv
source .venv/Scripts/activate  # Windows
pip install -r requirements/default.txt

# 3. Install frontend dependencies
cd ../web
npm install

# 4. Start services (Docker)
cd ../deployment/docker-compose
docker compose up -d

# 5. Run migrations
cd ../../backend
alembic upgrade head

# 6. Start dev servers
# Backend:
cd backend
uvicorn onyx.server.main:app --reload --port 8080

# Frontend:
cd web
npm run dev
```

### Default Credentials
- **Username**: `a@example.com`
- **Password**: `a`
- **App URL**: `http://localhost:3000`

---

## 🔗 Connecting Onyx to Sampada

### Step 1: Create Sanity CMS Connector
```python
# backend/onyx/connectors/sanity_connector.py
from onyx.connectors.connector import Connector
from onyx.connectors.models import Document, IndexAttemptMetadata

class SanityConnector(Connector[SanityConnectorCredential]):
    def retrieve_documents(self, *args, **kwargs) -> Generator[Document, None, None]:
        """Fetch all products from Sanity CMS"""
        query = '*[_type == "product"]{_id, name, slug, price, description, category}'
        products = self.sanity_client.fetch(query)
        
        for product in products:
            yield Document(
                id=product['_id'],
                sections=[
                    Section(
                        text=f"{product['name']}\n{product['description']}\nPrice: ${product['price']}",
                        link=f"/product/{product['slug']}"
                    )
                ],
                source_type=SourceType.Sanity,
                metadata={'category': product['category'], 'price': product['price']}
            )
```

### Step 2: Create Product Search Agent
```python
# backend/onyx/chat/persona/product_search.py
from onyx.chat.models import Persona

PRODUCT_SEARCH_AGENT = Persona(
    name="Sampada Product Expert",
    description="Helps customers find the perfect tech products",
    system_prompt="""You are a product expert for Sampada Store, specializing in tech products.
You help customers find products based on their needs, budget, and preferences.
Always provide specific product recommendations with reasoning.
Include key specifications, pricing, and availability.""",
    knowledge_base_connectors=['sanity'],
    tools=['product_search', 'price_comparison', 'review_summary']
)
```

### Step 3: Embed Chat Widget in Sampada
```javascript
// components/OnyxChat.jsx
import { useEffect } from 'react';

export default function OnyxChat() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'http://localhost:3000/embed/chat.js';
    script.async = true;
    script.dataset.personaId = 'product-search';
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
```

---

## 📈 Use Cases & ROI

| Use Case | Implementation Effort | Expected Impact |
|----------|----------------------|-----------------|
| AI Product Search | Medium (2-3 weeks) | +30% conversion rate |
| Customer Support Agent | Low (1 week) | -60% support tickets |
| Internal Knowledge Base | Low (3-5 days) | -50% onboarding time |
| Analytics Dashboard | Medium (2 weeks) | Data-driven decisions |
| Marketing Content Gen | Low (1 week) | 3x content output |

---

## 🎓 Learning Resources

- **Official Docs**: https://docs.onyx.app/
- **Discord Community**: https://discord.gg/TDJ59cGV2X
- **GitHub Issues**: https://github.com/onyx-dot-app/onyx/issues
- **Deployment Guides**: https://docs.onyx.app/deployment/overview

---

## ⚠️ Important Notes

### When Working with Onyx Code
1. **Always go through frontend**: Make API calls to `http://localhost:3000/api/...` not `http://localhost:8080/api/...`
2. **Database operations**: Put ALL db operations under `backend/onyx/db/` or `backend/ee/onyx/db/`
3. **Error handling**: Always raise `OnyxError` from `onyx.error_handling.exceptions`, never `HTTPException`
4. **Celery tasks**: Use `@shared_task` decorator, always provide `expires=` parameter
5. **Testing**: Use external dependency unit tests over mocking when possible
6. **Type safety**: Ensure strict typing in both Python and TypeScript

### When Integrating with Sampada
1. **Never expose Onyx admin publicly**: Use authentication or separate deployment
2. **CORS configuration**: Configure Onyx to accept requests from Sampada domain
3. **Shared auth**: Consider SSO integration for seamless user experience
4. **Data privacy**: Use Onyx PII filtering for customer data protection
5. **Performance**: Use Onyx Lite for simple chat, Standard for RAG features

---

## 🚀 Next Steps for Sampada

### Phase 1: Quick Win (Week 1)
- [ ] Deploy Onyx Lite locally
- [ ] Create basic customer support agent
- [ ] Embed chat widget in Sampada storefront
- [ ] Test with sample product queries

### Phase 2: Product Search (Week 2-3)
- [ ] Build Sanity CMS connector
- [ ] Configure hybrid search over product catalog
- [ ] Create product search agent persona
- [ ] Integrate with Sampada search functionality

### Phase 3: Internal Tools (Week 3-4)
- [ ] Connect GitHub repo for code search
- [ ] Index all Sampada documentation
- [ ] Create developer support agent
- [ ] Build analytics dashboard

### Phase 4: Advanced Features (Month 2)
- [ ] Connect Stripe for revenue analytics
- [ ] Set up deep research for competitor analysis
- [ ] Generate marketing content automatically
- [ ] Implement voice mode for accessibility

---

## 💡 Pro Tips

1. **Use Onyx for development too**: Ask Onyx to explain Sampada's codebase, find bugs, suggest optimizations
2. **Combine with Agency-Agents**: Use Agency-Agents for development workflows, Onyx for customer-facing AI
3. **Start small**: Deploy Lite mode first, upgrade to Standard when you need RAG
4. **Leverage connectors**: The 50+ pre-built connectors can connect to most of your existing tools
5. **Custom actions**: Build Onyx actions to interact with Sampada's APIs (create orders, update inventory, etc.)

---

*Last Updated: April 4, 2026*  
*Onyx Version: Latest (main branch)*  
*Integration Status: Ready for implementation*
