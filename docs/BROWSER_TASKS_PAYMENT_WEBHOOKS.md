# Browser Tasks - Payment Gateway Configuration

**Assigned To**: Browser Coder  
**Time Required**: 30-45 minutes  
**Difficulty**: Medium  
**Priority**: HIGH - Blocking checkout functionality

---

## 💳 ABOUT GOOGLE PAY

**Important**: Google Pay does **NOT** require separate configuration!

### **How Google Pay Works**
- Google Pay is integrated **through Stripe**
- When you configure Stripe (Task 1), Google Pay is automatically enabled
- No separate API keys, webhooks, or configuration needed

### **When Google Pay Appears**
Google Pay button will automatically show in Stripe checkout when:
- ✅ User is on Android device or Chrome browser
- ✅ User has Google Pay set up with a saved card
- ✅ Your Stripe account is verified (business verification)

### **If Google Pay Doesn't Appear**
This is **normal** and **okay**:
- Google Pay only shows when all conditions are met
- Regular card payment still works perfectly
- Users can still pay with credit/debit cards
- Google Pay is a **convenience feature**, not required

### **Testing Google Pay**
- Test on Android device or Chrome browser
- Make sure you have Google Pay set up
- If it doesn't appear, test regular card payment instead
- Google Pay payments will show in Stripe Dashboard

**Bottom Line**: Configure Stripe (Task 1) and Google Pay works automatically. No extra work needed!

---

## 🎯 OVERVIEW

The checkout page is built and ready, but payment webhooks need to be configured in the payment gateway dashboards. These are **browser-only tasks** that cannot be done through code.

**What you'll do**:
1. Configure Stripe webhook URL (includes Google Pay & Apple Pay)
2. Configure Razorpay webhook URL
3. Configure PayPal return URLs
4. Test each payment method (Stripe, Razorpay, PayPal, Google Pay)

---

## 📋 PREREQUISITES

Before starting, get these from the project owner:

### **Required Credentials**
- [ ] Stripe account login (email/password)
- [ ] Razorpay account login (email/password)
- [ ] PayPal Developer account login (email/password)
- [ ] Production domain URL (e.g., `https://sampada-store.com`)

### **Required Information**
- [ ] Current environment: Test/Sandbox or Production?
- [ ] Domain URL for webhooks
- [ ] Access to `.env` file (to verify API keys)

---

## 🔧 TASK 1: Configure Stripe Webhook

**Time**: 10 minutes  
**Dashboard**: https://dashboard.stripe.com

### **Step 1: Login to Stripe Dashboard**
1. Go to https://dashboard.stripe.com
2. Login with Stripe account credentials
3. Make sure you're in the correct mode:
   - **Test mode** for testing (toggle in top right)
   - **Live mode** for production

### **Step 2: Navigate to Webhooks**
1. Click **Developers** in the left sidebar
2. Click **Webhooks** tab
3. You'll see a list of existing webhooks (if any)

### **Step 3: Update or Create Webhook**

**If webhook already exists**:
1. Find the webhook pointing to localhost or old URL
2. Click on it
3. Click **"..."** menu → **Update details**
4. Update the endpoint URL (see below)

**If no webhook exists**:
1. Click **"+ Add endpoint"** button
2. Enter the endpoint URL (see below)

### **Step 4: Configure Webhook Endpoint**

**Endpoint URL**:
```
https://your-domain.com/api/webhooks/stripe
```

**Example**:
```
https://sampada-store.com/api/webhooks/stripe
```

