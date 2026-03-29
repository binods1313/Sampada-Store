# 📋 Next Tasks - Sampada-Store AI Integration

**Last Updated:** March 29, 2026  
**Project:** Sampada-Store E-commerce Platform  
**Repository:** https://github.com/binods1313/Sampada-Store.git

---

## 🎯 Current Status

### ✅ Completed Features

1. **OpenRouter AI Integration** - Fully functional with 3 API keys
2. **Multi-Model Support** - Auto-fallback between models
3. **AI Demo Page** - `/ai-demo` for testing
4. **Contact Page** - With SendGrid email integration
5. **Stories Page** - Brand storytelling platform
6. **Dynamic Footer** - Enhanced navigation
7. **Sanity Bulk Edit Plugin** - Product management tool
8. **Collection Images** - Updated to PNG format

---

## ⏳ Pending Tasks - To Do Later

### 🔥 High Priority

#### 1. **Footer Banner Logo Size Fix** 🖼️
- **Issue:** Logo not appearing 10% bigger after CSS changes
- **Status:** CSS updated but visual change not visible
- **Files:** `components/FooterBanner.jsx`, `styles/footer-banner-description.css`
- **Next Step:** Debug browser cache or inspect element to verify CSS is applied
- **Solution Applied:** Added `transform: scale(1.1)` to CSS with `!important`

#### 2. **AI Integration in Product Admin** 🎯
- **Status:** Not started
- **Goal:** Add AI description generator to product add/edit forms
- **Files to Create:** `components/admin/ProductForm.jsx`
- **Files to Modify:** `pages/admin/products/add.jsx`, `pages/admin/products/edit/[id].jsx`
- **Hook:** `useProductDescription()` from `hooks/useAI.ts`

#### 3. **Customer Support Chatbot Widget** 💬
- **Status:** Not started
- **Goal:** Add floating chat widget to all pages
- **Files to Create:** `components/SupportChatWidget.jsx`
- **Files to Modify:** `components/Layout.jsx`
- **Hook:** `useSupportChat()` from `hooks/useAI.ts`

#### 4. **Bulk SEO Generator** 📈
- **Status:** Not started
- **Goal:** Generate meta descriptions for all products in bulk
- **Files to Create:** `pages/admin/seo/bulk-generate.jsx`
- **API:** POST `/api/products/bulk-update`
- **Hook:** `useAIGeneration({ tier: 2 })` for speed

---

### 📊 Medium Priority

#### 5. **Multi-Language Product Support** 🌍
- **Status:** Not started
- **Goal:** Translate products to Hindi, Spanish, French
- **Files to Create:** `components/ProductTranslation.jsx`
- **Hook:** `useAIGeneration('translate', ...)`
- **Database:** Add `translations` field to product schema

#### 6. **Review Response Automation** ⭐
- **Status:** Not started
- **Goal:** Auto-generate responses to customer reviews
- **Files to Create:** `components/ReviewResponseGenerator.jsx`
- **Files to Modify:** `pages/admin/reviews/index.jsx`
- **Hook:** `useAIGeneration('chat', ...)`

#### 7. **Social Media Content Generator** 📱
- **Status:** Not started
- **Goal:** Generate Instagram captions, Facebook ad copy
- **Files to Create:** `components/SocialMediaGenerator.jsx`
- **Hook:** `useAIGeneration('seo', ...)`
- **Use Case:** New product launches, promotions

#### 8. **Email Campaign Assistant** 📧
- **Status:** Not started
- **Goal:** Draft marketing emails, promotional content
- **Files to Create:** `components/EmailCampaignGenerator.jsx`
- **Integration:** SendGrid API
- **Hook:** `useAIGeneration('seo', ...)`

---

### 🔧 Low Priority / Nice to Have

#### 9. **AI-Powered Search** 🔍
- **Status:** Not started
- **Goal:** Semantic search for products (not just keyword matching)
- **Files to Create:** `lib/ai-search.js`, `pages/api/search.js`
- **Complexity:** High - requires vector embeddings

