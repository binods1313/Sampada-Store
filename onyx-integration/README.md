# Onyx Integration - Sampada Store

> **Status**: Ready for deployment  
> **Created**: April 4, 2026  
> **Onyx Version**: Latest (main branch)

---

## 📁 Integration Package Contents

```
onyx-integration/
├── README.md                          # You are here
├── connectors/
│   └── sanity_product_connector.py    # Sanity CMS → Onyx connector
├── components/
│   └── OnyxChatWidget.jsx             # React chat widget for storefront
├── config/
│   └── onyx_personas.py               # 4 custom AI personas configuration
├── scripts/
│   ├── deploy-onyx-lite.ps1           # PowerShell deployment script
│   └── setup-personas.ps1             # Auto-create personas via API
└── docs/
    └── integration-guide.md           # Step-by-step integration guide
```

---

## 🚀 Quick Start

### Step 1: Deploy Onyx Lite
```powershell
# Start Docker Desktop first, then:
cd E:\Sampada-Store\onyx-integration\scripts
.\deploy-onyx-lite.ps1
```

### Step 2: Create Personas
```powershell
.\setup-personas.ps1
```

### Step 3: Add Chat Widget to Sampada
```javascript
// In pages/_app.js or Layout.jsx
import OnyxChatWidget from '../../onyx-integration/components/OnyxChatWidget';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <OnyxChatWidget persona="product-expert" />
    </>
  );
}
```

### Step 4: Install Sanity Connector
```bash
# Copy connector to Onyx backend
cp connectors/sanity_product_connector.py ../onyx/backend/onyx/connectors/sanity.py

# Add to Onyx .env:
# NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
# NEXT_PUBLIC_SANITY_DATASET=production
# SANITY_API_WRITE_TOKEN=your_token
```

---

## 🎯 What's Included

### 1. Sanity Product Connector
- **File**: `connectors/sanity_product_connector.py`
- **Purpose**: Index all Sampada products into Onyx for AI-powered search
- **Features**:
  - Fetches products via GROQ queries
  - Indexes variants (colors, sizes, pricing)
  - Includes reviews and ratings
  - Supports incremental sync (only changed products)
  - Metadata enrichment for better search

### 2. Chat Widget Component
- **File**: `components/OnyxChatWidget.jsx`
- **Purpose**: Floating AI chat assistant on storefront
- **Features**:
  - Customizable branding (matches Sampada colors)
  - Two personas: Product Expert & Support Agent
  - Auto-open on first visit with welcome message
  - PostMessage API for cart/order integration
  - Responsive and mobile-friendly
  - Includes `ProductSearchBar` component for AI search

### 3. Custom AI Personas
- **File**: `config/onyx_personas.py`
- **Personas**:
  1. **Product Expert**: Helps customers find/compare products
  2. **Support Agent**: Handles orders, returns, shipping questions
  3. **Developer Assistant**: Internal dev help for codebase questions
  4. **Business Analyst**: Revenue analytics and insights

---

## 📊 Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Sampada Store                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend (Next.js)                    Backend (Sanity)    │
│  ┌──────────────────────┐              ┌──────────────┐   │
│  │  OnyxChatWidget.jsx  │◄────────────►│  Sanity CMS  │   │
│  │  - Product Expert    │  Products    │  - Products  │   │
│  │  - Support Agent     │              │  - Reviews   │   │
│  └──────────┬───────────┘              └──────┬───────┘   │
│             │                                  │           │
│             │ API Calls                        │ GROQ      │
│             ▼                                  ▼           │
│  ┌──────────────────────┐              ┌──────────────┐   │
│  │   Onyx AI Platform   │◄────────────►│  Connector   │   │
│  │  - RAG Search        │  Index       │  (Sanity)    │   │
│  │  - Chat Personas     │              └──────────────┘   │
│  │  - Code Execution    │                                 │
│  └──────────────────────┘                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Configuration

### Environment Variables (Sampada `.env.local`)
```env
# Onyx Integration
NEXT_PUBLIC_ONYX_API_URL=http://localhost:3000
NEXT_PUBLIC_ONYX_PERSONA_ID=sampada-product-expert
```

### Environment Variables (Onyx `.env`)
```env
# Sampada Sanity CMS Connection
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=your_token
```

---

## 📋 Deployment Checklist

- [ ] Docker Desktop running (Linux engine)
- [ ] Onyx Lite deployed (`deploy-onyx-lite.ps1`)
- [ ] Onyx accessible at `http://localhost:3000`
- [ ] Personas created (`setup-personas.ps1`)
- [ ] Sanity connector installed and synced
- [ ] Chat widget added to Sampada Layout
- [ ] Environment variables configured
- [ ] Test product search queries
- [ ] Test support agent workflows
- [ ] Verify mobile responsiveness

---

## 🎓 Next Steps

1. **Test Locally**: Verify all features work with Onyx Lite
2. **Upgrade to Standard**: Enable RAG features with full deployment
3. **Add More Connectors**: Connect Stripe, Google Analytics, GitHub
4. **Custom Actions**: Build Onyx actions for Sampada APIs (create orders, update inventory)
5. **Production Deploy**: Deploy Onyx to cloud (AWS, GCP, or Vercel)

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Docker Linux engine not running | Start Docker Desktop, switch to Linux containers |
| Chat widget not loading | Check `NEXT_PUBLIC_ONYX_API_URL` is correct |
| Products not indexed | Verify Sanity credentials in Onyx .env |
| Persona not found | Run `setup-personas.ps1` to create personas |
| CORS errors | Add Sampada domain to Onyx CORS_ALLOWED_ORIGIN |

---

## 📞 Support

- **Onyx Docs**: https://docs.onyx.app/
- **Onyx Discord**: https://discord.gg/TDJ59cGV2X
- **Sampada Docs**: `E:\Sampada-Store\docs\`

---

*Last Updated: April 4, 2026*