**Events to listen to** (select these):
- ✅ `checkout.session.completed`
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`
- ✅ `charge.succeeded`
- ✅ `charge.failed`

**Or select**: "Select all events" (recommended for testing)

**📱 Note about Google Pay & Apple Pay**:
- Google Pay and Apple Pay work **through Stripe** - no separate configuration needed
- When you configure Stripe, you automatically enable Google Pay and Apple Pay
- These payment methods will appear automatically in the Stripe checkout if:
  - User is on a supported device (Android for Google Pay, iOS/Mac for Apple Pay)
  - User has Google Pay or Apple Pay set up
  - Your Stripe account is verified (may require business verification)

### **Step 5: Get Webhook Signing Secret**
1. After creating/updating webhook, you'll see a **Signing secret**
2. Click **"Reveal"** to show it
3. Copy the secret (starts with `whsec_...`)
4. **IMPORTANT**: Save this in your `.env` file:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

### **Step 6: Test Webhook**
1. Click **"Send test webhook"** button
2. Select `checkout.session.completed`
3. Click **"Send test webhook"**
4. Check that it shows **"Success"** (green checkmark)

### **✅ Verification**
- [ ] Webhook endpoint URL is correct
- [ ] Points to production domain (not localhost)
- [ ] Events are selected
- [ ] Test webhook succeeds
- [ ] Signing secret saved in `.env`

---

## 🔧 TASK 2: Configure Razorpay Webhook

**Time**: 10 minutes  
**Dashboard**: https://dashboard.razorpay.com

### **Step 1: Login to Razorpay Dashboard**
1. Go to https://dashboard.razorpay.com
2. Login with Razorpay account credentials
3. Make sure you're in the correct mode:
   - **Test mode** for testing (toggle in top left)
   - **Live mode** for production

### **Step 2: Navigate to Webhooks**
1. Click **Settings** (gear icon) in the left sidebar
2. Click **Webhooks** in the settings menu
3. You'll see a list of existing webhooks (if any)

### **Step 3: Create or Update Webhook**

**If webhook already exists**:
1. Find the webhook pointing to localhost or old URL
2. Click **Edit** button
3. Update the webhook URL (see below)

**If no webhook exists**:
1. Click **"+ Create New Webhook"** button
2. Enter the webhook URL (see below)

### **Step 4: Configure Webhook URL**

**Webhook URL**:
```
https://your-domain.com/api/razorpay/webhook
```

**Example**:
```
https://sampada-store.com/api/razorpay/webhook
```

**Events to listen to** (select these):
- ✅ `payment.authorized`
- ✅ `payment.captured`
- ✅ `payment.failed`
- ✅ `order.paid`

**Alert Email**: Enter your email for webhook failure notifications

### **Step 5: Get Webhook Secret**
1. After creating webhook, you'll see a **Secret** field
2. Copy the secret
3. **IMPORTANT**: Save this in your `.env` file:
   ```
   RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxx
   ```

### **Step 6: Verify API Keys**
While you're in the dashboard:
1. Go to **Settings** → **API Keys**
2. Copy **Key ID** and **Key Secret**
3. Verify they match your `.env` file:
   ```
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxx
   ```

### **✅ Verification**
- [ ] Webhook URL is correct
- [ ] Points to production domain (not localhost)
- [ ] Events are selected
- [ ] Webhook secret saved in `.env`
- [ ] API keys verified in `.env`

---

## 🔧 TASK 3: Configure PayPal Return URLs

**Time**: 10 minutes  
**Dashboard**: https://developer.paypal.com

### **Step 1: Login to PayPal Developer**
1. Go to https://developer.paypal.com
2. Login with PayPal Developer account credentials
3. Make sure you're in the correct mode:
   - **Sandbox** for testing
   - **Live** for production

### **Step 2: Navigate to Your App**
1. Click **Dashboard** in the top menu
2. Click **My Apps & Credentials**
3. Select the correct tab:
   - **Sandbox** tab for testing
   - **Live** tab for production
4. Find your app in the list (or create one if none exists)
5. Click on the app name to open settings

### **Step 3: Configure Return URLs**

Scroll down to **"Return URL"** section and add these URLs:

**Return URL** (success):
```
https://your-domain.com/success
```

**Cancel URL** (cancelled payment):
```
https://your-domain.com/checkout
```

**Example**:
```
Return URL: https://sampada-store.com/success
Cancel URL: https://sampada-store.com/checkout
```

### **Step 4: Configure Webhook**

Scroll down to **"Webhooks"** section:

1. Click **"Add Webhook"**
2. Enter webhook URL:
   ```
   https://your-domain.com/api/webhooks/paypal
   ```
3. Select events to listen to:
   - ✅ `PAYMENT.CAPTURE.COMPLETED`
   - ✅ `PAYMENT.CAPTURE.DENIED`
   - ✅ `CHECKOUT.ORDER.APPROVED`
   - ✅ `CHECKOUT.ORDER.COMPLETED`

### **Step 5: Get API Credentials**
1. In the app settings, find **"Client ID"** and **"Secret"**
2. Click **"Show"** to reveal the secret
3. Copy both values
4. **IMPORTANT**: Save these in your `.env` file:
   ```
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=xxxxxxxxxxxxx
   PAYPAL_CLIENT_SECRET=xxxxxxxxxxxxx
   PAYPAL_MODE=sandbox  # or "live" for production
   ```

### **✅ Verification**
- [ ] Return URL is correct
- [ ] Cancel URL is correct
- [ ] Webhook URL is correct
- [ ] Events are selected
- [ ] Client ID and Secret saved in `.env`
- [ ] PAYPAL_MODE is set correctly

---

## 🧪 TASK 4: Test Each Payment Method

**Time**: 15-20 minutes  
**Requirement**: Checkout page must be deployed and accessible

### **Prerequisites**
- [ ] Checkout page is deployed to production/staging
- [ ] All webhooks are configured (Tasks 1-3 complete)
- [ ] Test products exist in the store
- [ ] You have test payment credentials

---

### **Test 1: Stripe Payment**

**Time**: 5 minutes

1. **Add product to cart**
   - Go to any product page
   - Click "Add to Cart"
   - Go to checkout

2. **Fill shipping form**
   - Enter test shipping address
   - Use test email: `test@example.com`

3. **Select Stripe payment**
   - Select "Credit / Debit Card" option
   - Click "Pay" button

4. **Complete Stripe checkout**
   - You'll be redirected to Stripe checkout page
   - Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/25`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)
   - Click "Pay"