#### 10. **Product Recommendation Engine** 💡
- **Status:** Not started
- **Goal:** "You might also like" based on AI analysis
- **Files to Create:** `lib/recommendations.js`
- **Integration:** Product page, cart page
- **Complexity:** High - requires user behavior tracking

#### 11. **Voice Search Integration** 🎤
- **Status:** Partially implemented (VoiceAssistant exists)
- **Goal:** Allow customers to search by voice
- **Files to Modify:** `components/VoiceAssistant/`
- **Integration:** Web Speech API + AI processing

#### 12. **Automated Blog Posts** ✍️
- **Status:** Not started
- **Goal:** Generate blog posts about products, trends
- **Files to Create:** `components/BlogGenerator.jsx`
- **Hook:** `useAIGeneration('seo', ...)`
- **Integration:** Sanity blog schema

---

### 🧹 Technical Debt / Maintenance

#### 13. **Image Optimization Audit** 🖼️
- **Status:** Pending
- **Issue:** Some images still loading slowly
- **Action:** Audit all collection images, convert to WebP
- **Files:** `public/images/collections/`

#### 14. **Mobile Responsiveness Testing** 📱
- **Status:** Pending
- **Goal:** Test all new pages on mobile devices
- **Pages:** Contact, Stories, AI Demo
- **Fix:** Adjust CSS for small screens

#### 15. **Performance Optimization** ⚡
- **Status:** Pending
- **Goal:** Improve Lighthouse scores
- **Actions:**
  - Lazy load AI demo component
  - Optimize bundle size
  - Add service worker for offline support

#### 16. **Accessibility Audit** ♿
- **Status:** Pending
- **Goal:** WCAG 2.1 AA compliance
- **Tools:** axe DevTools, WAVE
- **Focus:** New components (AI demo, contact form, stories)

#### 17. **Error Monitoring Setup** 🐛
- **Status:** Partially implemented (ErrorBoundary exists)
- **Goal:** Add Sentry or similar for production monitoring
- **Files to Create:** `lib/sentry.js`, `pages/_error.jsx`

#### 18. **Analytics Integration** 📊
- **Status:** Not started
- **Goal:** Track AI feature usage, conversion rates
- **Options:** Google Analytics, Plausible, Fathom
- **Files to Modify:** `pages/_app.jsx`

---

### 🧪 Testing & Quality

#### 19. **Unit Tests for AI Hooks** 🧪
- **Status:** Not started
- **Files to Create:** `hooks/__tests__/useAI.test.ts`
- **Framework:** Jest, React Testing Library
- **Coverage:** All AI hooks, error handling

#### 20. **E2E Tests for Critical Flows** 🎭
- **Status:** Not started
- **Flows to Test:**
  - Product search → Add to cart → Checkout
  - Contact form submission
  - AI description generation
- **Framework:** Playwright or Cypress

#### 21. **API Endpoint Tests** 🔌
- **Status:** Not started
- **Files to Create:** `pages/api/__tests__/`
- **Endpoints:** `/api/ai`, `/api/contact`, `/api/stories`
- **Framework:** Jest, Supertest

---

### 📚 Documentation

#### 22. **API Documentation** 📖
- **Status:** Partially done (OPENROUTER_INTEGRATION.md exists)
- **Goal:** Document all API endpoints
- **Tool:** Swagger/OpenAPI or Markdown
- **Location:** `docs/API.md`

#### 23. **Admin User Guide** 📘
- **Status:** Not started
- **Goal:** Guide for non-technical admins
- **Topics:**
  - How to add products
  - How to use AI features
  - How to manage orders
- **Location:** `docs/ADMIN_GUIDE.md`

#### 24. **Deployment Guide** 🚀
- **Status:** Not started
- **Goal:** Document deployment process
- **Topics:**
  - Vercel deployment
  - Environment variables
  - Database migrations
- **Location:** `docs/DEPLOYMENT.md`

---

### 🎨 UI/UX Improvements

#### 25. **Dark Mode for AI Demo** 🌙
- **Status:** Partially implemented
- **Goal:** Full dark mode support
- **Files to Modify:** `components/ai-demo.tsx`
- **Integration:** Existing dark mode toggle

