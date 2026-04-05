# Agency-Agents + Onyx Synergy Workflows

> **Purpose**: How to use both AI tools together for maximum impact on Sampada-Store  
> **Created**: April 4, 2026

---

## 🎯 The Power of Using Both Together

| Tool | Strength | Best Used For |
|------|----------|---------------|
| **Agency-Agents** | Specialized AI personas for development | Code reviews, SEO, performance, marketing strategy |
| **Onyx** | Self-hosted AI platform with RAG | Customer-facing AI, product search, internal knowledge base |

**Synergy**: Agency-Agents helps you **build** Sampada better, Onyx helps Sampada **serve customers** better.

---

## 🔄 Workflow 1: Build AI-Powered Product Search

### Phase 1: Planning (Agency-Agents)
```
1. Activate: product-manager
   Task: "Plan the AI product search feature for Sampada. 
          Define requirements, success metrics, and implementation phases."

2. Activate: ux-architect
   Task: "Design the user experience for AI-powered product search.
          How should customers interact with natural language search?"

3. Activate: database-optimizer
   Task: "Design the data model for hybrid vector + keyword search over 
          Sanity CMS products. What fields should be indexed?"
```

### Phase 2: Implementation (Onyx + Agency-Agents)
```
4. Deploy Onyx Lite (already set up)

5. Install Sanity connector (onyx-integration/connectors/sanity_product_connector.py)

6. Activate: frontend-developer
   Task: "Integrate the Onyx chat widget into Sampada's Layout.jsx.
          Add the ProductSearchBar component to the products page."

7. Activate: backend-architect
   Task: "Review the Sanity connector implementation. 
          Ensure GROQ queries are optimized and all product fields are indexed."
```

### Phase 3: Testing (Agency-Agents)
```
8. Activate: api-tester
   Task: "Test the Onyx product search API with various queries:
          - 'headphones under $100'
          - 'smartwatch with GPS'
          - 'best rated sunglasses'
          Verify results are accurate and relevant."

9. Activate: code-reviewer
   Task: "Review the entire integration: connector, widget, personas.
          Check for security, performance, and edge cases."
```

### Phase 4: Launch & Optimize (Both)
```
10. Activate: seo-specialist
    Task: "Optimize product descriptions in Sanity CMS for better AI search relevance.
           What keywords and structure help RAG understand products better?"

11. Use Onyx: Product Expert persona
    Task: "Handle real customer product search queries.
           Monitor which queries succeed and which need improvement."

12. Activate: growth-hacker
    Task: "Analyze search-to-conversion metrics. 
           How many search users actually buy? Optimize the funnel."
```

---

## 🔄 Workflow 2: Build Customer Support Agent

### Phase 1: Strategy (Agency-Agents)
```
1. Activate: support-responder
   Task: "Analyze common customer support questions for Sampada:
          - Order status inquiries
          - Return requests
          - Shipping questions
          - Product troubleshooting
          Create a knowledge base structure."

2. Activate: content-creator
   Task: "Write comprehensive support documentation for:
          - Shipping policies (domestic & international)
          - Return/refund procedures
          - Warranty information
          - Common troubleshooting steps"
```

### Phase 2: Build (Onyx + Agency-Agents)
```
3. Use Onyx: Create Support Agent persona
    - System prompt: onyx-integration/config/onyx_personas.py (SUPPORT_AGENT_PERSONA)
    - Knowledge base: Support docs, order database, shipping policies

4. Activate: ai-engineer
    Task: "Configure Onyx support agent with proper tools and knowledge connectors.
           Set up order lookup, shipping tracking, and return processing actions."

5. Activate: frontend-developer
    Task: "Add support chat widget to contact page and order confirmation pages.
           Use persona='support-agent' for this context."
```

### Phase 3: Test & Refine (Both)
```
6. Activate: qa-engineer
    Task: "Test support agent with edge cases:
           - Order outside 30-day return window
           - International shipping questions
           - Refund timeline questions
           - Escalation scenarios"

7. Use Onyx: Monitor support conversations
    - Track resolution rate
    - Identify questions agent can't answer
    - Collect customer feedback

8. Activate: feedback-synthesizer
    Task: "Analyze support agent performance. 
           What are the top unresolved questions? 
           What improvements should we make?"
```