5. **Verify success**
   - Should redirect to `/success` page
   - Check Stripe Dashboard → Payments (should show the test payment)
   - Check if Printify order was created (if applicable)

**✅ Success Criteria**:
- [ ] Redirected to Stripe checkout
- [ ] Payment processed successfully
- [ ] Redirected to success page
- [ ] Payment appears in Stripe Dashboard
- [ ] No console errors

---

### **Test 2: Razorpay Payment**

**Time**: 5 minutes

1. **Add product to cart**
   - Go to any product page
   - Click "Add to Cart"
   - Go to checkout

2. **Fill shipping form**
   - Enter test shipping address
   - Use test email: `test@example.com`

3. **Select Razorpay payment**
   - Select "Razorpay" option
   - Click "Pay" button

4. **Complete Razorpay payment**
   - Razorpay modal will open
   - Select payment method (UPI, Card, Net Banking, etc.)
   - For testing, use:
     - **Card**: `4111 1111 1111 1111`
     - **CVV**: `123`
     - **Expiry**: Any future date
     - **OTP**: `123456` (for test mode)
   - Click "Pay"

5. **Verify success**
   - Should redirect to `/success` page
   - Check Razorpay Dashboard → Payments (should show the test payment)
   - Check if Printify order was created (if applicable)

**✅ Success Criteria**:
- [ ] Razorpay modal opened
- [ ] Payment processed successfully
- [ ] Redirected to success page
- [ ] Payment appears in Razorpay Dashboard
- [ ] No console errors

---

### **Test 3: PayPal Payment**

**Time**: 5 minutes

1. **Add product to cart**
   - Go to any product page
   - Click "Add to Cart"
   - Go to checkout

2. **Fill shipping form**
   - Enter test shipping address
   - Use test email: `test@example.com`

3. **Select PayPal payment**
   - Select "PayPal" option
   - PayPal button should appear

4. **Complete PayPal payment**
   - Click PayPal button
   - Login with PayPal Sandbox test account:
     - **Email**: (get from PayPal Sandbox accounts)
     - **Password**: (get from PayPal Sandbox accounts)
   - Or create a test buyer account in PayPal Sandbox
   - Complete the payment

5. **Verify success**
   - Should redirect to `/success` page
   - Check PayPal Dashboard → Transactions (should show the test payment)
   - Check if Printify order was created (if applicable)

**✅ Success Criteria**:
- [ ] PayPal button appeared
- [ ] PayPal popup opened
- [ ] Payment processed successfully
- [ ] Redirected to success page
- [ ] Transaction appears in PayPal Dashboard
- [ ] No console errors

---

### **Test 4: Google Pay (via Stripe)**

**Time**: 5 minutes  
**Note**: Google Pay works through Stripe - no separate configuration needed

1. **Prerequisites**
   - Must be on Android device or Chrome browser
   - Must have Google Pay set up with a card
   - Or use Chrome DevTools to simulate

2. **Add product to cart**
   - Go to any product page
   - Click "Add to Cart"
   - Go to checkout

3. **Fill shipping form**
   - Enter test shipping address
   - Use test email: `test@example.com`

4. **Select Stripe payment**
   - Select "Credit / Debit Card" option
   - Click "Pay" button

5. **Look for Google Pay button**
   - On Stripe checkout page, look for "Google Pay" button
   - If you don't see it:
     - You may not be on a supported device
     - Google Pay may not be set up
     - Your Stripe account may need verification
   - **This is normal** - Google Pay only shows when available

6. **Test Google Pay (if available)**
   - Click "Google Pay" button
   - Select payment method in Google Pay popup
   - Confirm payment
   - Should redirect to `/success` page

