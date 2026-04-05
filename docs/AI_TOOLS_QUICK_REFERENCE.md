# Sampada AI Tools - Quick Reference

> **Created**: April 4, 2026  
> **Location**: `E:\Sampada-Store\docs\`

---

## 🤖 Available AI Tools for Sampada

### 1. Agency-Agents (147 Specialized AI Personas)
- **What**: Prompt-based AI agents for development, marketing, testing
- **Location**: `.qwen/agents/`
- **Best For**: Development workflows, code reviews, SEO, marketing strategy
- **Docs**: [AGENCY_AGENTS_REFERENCE.md](./AGENCY_AGENTS_REFERENCE.md)
- **Cost**: Free (just prompt files)
- **Setup**: Already installed ✅

### 2. Onyx AI Platform (Self-Hosted AI Infrastructure)
- **What**: Full AI platform with RAG, agents, 50+ data connectors
- **Location**: `onyx/` (cloned repo)
- **Best For**: Customer-facing AI, product search, support agent, internal knowledge base
- **Docs**: [ONYX_INTEGRATION_SKILL.md](./ONYX_INTEGRATION_SKILL.md)
- **Cost**: Free (MIT license), requires server (<1GB Lite to full stack)
- **Setup**: Ready to deploy

---

## 🎯 When to Use Which

| Task | Tool | Why |
|------|------|-----|
| Fix build warnings | Agency-Agents (`frontend-developer`) | Specialized prompt for React/Next.js |
| Add AI product search | Onyx | RAG over Sanity CMS, hybrid search |
| Code review | Agency-Agents (`code-reviewer`) | Structured review workflows |
| Customer support chatbot | Onyx | Custom agent with product knowledge |
| SEO optimization | Agency-Agents (`seo-specialist`) | E-commerce SEO expertise |
| Internal knowledge base | Onyx | Connect to GitHub, docs, code |
| Marketing strategy | Agency-Agents (`growth-hacker`) | Conversion optimization |
| Competitor analysis | Onyx (Deep Research) | Multi-step research reports |
| Performance optimization | Agency-Agents (`performance-benchmarker`) | Bundle analysis, code splitting |
| Business analytics | Onyx | Connect Stripe, GA, ask questions |

---

## 🚀 Quick Commands

### Agency-Agents
Just ask me to activate any agent:
- *"Use frontend-developer to fix build warnings"*
- *"Activate seo-specialist for product pages"*
- *"Let performance-benchmarker optimize bundles"*

### Onyx
```bash
# Deploy Onyx Lite (quick start)
cd E:\Sampada-Store\onyx
curl -fsSL https://onyx.app/install_onyx.sh | bash

# Access locally
http://localhost:3000
# Login: a@example.com / a

# Deploy Standard Onyx (full features)
cd deployment/docker-compose
docker compose up -d
```

---

## 💡 Synergy: Use Both Together

```
┌─────────────────────────────────────────────────────────┐
│                    Sampada-Store                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Development Side                    Customer Side      │
│  ┌─────────────────────┐          ┌──────────────────┐ │
│  │   Agency-Agents     │          │      Onyx        │ │
│  │                     │          │                  │ │
│  │ • Code reviews      │          │ • Product search │ │
│  │ • SEO optimization  │          │ • Support chat   │ │
│  │ • Performance fixes │          │ • Knowledge base │ │
│  │ • Marketing strategy│          │ • Analytics      │ │
│  │ • Testing workflows │          │ • Content gen    │ │
│  └─────────────────────┘          └──────────────────┘ │
│                                                         │
│  Both work together to build & run Sampada!            │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Impact Assessment

| Tool | Implementation Time | Resource Cost | Business Impact |
|------|-------------------|---------------|-----------------|
| Agency-Agents | 0 (already installed) | Free | High (dev productivity) |
| Onyx Lite | 1 hour | <1GB RAM | Medium (basic chat) |
| Onyx Standard | 1 day | 4-8GB RAM | Very High (full AI platform) |
| **Both Together** | 2-3 weeks | Server + dev time | **Maximum** (synergy workflows) |

---

## 🎯 Recommended Action Plan

### Week 1: Quick Wins
- [ ] Use Agency-Agents to fix current build warnings
- [ ] Deploy Onyx Lite for testing (when Docker is running)
- [ ] Create basic customer support agent in Onyx

### Week 2-3: Core Features
- [ ] Agency-Agents: SEO optimization, performance tuning
- [ ] Onyx: Build Sanity CMS connector
- [ ] Onyx: Embed product search in Sampada

### Month 2: Advanced
- [ ] Agency-Agents: Marketing campaigns, growth hacking
- [ ] Onyx: Internal knowledge base, analytics
- [ ] Onyx: Deep research for competitor analysis

---

## 📁 What's Been Created

| File | Purpose |
|------|---------|
| `docs/AGENCY_AGENTS_REFERENCE.md` | All 147 Agency-Agents documented |
| `docs/ONYX_INTEGRATION_SKILL.md` | Complete Onyx integration guide |
| `docs/AGENTS_ONYX_SYNERGY.md` | **5 complete workflows** using both tools together |
| `onyx-integration/` | **Ready-to-deploy integration package** |
| `onyx-integration/connectors/sanity_product_connector.py` | Sanity → Onyx product indexer |
| `onyx-integration/components/OnyxChatWidget.jsx` | Floating AI chat widget |
| `onyx-integration/config/onyx_personas.py` | 4 custom AI personas |
| `onyx-integration/scripts/deploy-onyx-lite.ps1` | One-click Onyx deployment |
| `onyx-integration/scripts/setup-personas.ps1` | Auto-create AI agents |

---

*Last Updated: April 4, 2026*