#### 26. **Loading Skeletons for AI Responses** ⏳
- **Status:** Not started
- **Goal:** Better UX while waiting for AI
- **Files to Create:** `components/AILoadingSkeleton.jsx`
- **Usage:** All AI generation components

#### 27. **Toast Notifications for AI Actions** 🔔
- **Status:** Not started
- **Goal:** Show success/error toasts
- **Integration:** `react-hot-toast` (already installed)
- **Usage:** All AI generation actions

#### 28. **AI Usage Dashboard** 📊
- **Status:** Not started
- **Goal:** Show API usage stats, token consumption
- **Files to Create:** `pages/admin/ai-usage.jsx`
- **Data:** Track requests per key, model, user

---

### 🔐 Security & Compliance

#### 29. **Rate Limiting for AI Endpoints** 🛡️
- **Status:** Not started
- **Goal:** Prevent abuse of AI features
- **Files to Create:** `lib/rateLimiter.js`
- **Integration:** `/api/ai` endpoint
- **Tool:** `express-rate-limit` (already installed)

#### 30. **Content Moderation** 🚫
- **Status:** Not started
- **Goal:** Filter inappropriate AI-generated content
- **Files to Create:** `lib/contentModeration.js`
- **Usage:** Before saving AI-generated descriptions

#### 31. **GDPR Compliance for AI** 🇪🇺
- **Status:** Not started
- **Goal:** Ensure AI features comply with GDPR
- **Actions:**
  - Add disclosure about AI usage
  - Allow opt-out
  - Document data processing

---

## 🎯 Quick Start for Next Session

### Recommended Order:

1. **Fix Footer Banner Logo** (if still needed)
2. **Priority 1: Product Admin AI** - Most impact
3. **Priority 2: Support Chatbot** - Customer value
4. **Priority 3: Bulk SEO** - Time saver
5. **Then pick from Medium Priority list**

---

## 🤖 AI Integration - Special Features

### 1. **3 API Keys with Auto-Rotation** ⚡

**What it does:** Automatically switches between 3 API keys when rate limits are hit.

**Why it matters:** Your app never stops working even if individual keys hit free tier limits.

**Configuration:** `.env.local`
```bash
OPENROUTER_API_KEY="sk-or-v1-key-1"
OPENROUTER_API_KEY_2="sk-or-v1-key-2"
OPENROUTER_API_KEY_3="sk-or-v1-key-3"
```

---

### 2. **Multi-Model Support with Auto-Fallback** 🤖

**What it does:** If one AI model is unavailable, automatically tries the next best model.

**Why it matters:** Free models on OpenRouter appear/disappear frequently. This ensures reliability.

**Flow:**
```
NVIDIA Nemotron 120B ❌ (Unavailable)
  ↓
Qwen 2.5 72B ❌ (Unavailable)
  ↓
Llama 3.1 8B ✅ (Success!)
```

---

### 3. **Tier-Based Quality Control** 📊

| Tier | Models | Quality | Speed | Best For |
|------|--------|---------|-------|----------|
| **Tier 1** | NVIDIA 120B | ⭐⭐⭐⭐⭐ | Normal | Product descriptions, customer-facing |
| **Tier 2** | Qwen 72B | ⭐⭐⭐⭐ | Fast | Internal tools, drafts |
| **Tier 3** | Llama 8B | ⭐⭐⭐ | Faster | Quick responses, chat |
| **Tier 4** | Llama 1B | ⭐⭐ | Fastest | Simple tasks, testing |

---

## 🚀 Priority Tasks - Start Here

### **Priority 1: Integrate AI into Product Admin** 🎯

**Goal:** Add AI-powered product description generator to admin panel.

**Files to Create/Modify:**
```
pages/admin/products/add.jsx (modify)
components/admin/ProductForm.jsx (create)
```

**Implementation:**
```tsx
// pages/admin/products/add.jsx
import { useProductDescription } from '@/hooks/useAI';

function AddProduct() {
  const { generate, data, loading } = useProductDescription();
  
  const handleGenerate = async () => {
    const description = await generate(productName, {
      features: productFeatures,
      category: productCategory,
      tone: 'professional',
      keywords: productTags,
    });
    // Set to form field
  };
  
  return (
    <div>
      <input name="productName" />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : '✨ AI Generate Description'}
      </button>
      {data && <textarea value={data} readOnly />}
    </div>
  );
}
```

