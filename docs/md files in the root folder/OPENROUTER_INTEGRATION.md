# OpenRouter AI Integration for Sampada-Store

This integration provides AI-powered features using **OpenRouter's free API** with automatic key rotation for reliability.

## Features

### ✅ Available AI Tools

1. **Product Description Generator** - Create compelling e-commerce copy
2. **Customer Support Chatbot** - Handle customer inquiries 24/7
3. **SEO Content Generator** - Optimize content for search engines
4. **Text Summarization** - Condense long texts
5. **Translation** - Multi-language support

### 🎯 Free Models Available

**Currently Working (Tested):**
- `nvidia/nemotron-3-super-120b-a12b:free` - **Default & Recommended** (120B params, excellent quality)

**Note:** OpenRouter's free model availability changes frequently. Check [openrouter.ai/models](https://openrouter.ai/models) for current free offerings. The system is designed to easily swap models by updating the `FREE_MODELS` constant in `lib/openrouter.ts`.

---

## Setup

### 1. Get Your OpenRouter API Key

1. Visit [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Sign in (GitHub/Google)
3. Create a new API key
4. Copy the key

### 2. Configure Environment

Add to your `.env.local`:

```bash
# Required: Your OpenRouter API key
OPENROUTER_API_KEY="sk-or-v1-YOUR_API_KEY_HERE"

# Optional: Additional keys for rotation (failover)
# OPENROUTER_API_KEY_2="sk-or-v1-YOUR_SECOND_KEY"
# OPENROUTER_API_KEY_3="sk-or-v1-YOUR_THIRD_KEY"

# Optional: Custom default model
# OPENROUTER_DEFAULT_MODEL="google/gemma-3-12b-it:free"
```

### 3. Test the Integration

Run the test script:

```bash
node scripts/test-openrouter.js
```

You should see output like:

```
🔍 Testing OpenRouter Integration...

🧪 Testing: NVIDIA Nemotron 120B (Free)
   ✅ Success (1234ms)
   Response: "E-commerce is the buying and selling of goods and services over the internet..."
```

---

## Usage

### React Hooks (Frontend)

#### Product Description Generator

```tsx
import { useProductDescription } from '@/hooks/useAI';

function ProductForm() {
  const { generate, loading, data, error } = useProductDescription();

  const handleGenerate = async () => {
    const description = await generate('Premium Cotton T-Shirt', {
      features: ['100% organic cotton', 'Pre-shrunk', 'Breathable'],
      category: 'Apparel',
      tone: 'professional yet friendly',
      keywords: ['sustainable', 'comfortable', 'premium'],
    });
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Description'}
      </button>
      {data && <p>{data}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

#### Customer Support Chat

```tsx
import { useSupportChat } from '@/hooks/useAI';

function SupportWidget() {
  const { messages, loading, error, sendMessage, clearChat } = useSupportChat();

  const handleSend = async (message: string) => {
    await sendMessage(message);
  };

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i} className={msg.role}>
          {msg.content}
        </div>
      ))}
      <input 
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSend(e.target.value);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
}
```

#### Generic AI Generation

```tsx
import { useAIGeneration } from '@/hooks/useAI';

function SEOTool() {
  const { generate, loading, data, error } = useAIGeneration();

  const handleGenerate = async () => {
    const content = await generate('seo', 'Best running shoes for marathons', {
      keywords: ['marathon', 'running', 'comfortable', 'durable'],
      contentType: 'blog post',
      wordCount: 500,
    });
  };

  // ... render
}
```

### API Endpoint (Backend)

Make POST requests to `/api/ai`:

```typescript
// Product Description
const response = await fetch('/api/ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'generate-description',
    input: 'Premium Wireless Headphones',
    context: {
      features: ['40hr battery', 'Noise cancellation', 'Bluetooth 5.0'],
      category: 'Electronics',
      tone: 'professional',
    },
    options: {
      temperature: 0.8,
      maxTokens: 512,
    },
  }),
});

const { success, content, model, usage } = await response.json();
```

#### Available Actions

| Action | Description |
|--------|-------------|
| `generate-description` | Product descriptions |
| `chat` | Customer support conversations |
| `seo` | SEO-optimized content |
| `summarize` | Text summarization |
| `translate` | Multi-language translation |

---

## Key Rotation

The system automatically rotates between multiple API keys when:
- Rate limits are hit (429)
- Authentication fails (401/403)
- Network errors occur

Configure multiple keys in `.env.local`:

```bash
OPENROUTER_API_KEY="sk-or-v1-key-1"
OPENROUTER_API_KEY_2="sk-or-v1-key-2"
OPENROUTER_API_KEY_3="sk-or-v1-key-3"
```

The system will:
1. Try the current key
2. On failure, mark it with cooldown
3. Rotate to next available key
4. Retry automatically (up to 3 times)

---

## Demo Component

Access the AI demo UI at `/ai-demo` (you need to create the page):

```tsx
// pages/ai-demo.tsx
import { AIDemo } from '@/components/ai-demo';

export default function AIDemoPage() {
  return <AIDemo />;
}
```

This provides a UI to test:
- Product description generation
- Support chat
- General chat

---

## Rate Limits (Free Tier)

OpenRouter free models have rate limits:
- **Requests per minute**: Varies by model
- **Requests per day**: Varies by model
- **Context window**: Up to 128K tokens (model-dependent)

With key rotation, you can distribute load across multiple keys.

---

## Troubleshooting

### "No OpenRouter API key configured"

Add `OPENROUTER_API_KEY` to your `.env.local` file.

### "Rate limited"

- Wait for the cooldown period
- Add more API keys for rotation
- Use a different model with higher limits

### "Model not found"

Check the model name in the [OpenRouter model list](https://openrouter.ai/models).

### Slow responses

Free models may have higher latency. Try:
- `meta-llama/llama-3-8b-instruct:free` (faster, smaller)
- `google/gemma-3-12b-it:free` (balanced)

---

## Best Practices

1. **Cache responses** - Don't regenerate the same content repeatedly
2. **Use appropriate temperature** - Lower for facts (0.5), higher for creative (0.8)
3. **Validate output** - Always review AI-generated content before publishing
4. **Monitor usage** - Check OpenRouter dashboard for usage stats
5. **Handle errors gracefully** - Show friendly error messages to users

---

## Security Notes

⚠️ **Never commit `.env.local` to Git!**

The `.env.example` file has placeholder values. Keep your actual keys in `.env.local` which is gitignored.

---

## Future Enhancements

Potential additions:
- [ ] Streaming responses
- [ ] Image generation (DALL-E, Stable Diffusion via OpenRouter)
- [ ] Conversation memory/persistence
- [ ] Custom fine-tuned models
- [ ] Analytics dashboard
- [ ] A/B testing for generated content

---

## Resources

- [OpenRouter Docs](https://openrouter.ai/docs)
- [Available Models](https://openrouter.ai/models)
- [API Reference](https://openrouter.ai/docs/api-reference)
- [Pricing](https://openrouter.ai/pricing) (Free models section)
