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