**Benefits:**
- Save hours of manual writing
- Consistent product descriptions
- SEO-optimized content

---

### **Priority 2: Customer Support Chatbot** 💬

**Goal:** Add AI chatbot to answer customer questions 24/7.

**Files to Create:**
```
components/SupportChatWidget.jsx (create)
pages/api/support-chat.js (optional - for backend)
```

**Implementation:**
```tsx
// components/SupportChatWidget.jsx
import { useSupportChat } from '@/hooks/useAI';

function SupportChatWidget() {
  const { messages, sendMessage, loading } = useSupportChat();
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-80">
        <div className="p-4 border-b">
          <h3 className="font-bold">Sampada Support</h3>
        </div>
        
        <div className="h-64 overflow-y-auto p-4">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block px-3 py-2 rounded-lg ${
                msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100'
              }`}>
                {msg.content}
              </span>
            </div>
          ))}
        </div>
        
        <input
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              sendMessage(e.target.value);
              e.target.value = '';
            }
          }}
          placeholder="Ask about orders, shipping..."
          className="w-full p-2 border-t"
        />
      </div>
    </div>
  );
}
```

**Add to Layout:**
```tsx
// components/Layout.jsx
import SupportChatWidget from '@/components/SupportChatWidget';

function Layout({ children }) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
      <SupportChatWidget /> {/* Add this */}
    </div>
  );
}
```

**Benefits:**
- 24/7 customer support
- Reduce support tickets
- Instant responses to common questions

---

### **Priority 3: Bulk SEO Generator** 📈

**Goal:** Generate meta descriptions for all products at once.

**Files to Create:**
```
pages/admin/seo/bulk-generate.jsx (create)
```

**Implementation:**
```tsx
// pages/admin/seo/bulk-generate.jsx
import { useAIGeneration } from '@/hooks/useAI';
import { useState } from 'react';

function BulkSEOG Generator() {
  const { generate } = useAIGeneration({ tier: 2 }); // Tier 2 for speed
  const [progress, setProgress] = useState(0);
  
  const generateAllMetaDescriptions = async (products) => {
    const results = [];
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const meta = await generate('seo', product.name, {
        context: {
          keywords: product.tags,
          contentType: 'meta description',
        },
      });
      results.push({ id: product.id, meta });
      setProgress(((i + 1) / products.length) * 100);
    }
    // Save to database via API
    await fetch('/api/products/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ results }),
    });
  };
  
  return (
    <div>
      <button onClick={() => generateAllMetaDescriptions(allProducts)}>
        Generate SEO for All Products
      </button>
      {progress > 0 && (
        <div className="progress-bar">
          Progress: {progress.toFixed(0)}%
        </div>
      )}
    </div>
  );
}
```

**Benefits:**
- SEO optimization at scale
- Save hours of manual work
- Improve search rankings

---

### **Priority 4: Multi-Language Product Descriptions** 🌍

**Goal:** Translate product descriptions to Hindi, Spanish, etc.

**Files to Create:**
```
components/ProductTranslation.jsx (create)
```

**Implementation:**
```tsx
// components/ProductTranslation.jsx
import { useAIGeneration } from '@/hooks/useAI';

function ProductTranslation({ productId, originalDescription }) {
  const { generate } = useAIGeneration();
  
  const translate = async (targetLanguage) => {
    const translated = await generate('translate', originalDescription, {
      context: { targetLanguage },
    });
    // Save to database
  };
  
  return (
    <div>
      <button onClick={() => translate('Hindi')}>Translate to Hindi</button>
      <button onClick={() => translate('Spanish')}>Translate to Spanish</button>
      <button onClick={() => translate('French')}>Translate to French</button>
    </div>
  );
}
```

**Benefits:**
- Reach international customers
- Localize content easily
- Expand market reach

---

### **Priority 5: Review Response Automation** ⭐

**Goal:** Auto-generate responses to customer reviews.

**Files to Create:**
```
components/ReviewResponseGenerator.jsx (create)
pages/admin/reviews/index.jsx (modify)
```

**Implementation:**
```tsx
// components/ReviewResponseGenerator.jsx
import { useAIGeneration } from '@/hooks/useAI';