---

## 🔄 Workflow 3: Internal Knowledge Base

### Phase 1: Organize (Agency-Agents)
```
1. Activate: technical-writer
    Task: "Audit all Sampada documentation:
           - About.md, Build.md, Errors.md, Warnings.md
           - API docs, deployment configs, environment variables
           Identify gaps and create a documentation structure."

2. Activate: document-generator
    Task: "Create comprehensive documentation for:
           - Development setup guide
           - Deployment procedures
           - API reference
           - Troubleshooting guide"
```

### Phase 2: Connect (Onyx)
```
3. Use Onyx: Connect GitHub repository
    - Connector: GitHub (built-in)
    - Index: All Sampada-Store source code
    - Enable: Code search and explanation

4. Use Onyx: Connect documentation
    - Connector: File/Local
    - Index: All .md files in docs/ folder
    - Enable: Natural language Q&A over docs
```

### Phase 3: Use (Both)
```
5. Activate: senior-developer (for complex architecture questions)
    Task: "Explain the Sampada authentication flow. 
           How does NextAuth.js integrate with GitHub OAuth?"

6. Use Onyx: Developer Assistant persona (for quick code questions)
    Query: "Where is the Stripe checkout implemented?"
    Query: "How do product variants work in the schema?"

7. Activate: code-reviewer (for PR reviews)
    Task: "Review the latest pull request for:
           - Code quality
           - Security issues
           - Performance concerns
           - Test coverage"
```

---

## 🔄 Workflow 4: Marketing & Growth

### Phase 1: Strategy (Agency-Agents)
```
1. Activate: growth-hacker
    Task: "Create a growth strategy for Sampada Store.
           Focus on:
           - Increasing conversion rate
           - Reducing cart abandonment
           - Improving customer lifetime value
           - Viral referral loops"

2. Activate: seo-specialist
    Task: "Audit Sampada product pages for SEO.
           Optimize:
           - Meta tags and structured data
           - Product descriptions
           - URL structure
           - Image alt text"

3. Activate: content-creator
    Task: "Create a content calendar for:
           - Product launch announcements
           - Blog posts about tech trends
           - Social media campaigns
           - Email newsletters"
```

### Phase 2: Execute (Onyx + Agency-Agents)
```
4. Use Onyx: Business Analyst persona
    Query: "What are our top-performing products this month?"
    Query: "Which marketing channels drive most conversions?"
    Query: "What's our customer acquisition cost?"

5. Activate: ad-creative-strategist
    Task: "Create ad copy for Aurora Sky Pulse™ campaign.
           Platforms: Instagram, Facebook, Google Ads
           Focus: Tech enthusiasts, early adopters"

6. Use Onyx: Generate marketing content
    - Product descriptions at scale
    - Social media post variations
    - Email campaign drafts
```

### Phase 3: Analyze & Optimize (Both)
```
7. Activate: analytics-reporter
    Task: "Set up conversion tracking for all marketing campaigns.
           Create dashboard showing:
           - Traffic sources
           - Conversion funnels
           - Revenue attribution
           - ROI by channel"

8. Use Onyx: Deep Research
    Task: "Analyze competitor pricing and positioning.
           Compare Sampada's Aurora Sky Pulse™ vs:
           - Competitor A's flagship product
           - Competitor B's premium line
           Identify differentiation opportunities."

9. Activate: behavioral-nudge-engine
    Task: "Design micro-interactions to increase conversions:
           - Urgency indicators (low stock)
           - Social proof (recent purchases)
           - Trust signals (reviews, guarantees)
           - Cart recovery emails"
```

---

## 🔄 Workflow 5: Performance Optimization

### Phase 1: Audit (Agency-Agents)
```
1. Activate: performance-benchmarker
    Task: "Analyze Sampada's build output:
           - 251KB First Load JS is too large
           - Identify largest chunks
           - Find code splitting opportunities
           - Check for unused dependencies"

2. Activate: frontend-developer
    Task: "Fix ESLint warnings:
           - Replace <img> with Next.js <Image> in about.js, account.js
           - Fix useEffect dependency warnings
           - Optimize bundle size"
```

