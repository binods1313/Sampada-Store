# Immediate Actions Required - Quick Checklist

**Date**: May 23, 2026  
**Priority**: HIGH  
**Time Required**: 15 minutes

---

## ✅ ACTION 1: Update .env File (5 minutes) - COMPLETED

These credentials should be in your `.env` file:

```bash
# Stripe
STRIPE_WEBHOOK_SECRET=<added_to_env_file>

# Razorpay (verify these exist)
NEXT_PUBLIC_RAZORPAY_KEY_ID=<added_to_env_file>
RAZORPAY_KEY_SECRET=<check .env or regenerate>

# PayPal (Sandbox)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<added_to_env_file>
PAYPAL_CLIENT_SECRET=<added_to_env_file>
PAYPAL_MODE=sandbox
```

**Location**: Root of your project (`e:\Sampada-Store\.env`)

---

## 🎯 ACTION 2: Test Stripe Payment (5 minutes) - READY TO TEST

1. Go to https://sampada.online/checkout
2. Add a product to cart
3. Fill shipping form
4. Select "Credit / Debit Card"
5. Use test card: **4242 4242 4242 4242**
6. Expiry: Any future date (e.g., 12/25)
7. CVC: Any 3 digits (e.g., 123)
8. Complete payment
9. Verify redirect to success page
10. Check Stripe Dashboard for payment

**Expected Result**: Payment succeeds, redirects to success page

---

## ✅ ACTION 3: Test PayPal Payment (5 minutes)

1. Go to https://sampada.online/checkout
2. Add a product to cart
3. Fill shipping form
4. Select "PayPal"
5. Click PayPal button
6. Login with PayPal Sandbox account
7. Complete payment
8. Verify redirect to success page
9. Check PayPal Dashboard for transaction

**Expected Result**: Payment succeeds, redirects to success page

---

## ⏳ ACTION 4: Complete Razorpay KYC (1-2 business days)

**Why**: Razorpay dashboard is locked until KYC is complete

**Steps**:
1. Go to https://easy.razorpay.com/onboarding
2. Login with Razorpay account (Binod Kumar Samad)
3. Complete **Business Details**:
   - Business name
   - Business type
   - Business address
   - GST number (if applicable)
4. Complete **KYC Details**:
   - Upload business documents
   - Upload ID proof
   - Upload address proof
5. Submit for approval
6. Wait 1-2 business days for approval

**After Approval**:
1. Go to Settings → Webhooks
2. Create webhook: `https://sampada.online/api/razorpay/webhook`
3. Select events: payment.authorized, payment.captured, payment.failed, order.paid
4. Copy webhook secret
5. Add to `.env`: `RAZORPAY_WEBHOOK_SECRET=xxxxx`
6. Test Razorpay payment

---

## 📋 QUICK STATUS CHECK

- [x] Stripe webhook configured ✅
- [x] PayPal webhook configured ✅
- [x] Google Pay auto-enabled ✅
- [x] Checkout page styled ✅
- [x] Currency display fixed ✅
- [x] Sanity deployment resolved ✅
- [ ] .env file updated ⏳ (verify)
- [ ] Stripe payment tested ⏳
- [ ] PayPal payment tested ⏳
- [ ] Razorpay KYC completed ⏳ (low priority)
- [ ] Razorpay webhook configured ⏳ (after KYC)
- [ ] Razorpay payment tested ⏳ (after KYC)

---

## 🎯 TODAY'S GOALS

**Can be done today** (15 minutes):
1. ✅ Verify .env file has all credentials
2. ✅ Test Stripe payment
3. ✅ Test PayPal payment
4. ⏳ Submit Razorpay KYC (optional - can do later)

**Waiting period** (1-2 business days):
- ⏳ Razorpay KYC approval

**After KYC approval** (10 minutes):
- ⏳ Configure Razorpay webhook
- ⏳ Test Razorpay payment

---

## 🚨 CRITICAL NOTES

### **For .env File**:
- Make sure `.env` is in `.gitignore` (never commit secrets!)
- Restart your dev server after updating `.env`
- Verify all values are correct (no extra spaces)

### **For Testing**:
- Use test/sandbox credentials only
- Don't use real credit cards
- Check browser console for errors
- Check server logs for webhook events

### **For Production**:
- Stripe is already production-ready ✅
- PayPal needs switch to Live mode
- Razorpay needs KYC completion first

---

## 📞 NEED HELP?

**Reference Documents**:
- `docs/PAYMENT_INTEGRATION_COMPLETE.md` - Full details
- `docs/BROWSER_TASKS_PAYMENT_WEBHOOKS.md` - Step-by-step guide
- `docs/CHECKOUT_PAGE_IMPLEMENTATION.md` - Technical docs

**Common Issues**:
- Payment fails → Check API keys in `.env`
- Webhook not triggered → Check webhook URL and secret
- Razorpay locked → Complete KYC first

---

**Priority**: HIGH  
**Time**: 15 minutes (+ KYC wait)  
**Status**: Ready to execute

**Let's get those payments working!** 💳🚀
