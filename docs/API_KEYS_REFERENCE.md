# API Keys Reference - Sampada Store

**Last Updated**: May 11, 2026

---

## ✅ CONFIGURED API KEYS

### Google AI Services
- **GOOGLE_AI_API_KEY**: `YOUR_GOOGLE_API_KEY_HERE` ✅
- **GOOGLE_AI_KEY**: `YOUR_GOOGLE_API_KEY_HERE` ✅ (alias for compatibility)
- **GOOGLE_VISION_KEY**: `YOUR_GOOGLE_API_KEY_HERE` ✅ (same key works for Vision API)

**Usage**:
- Mockup generation (Imagen 3)
- Logo detection (Vision API)
- Content generation
- Image analysis

### Printify Integration
- **PRINTIFY_API_KEY**: Configured ✅
- **PRINTIFY_SHOP_ID**: `25358004` ✅

**Usage**:
- Product sync
- Order fulfillment
- Inventory management

### Perplexity AI
- **PERPLEXITY_API_KEY**: Configured ✅

**Usage**:
- Advanced content generation
- Research and analysis

---

## 📋 ADDITIONAL KEYS NEEDED (For Master Automation System)

### Anthropic (Claude)
**Status**: ⚠️ NOT CONFIGURED

**Required Keys**:
```env
ANTHROPIC_KEY=your_anthropic_api_key_here
```

**Usage**:
- SEO content generation (Claude Haiku - fast & cheap)
- Dynamic pricing engine (Claude Sonnet - advanced reasoning)
- Product descriptions
- Marketing copy

**How to Get**:
1. Visit: https://console.anthropic.com/
2. Sign up or log in
3. Go to API Keys section
4. Create new key
5. Add to `.env` file

**Pricing**:
- Claude Haiku: $0.25 per million input tokens (very cheap for bulk SEO)
- Claude Sonnet: $3 per million input tokens (worth it for pricing intelligence)

---

### Stability AI (Image Inpainting)
**Status**: ⚠️ NOT CONFIGURED

**Required Keys**:
```env
STABILITY_API_KEY=your_stability_api_key_here
```

**Usage**:
- Logo removal (inpainting)
- Image cleanup
- Background removal
- Watermark removal

**How to Get**:
1. Visit: https://platform.stability.ai/
2. Sign up for account
3. Go to API Keys
4. Generate new key
5. Add to `.env` file

**Pricing**:
- Pay-as-you-go: $0.002 per image
- Very affordable for logo removal pipeline

**Alternative**: You can use Clipdrop API (same company, easier to use)

---

### Webhook & Cron Security
**Status**: ⚠️ NOT CONFIGURED

**Required Keys**:
```env
CRON_SECRET=generate_random_string_here
WEBHOOK_SECRET=generate_random_string_here
```

**Usage**:
- Secure cron endpoints
- Verify webhook authenticity
- Prevent unauthorized access