**✅ Success Criteria**:
- [ ] Google Pay button appears (if on supported device)
- [ ] Payment processes through Google Pay
- [ ] Redirected to success page
- [ ] Payment appears in Stripe Dashboard as "Google Pay"
- [ ] No console errors

**⚠️ Important Notes**:
- Google Pay is **optional** - it's a convenience feature
- If it doesn't appear, that's okay - regular card payment still works
- Google Pay requires:
  - Supported device (Android or Chrome)
  - Google Pay account with saved card
  - Verified Stripe account (may take 1-2 business days)
- Test with regular Stripe card payment if Google Pay isn't available

---

## 📊 TESTING CHECKLIST

### **For Each Payment Method**
- [ ] Stripe: Card payment works
- [ ] Stripe: Google Pay appears (if on supported device)
- [ ] Razorpay: Payment works
- [ ] PayPal: Payment works
- [ ] All redirect to success page
- [ ] All payments appear in gateway dashboards
- [ ] Webhooks are triggered (check dashboard logs)
- [ ] No errors in browser console
- [ ] No errors in server logs

### **Additional Checks**
- [ ] Cart clears after successful payment
- [ ] Order confirmation email sent (if configured)
- [ ] Printify order created (if product is Printify)
- [ ] Order saved in database (check admin panel)

---

## 🐛 TROUBLESHOOTING

### **Problem: Webhook test fails in Stripe**
**Cause**: Endpoint not accessible or returning error  
**Fix**: 
1. Check that the URL is correct and accessible
2. Check server logs for errors
3. Verify webhook secret in `.env` matches dashboard

### **Problem: Payment succeeds but doesn't redirect**
**Cause**: Return URL not configured correctly  
**Fix**: 
1. Check return URLs in payment gateway settings
2. Verify they point to correct domain
3. Check for JavaScript errors in console

### **Problem: Razorpay modal doesn't open**
**Cause**: API keys not configured or incorrect  
**Fix**: 
1. Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` in `.env`
2. Check that key is from correct mode (test/live)
3. Check browser console for errors

### **Problem: PayPal button doesn't appear**
**Cause**: Client ID not configured or incorrect  
**Fix**: 
1. Verify `NEXT_PUBLIC_PAYPAL_CLIENT_ID` in `.env`
2. Check that client ID is from correct mode (sandbox/live)
3. Check browser console for errors

### **Problem: Printify order not created**
**Cause**: Printify API key or shop ID incorrect  
**Fix**: 
1. Verify `PRINTIFY_API_KEY` in `.env`
2. Verify `NEXT_PUBLIC_PRINTIFY_SHOP_ID` in `.env`
3. Check server logs for Printify API errors

---

## 📝 DELIVERABLES

After completing all tasks, provide:

### **1. Configuration Confirmation**
- [ ] Screenshot of Stripe webhook configuration
- [ ] Screenshot of Razorpay webhook configuration
- [ ] Screenshot of PayPal return URLs configuration

### **2. Test Results**
- [ ] Stripe test payment screenshot (success page)
- [ ] Razorpay test payment screenshot (success page)
- [ ] PayPal test payment screenshot (success page)
- [ ] List of any errors encountered and how they were resolved

### **3. Updated Environment Variables**
Confirm these are in `.env` file:
```bash
# Stripe
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Razorpay
RAZORPAY_WEBHOOK_SECRET=xxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=xxxxx
PAYPAL_CLIENT_SECRET=xxxxx
PAYPAL_MODE=sandbox

# Printify
PRINTIFY_API_KEY=xxxxx
NEXT_PUBLIC_PRINTIFY_SHOP_ID=xxxxx
```

---

## 🎯 SUCCESS CRITERIA

You're done when:
- ✅ All 3 payment gateway webhooks configured
- ✅ All 3 payment methods tested successfully
- ✅ All payments redirect to success page
- ✅ All payments appear in respective dashboards
- ✅ No errors in browser console or server logs
- ✅ Screenshots and documentation provided

---

## 📞 NEED HELP?

**Reference Documents**:
- `docs/CHECKOUT_PAGE_IMPLEMENTATION.md` - Technical details
- `docs/TOMMY_TASKS_COMPLETE.md` - Task overview

**Common Issues**:
- Webhook URL must be HTTPS (not HTTP)
- Webhook URL must be publicly accessible (not localhost)
- API keys must match the mode (test/sandbox vs. live/production)
- Return URLs must be exact (no trailing slashes unless specified)

---

**Estimated Total Time**: 45-60 minutes  
**Priority**: HIGH  
**Blocking**: Checkout functionality  
**Status**: ⏳ Pending - Ready to start

**Good luck!** 🚀
