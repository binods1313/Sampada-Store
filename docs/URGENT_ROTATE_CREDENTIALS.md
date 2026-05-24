# 🚨 URGENT: Rotate Exposed Credentials

**Priority**: CRITICAL  
**Time Required**: 15 minutes  
**Status**: ACTION REQUIRED

---

## ⚠️ WHAT HAPPENED

The following credentials were exposed in GitHub:
- ❌ Stripe webhook secret
- ❌ PayPal client secret
- ❌ Razorpay API keys

**These MUST be rotated immediately before using in production.**

---

## 🔥 IMMEDIATE ACTIONS (15 minutes)

### 1. Rotate Stripe Webhook (5 min) - CRITICAL

```
1. Go to: https://dashboard.stripe.com/webhooks
2. Delete webhook: https://sampada.online/api/webhooks/stripe
3. Create new webhook with same URL
4. Select same 8 events
5. Copy NEW secret
6. Update .env: STRIPE_WEBHOOK_SECRET=<new_secret>
7. Restart server
```

### 2. Rotate PayPal Secret (5 min) - HIGH

```
1. Go to: https://developer.paypal.com/dashboard/
2. Apps & Credentials → Your App
3. Click "Regenerate" under Client Secret
4. Copy NEW secret
5. Update .env: PAYPAL_CLIENT_SECRET=<new_secret>
6. Restart server
```

### 3. Rotate Razorpay Keys (5 min) - MEDIUM

```
1. Go to: https://dashboard.razorpay.com/
2. Settings → API Keys
3. Click "Regenerate Test Key"
4. Copy NEW Key ID and Secret
5. Update .env with both new values
6. Restart server
```

---

## ✅ AFTER ROTATION

### Test Payments:
- [ ] Test Stripe payment
- [ ] Test PayPal payment
- [ ] Verify webhooks working

### Then Push to GitHub:
```bash
git add docs/
git commit -m "security: remove exposed credentials"
git push origin main
```

---

## 📋 QUICK CHECKLIST

- [ ] Stripe webhook rotated
- [ ] PayPal secret rotated
- [ ] Razorpay keys rotated
- [ ] `.env` updated with new credentials
- [ ] Server restarted
- [ ] Payments tested
- [ ] Documentation pushed to GitHub

---

**DO THIS NOW before using in production!** 🚨

See `docs/SECURITY_CLEANUP_COMPLETE.md` for detailed instructions.