**How to Generate**:
```bash
# Generate random secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run this twice to get two different secrets.

---

## 🔐 SECURITY BEST PRACTICES

### Current Setup ✅
- ✅ API keys stored in `.env` file
- ✅ `.env` file in `.gitignore`
- ✅ Keys never committed to repository
- ✅ Separate keys for test/production

### Recommendations
1. **Rotate Keys Regularly**: Change API keys every 90 days
2. **Use Key Restrictions**: Limit keys to specific domains/IPs
3. **Monitor Usage**: Set up billing alerts
4. **Separate Environments**: Use different keys for dev/staging/prod
5. **Backup Keys**: Store securely in password manager

---

## 📊 API KEY USAGE TRACKING

### Google AI API
**Current Key**: `YOUR_GOOGLE_API_KEY_HERE`

**Services Enabled**:
- ✅ Generative Language API (Gemini)
- ✅ Vision API (logo detection)
- ⚠️ Imagen API (check if enabled)

**How to Check**:
1. Visit: https://console.cloud.google.com/
2. Select project: `sampada-store-2026`
3. Go to "APIs & Services" → "Enabled APIs"
4. Verify these are enabled:
   - Generative Language API
   - Cloud Vision API
   - Vertex AI API (for Imagen)

**If Not Enabled**:
1. Go to "APIs & Services" → "Library"
2. Search for each API
3. Click "Enable"

---

## 🚀 QUICK SETUP GUIDE

### For Current Printify Integration (Phases 1-6)
**Required Keys** (Already Configured ✅):
- ✅ GOOGLE_AI_API_KEY
- ✅ PRINTIFY_API_KEY
- ✅ PRINTIFY_SHOP_ID
- ✅ SANITY_API_TOKEN

**You're ready to proceed with Phases 4-6!**

---

### For Master Automation System (After Phase 6)
**Additional Keys Needed**:
- ⚠️ ANTHROPIC_KEY (Claude for SEO & pricing)
- ⚠️ STABILITY_API_KEY (logo removal)
- ⚠️ CRON_SECRET (secure cron jobs)
- ⚠️ WEBHOOK_SECRET (secure webhooks)

**Estimated Cost**:
- Anthropic: ~$10-20/month for 1000 products
- Stability AI: ~$5-10/month for logo removal
- **Total**: ~$15-30/month for full automation

---

## 🧪 TESTING API KEYS

### Test Google AI API
```bash
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_GOOGLE_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

**Expected**: JSON response with generated text

---

### Test Printify API
```bash
curl -X GET \
  "https://api.printify.com/v1/shops/25358004/products.json" \
  -H "Authorization: Bearer YOUR_PRINTIFY_KEY"
```

**Expected**: JSON array of products

---

### Test Google Vision API
```bash
curl -X POST \
  "https://vision.googleapis.com/v1/images:annotate?key=YOUR_GOOGLE_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "requests": [{
      "image": {"source": {"imageUri": "https://example.com/image.jpg"}},
      "features": [{"type": "LOGO_DETECTION"}]
    }]
  }'
```

**Expected**: JSON response with logo detections

---

## 📞 SUPPORT & TROUBLESHOOTING

### Google API Issues
- **Error: API not enabled**: Enable in Google Cloud Console
- **Error: Quota exceeded**: Check billing and increase quota
- **Error: Invalid key**: Verify key is correct and not expired

### Printify API Issues
- **Error: Unauthorized**: Check API key and shop ID
- **Error: Rate limit**: Wait and retry (100 requests/minute limit)
- **Error: Product not found**: Verify product exists in shop

### General Issues
- **Keys not loading**: Restart Next.js dev server
- **Environment variables not found**: Check `.env` file location
- **CORS errors**: API keys should be server-side only

---

## 🔄 KEY ROTATION SCHEDULE

| Service | Current Key | Last Rotated | Next Rotation |
|---------|-------------|--------------|---------------|
| Google AI | `AIzaSyBbc...` | May 11, 2026 | Aug 11, 2026 |
| Printify | `eyJ0eXAi...` | - | - |
| Anthropic | Not set | - | - |
| Stability AI | Not set | - | - |

**Reminder**: Set calendar reminder for key rotation!

---

## ✅ CHECKLIST

### Current Status
- [x] Google AI API key configured
- [x] Google Vision API key configured
- [x] Printify API key configured
- [x] Printify Shop ID configured
- [x] Sanity API token configured
- [ ] Anthropic API key (needed for automation)
- [ ] Stability API key (needed for automation)
- [ ] Cron secret (needed for automation)
- [ ] Webhook secret (needed for automation)

### Before Phase 4-6 Testing
- [x] All required keys configured
- [x] Keys stored securely
- [x] `.env` file not committed
- [ ] Test API connections

### Before Master Automation System
- [ ] Get Anthropic API key
- [ ] Get Stability API key
- [ ] Generate cron secret
- [ ] Generate webhook secret
- [ ] Test all API connections
- [ ] Set up billing alerts

---

**Status**: ✅ Ready for Phases 4-6  
**Next Action**: Test API connections, then proceed with Phase 4

**All required keys for current work are configured!** 🎉