function ReviewResponseGenerator({ review }) {
  const { generate } = useAIGeneration();
  
  const generateResponse = async () => {
    const response = await generate('chat', 
      `Generate a professional response to this customer review:
       Rating: ${review.rating}/5
       Review: ${review.text}
       Tone: ${review.rating >= 4 ? 'thankful and appreciative' : 'apologetic and solution-oriented'}`,
      { system: 'You are a customer service manager for Sampada store.' }
    );
    return response;
  };
  
  return (
    <button onClick={generateResponse}>
      ✨ AI Generate Response
    </button>
  );
}
```

**Benefits:**
- Respond to all reviews quickly
- Professional, consistent tone
- Improve customer satisfaction

---

## 🧪 Testing & Demo

### **AI Demo Page**

Visit: `http://localhost:3000/ai-demo`

**Features:**
- Test all AI capabilities
- Select different models
- Compare tier quality
- Test product descriptions, chat, general AI

### **Test Scripts**

```bash
# Test all models
node scripts/test-all-models.js

# Test basic integration
node scripts/test-openrouter.js
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `OPENROUTER_INTEGRATION.md` | Complete API documentation |
| `AI_INTEGRATION_SUMMARY.md` | Quick start guide |
| `AI_MULTI_MODEL_SETUP.md` | Multi-model configuration |
| `docs/NextTask.md` | This file - next steps |

---

## 🎯 Quick Start Checklist

### For Next Session:

1. **Pick one priority task** from above
2. **Review AI hooks** in `hooks/useAI.ts`
3. **Check demo page** at `/ai-demo` to understand capabilities
4. **Start with Product Admin integration** (Priority 1)
5. **Test thoroughly** before moving to next task

---

## 🔧 Technical Reference

### **Available Hooks**

```tsx
// Product descriptions
const { generate, data, loading } = useProductDescription();

// Customer support chat
const { messages, sendMessage } = useSupportChat();

// Generic AI tasks
const { generate, data } = useAIGeneration({ model, tier });
```

### **Available Actions**

```typescript
'generate-description'  // Product descriptions
'chat'                  // Customer support
'seo'                   // SEO content
'summarize'             // Text summarization
'translate'             // Multi-language translation
```

### **API Endpoint**

```typescript
POST /api/ai
{
  "action": "generate-description",
  "input": "Product Name",
  "context": { /* optional context */ },
  "options": {
    "model": "nvidia/nemotron-3-super-120b-a12b:free",
    "tier": 1,
    "temperature": 0.7
  }
}
```

---

## 💡 Tips for Implementation

1. **Start Small:** Implement one feature at a time
2. **Test Each Feature:** Use demo page before integrating
3. **Handle Errors:** Always show friendly error messages
4. **Loading States:** Show spinner while generating
5. **Review AI Output:** Always let users edit before publishing

---

## 🆘 Troubleshooting

### "No API key configured"
- Check `.env.local` has `OPENROUTER_API_KEY`
- Restart dev server after adding keys

### "Rate limited"
- System auto-rotates to next key
- Wait a few minutes or add more keys

### "Model not available"
- System auto-fallbacks to next model
- Check `/api/ai/models` for available models

### Slow responses
- Use Tier 2-3 models for faster results
- NVIDIA 120B is best quality but ~2s response

---

## 📞 Resources

- **OpenRouter Docs:** https://openrouter.ai/docs
- **Available Models:** https://openrouter.ai/models
- **Your Demo:** http://localhost:3000/ai-demo
- **Your Code:** `hooks/useAI.ts`, `lib/openrouter.ts`

---

## 🎉 Ready to Start?

**Recommended First Task:** Priority 1 - Product Admin Integration

**Why:** Most immediate impact, saves time on every new product

**Files to Reference:**
- `hooks/useAI.ts` - React hooks
- `components/ai-demo.tsx` - UI example
- `pages/api/ai.ts` - API endpoint

**Good luck! 🚀**