### Phase 2: Implement (Agency-Agents)
```
3. Activate: database-optimizer
    Task: "Optimize Sanity GROQ queries:
           - Reduce payload size
           - Add projection filters
           - Cache frequently accessed data"

4. Activate: backend-architect
    Task: "Review API routes for performance:
           - Add response caching
           - Optimize Stripe webhook handler
           - Reduce cold start time"
```

### Phase 3: Monitor (Onyx)
```
5. Use Onyx: Business Analyst persona
    Query: "What's our average page load time?"
    Query: "Which pages have highest bounce rate?"
    Query: "How does performance affect conversion rate?"

6. Activate: performance-benchmarker (re-run)
    Task: "Measure improvements after optimization:
           - Compare bundle sizes
           - Test Lighthouse scores
           - Verify Core Web Vitals"
```

---

## 📊 Decision Matrix: Which Tool When?

| Scenario | Start With | Then Use | Why |
|----------|------------|----------|-----|
| Fix build error | Agency-Agents (`frontend-developer`) | - | Code-specific expertise |
| Add AI chat to site | Onyx (deploy) | Agency-Agents (`frontend-developer`) for integration | Onyx provides platform, Agents provide code |
| Optimize SEO | Agency-Agents (`seo-specialist`) | Onyx (monitor rankings) | Agents know SEO, Onyx tracks results |
| Customer asks product question | - | Onyx (Product Expert) | Real-time RAG over product catalog |
| Customer asks order question | - | Onyx (Support Agent) | Access to order database |
| Plan new feature | Agency-Agents (`product-manager`) | Onyx (research) | Agents plan, Onyx researches |
| Review code | Agency-Agents (`code-reviewer`) | - | Structured review workflows |
| Analyze revenue | Onyx (Business Analyst) | Agency-Agents (`growth-hacker`) for strategy | Onyx analyzes data, Agents create strategy |
| Write tests | Agency-Agents (`qa-engineer`) | - | Test design expertise |
| Generate marketing content | Agency-Agents (`content-creator`) | Onyx (scale generation) | Agents create quality, Onyx creates quantity |

---

## 🎯 Quick Reference: Agent + Onyx Combos

### For Development
```
Agency-Agents: frontend-developer + backend-architect + code-reviewer
Onyx: Developer Assistant persona (internal knowledge)
Result: Faster, higher-quality development
```

### For Customer Experience
```
Agency-Agents: ux-architect + growth-hacker + seo-specialist
Onyx: Product Expert + Support Agent personas (customer-facing)
Result: Better UX, higher conversions, lower support load
```

### For Business Growth
```
Agency-Agents: product-manager + content-creator + ad-creative-strategist
Onyx: Business Analyst persona (analytics) + Deep Research (competitors)
Result: Data-driven decisions, scalable content, targeted marketing
```

### For Operations
```
Agency-Agents: project-shepherd + technical-writer + compliance-auditor
Onyx: Internal knowledge base (GitHub + docs + code search)
Result: Faster onboarding, consistent processes, compliance
```

---

## 🚀 Getting Started Today

### Immediate (Next 30 Minutes)
1. ✅ Agency-Agents already installed (147 agents)
2. ⏳ Deploy Onyx Lite (when Docker is running): `.\deploy-onyx-lite.ps1`
3. ✅ Integration package ready (`onyx-integration/`)

### This Week
1. Use Agency-Agents to fix current build warnings
2. Test Onyx personas locally
3. Add chat widget to Sampada staging

### Next 2 Weeks
1. Deploy Onyx to production
2. Connect Sanity CMS connector
3. Train support agent on order data
4. Use Agency-Agents for SEO optimization

### Next Month
1. Full AI-powered product search live
2. 24/7 customer support agent active
3. Internal knowledge base for dev team
4. Business analytics dashboard via Onyx

---

*Last Updated: April 4, 2026*  
*Ready for immediate execution*
