# Code Review: Razorpay Payment System & Admin Dashboard

**Date:** 6 April 2026  
**Reviewer:** Code Reviewer Agent  
**Scope:** Razorpay integration, payment flow, admin StatCard component

---

## 📋 Executive Summary

The Razorpay integration is **functionally solid** with good UX considerations (auto-selection by currency, dual payment processor support, loading states). The admin StatCard is visually polished with nice animations. However, there are **security concerns** and **reliability gaps** that need attention before production deployment.

**Overall Quality Score: B+**

---

## ✅ What's Done Well

### Razorpay Library (`lib/razorpay.js`)
- ✅ **Clean API design** — well-structured exports with JSDoc documentation
- ✅ **Graceful degradation** — returns `null` when credentials are missing instead of crashing
- ✅ **User-friendly error messages** — translates technical errors into actionable messages
- ✅ **HMAC-SHA256 signature verification** — correct implementation of Razorpay's verification algorithm

### Create Order Endpoint (`pages/api/razorpay/create-order.js`)
- ✅ **Input validation** — validates amount, currency, and method
- ✅ **Currency whitelist** — restricts to supported currencies
- ✅ **Proper HTTP method enforcement** — 405 for non-POST requests
- ✅ **Performance timing** — `console.time` for debugging

### Payment Selector UI (`components/PaymentSelector.jsx`)
- ✅ **Excellent UX** — auto-selects processor based on currency with clear visual tabs
- ✅ **Framer Motion animations** — smooth transitions between processors
- ✅ **Security badge** — builds customer trust with SSL messaging
- ✅ **Responsive design** — proper mobile breakpoints

### Cart Integration (`components/Cart.jsx`)
- ✅ **Dynamic script loading** — loads Razorpay SDK only when needed
- ✅ **Error handling** — toast notifications for all failure paths
- ✅ **Analytics tracking** — GA4 `begin_checkout` event integration
- ✅ **Abandoned cart tracking** — fire-and-forget Mailchimp integration

### Admin StatCard (`components/admin/StatCard.jsx`)
- ✅ **Animated counter** — smooth ease-out cubic animation with `requestAnimationFrame`
- ✅ **Skeleton loading states** — shimmer effect while data loads
- ✅ **Accessibility** — proper ARIA roles, keyboard navigation with Enter/Space
- ✅ **Responsive layout** — stacks vertically on mobile, side-by-side on desktop

---

## 🔴 Critical Issues (Must Fix Before Production)

### 1. 🔴 **Missing Amount Validation — Price Manipulation Risk**
**Files:** `pages/api/razorpay/create-order.js`, `pages/api/razorpay/verify-payment.js`  
**Severity:** Critical

**Why:** The `amount` parameter comes directly from the client without server-side verification against actual cart items. A malicious user could:
```javascript
// Client sends:
{ amount: 1, currency: 'INR', ... } // Pay ₹0.01 instead of ₹5000
```

**Suggestion:**
```javascript
// In create-order.js, verify amount against cart items from database
// OR sign the amount server-side and validate on verification
const { cartItems } = req.body;
const serverCalculatedTotal = await calculateTotalFromDatabase(cartItems);
if (Math.abs(serverCalculatedTotal - amount) > 0.01) {
  return res.status(400).json({ error: 'Amount mismatch' });
}
```

---

### 2. 🔴 **No Idempotency — Double Payment Risk**
**File:** `pages/api/razorpay/verify-payment.js`  
**Severity:** Critical

**Why:** If the verification endpoint is called twice with the same payment IDs (network retry, user double-click), it will process the payment twice. There's no check to prevent duplicate order fulfillment.

**Suggestion:**
```javascript
// Before processing, check if this payment_id was already processed
const existingOrder = await db.order.findUnique({
  where: { razorpay_payment_id: razorpay_payment_id }
});
if (existingOrder) {
  return res.status(200).json({ 
    success: true, 
    message: 'Payment already processed',
    order_id: existingOrder.id 
  });
}
```

---

### 3. 🔴 **Hardcoded Business Name in Razorpay Options**
**File:** `components/Cart.jsx` (line ~400)  
**Severity:** High

**Why:**
```javascript
name: 'Sampada Store', // Hardcoded
```
If the business name changes, this requires a code deploy. Should be in environment variables or a config file.

**Suggestion:**
```javascript
name: process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Sampada Store',
```

---

## 🟡 High-Priority Issues

### 4. 🟡 **Secret Exposed in Error Messages**
**File:** `lib/razorpay.js` (line ~75)  
**Severity:** High

**Why:** The error handling in `verifyPayment` catches and re-throws errors with their original messages. If Razorpay's SDK throws an error containing the key secret (e.g., during authentication failure), it could leak to the client.

**Suggestion:**
```javascript
} catch (error) {
  console.error('Error verifying Razorpay payment:', error);
  // Never expose internal error details to client
  throw new Error('Payment verification failed. Please contact support.');
}
```

---

### 5. 🟡 **Missing Webhook for Payment Confirmation**
**File:** `pages/api/razorpay/verify-payment.js`  
**Severity:** High

**Why:** The code has a `TODO` comment acknowledging this:
```javascript
// TODO: Here you can add additional logic like:
// - Update order status in database
// - Send confirmation email
// - Trigger Printify fulfillment
```
Relying solely on client-side verification is unreliable. If the user closes the browser after payment but before the redirect, the order is lost.

**Suggestion:** Implement a webhook endpoint at `/api/webhooks/razorpay` as the **source of truth** for payment confirmation, and treat the client-side verification as a UX enhancement only.

---

### 6. 🟡 **Race Condition: Cart Not Cleared on Server**
**File:** `components/Cart.jsx` (line ~430)  
**Severity:** High

**Why:** After successful payment, the cart is cleared client-side only:
```javascript
setTimeout(() => {
  window.location.href = `/success?payment_id=...`;
}, 1500);
```
If the user has multiple tabs open or the redirect fails, the cart remains populated.

**Suggestion:** Clear cart on the server after payment verification:
```javascript
await db.cart.deleteMany({ where: { userId: session?.user?.id } });
```

---

### 7. 🟡 **Incomplete EMI Amount Comparison Logic**
**File:** `components/PaymentSelector.jsx` (line ~130)  
**Severity:** Medium-High

**Why:**
```javascript
const amountInINR = currency === 'INR' ? totalPrice : totalPrice; // Already converted in cart
return amountInINR * 100 >= method.minAmount; // Convert to paise for comparison
```
The comment says "already converted" but the code does the same operation for both branches. If `totalPrice` is in USD when currency is not INR, this comparison is wrong.

**Suggestion:**
```javascript
// Make the intent explicit
const amountInPaise = currency === 'INR' 
  ? Math.round(totalPrice * 100) 
  : Math.round(convertToINR(totalPrice) * 100);
return amountInPaise >= method.minAmount;
```

---

## 🟡 Medium-Priority Issues

### 8. 🟡 **Script Tag Not Cleaned Up on Unmount**
**File:** `components/Cart.jsx` (lines 55-67)  
**Severity:** Medium

**Why:** The Razorpay checkout script is appended to `document.body` but never removed if the component unmounts. This causes a memory leak.

**Suggestion:**
```javascript
useEffect(() => {
  if (selectedPaymentProcessor === 'razorpay' && !window.Razorpay) {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      // Cleanup: remove script if component unmounts before load
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }
}, [selectedPaymentProcessor]);
```

---

### 9. 🟡 **Google Pay Check Uses Hardcoded USD**
**File:** `components/Cart.jsx` (line ~95)  
**Severity:** Medium

**Why:**
```javascript
currency: 'usd', // Hardcoded regardless of selected currency
```
If the user is shopping in INR, the Google Pay availability check uses USD, which may give incorrect results.

**Suggestion:**
```javascript
currency: selectedCurrency.toLowerCase(),
total: {
  label: 'Total',
  amount: Math.round(convertedTotal * 100), // Use converted amount
},
```

---

### 10. 🟡 **No Rate Limiting on API Endpoints**
**Files:** `pages/api/razorpay/create-order.js`, `pages/api/razorpay/verify-payment.js`  
**Severity:** Medium

**Why:** An attacker could spam the order creation endpoint to create thousands of Razorpay orders, potentially hitting API limits or incurring costs.

**Suggestion:** Add rate limiting (e.g., using `express-rate-limit` or Upstash Redis):
```javascript
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10s'), // 10 requests per 10 seconds
});

// In handler:
const { success } = await ratelimit.limit(req.ip || 'unknown');
if (!success) return res.status(429).json({ error: 'Too many requests' });
```

---

### 11. 🟡 **Magic String for Supported Currencies**
**File:** `pages/api/razorpay/create-order.js` (line ~40)  
**Severity:** Medium (Maintainability)

**Why:** The currency list is hardcoded in the API endpoint but also exists in `PaymentSelector.jsx`. If a new currency is added to one but not the other, users could select a currency that the API rejects.

**Suggestion:** Extract to a shared constant:
```javascript
// lib/constants.js
export const RAZORPAY_SUPPORTED_CURRENCIES = ['INR', 'USD', 'EUR', ...];
export const STRIPE_SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', ...];
```

---

### 12. 🟡 **StatCard Logo Path XSS Risk**
**File:** `components/admin/StatCard.jsx` (line ~85)  
**Severity:** Medium

**Why:**
```javascript
backgroundImage: logoPath ? `url('${logoPath}')` : "url('/images/Logo_16.png')",
```
If `logoPath` comes from user input (e.g., a custom theme setting), this could be an XSS vector: `logoPath = "'); alert('xss'); //"`

**Suggestion:**
```javascript
// Validate the path is a safe URL
const safeLogoPath = typeof logoPath === 'string' && logoPath.startsWith('/') 
  ? logoPath 
  : '/images/Logo_16.png';
backgroundImage: `url('${safeLogoPath}')',
```
Or better, use `encodeURIComponent()`:
```javascript
backgroundImage: logoPath 
  ? `url('${encodeURIComponent(logoPath)}')` 
  : "url('/images/Logo_16.png')",
```

---

## 💬 Low-Priority Issues (Nits)

### 13. 💬 **Inconsistent Error Code Naming**
**Files:** Both Razorpay API endpoints  
**Severity:** Low

**Why:** Error codes mix naming conventions: `INVALID_AMOUNT`, `MISSING_CURRENCY`, `PAYMENT_SERVICE_UNAVAILABLE`, `SIGNATURE_MISMATCH`. Some use `_`, some are inconsistent.

**Suggestion:** Standardize to `SCREAMING_SNAKE_CASE` with a consistent prefix:
```javascript
RAZORPAY_INVALID_AMOUNT
RAZORPAY_MISSING_CURRENCY  
RAZORPAY_SERVICE_UNAVAILABLE
RAZORPAY_SIGNATURE_MISMATCH
```

---

### 14. 💬 **Excessive Console Logging in Production**
**Files:** All Razorpay files  
**Severity:** Low

**Why:** Verbose logging like `console.log('\n--- Razorpay Create Order Handler Started ---')` will flood logs in production and increase costs with log aggregation services.

**Suggestion:** Use a logging utility that respects `NODE_ENV`:
```javascript
const logger = {
  debug: (...args) => process.env.NODE_ENV === 'development' && console.log(...args),
  info: (...args) => console.log(...args),
  error: (...args) => console.error(...args),
};
```

---

### 15. 💬 **StatCard Uses Inline Styles Over CSS Variables**
**File:** `components/admin/StatCard.jsx`  
**Severity:** Low (Maintainability)

**Why:** While CSS variables are used (`var(--admin-space-5)`), many styles are inline, making them harder to override in a design system.

**Suggestion:** Move complex styles to a CSS module or styled-component for better maintainability.

---

### 16. 💬 **Missing TypeScript Definitions**
**Severity:** Low

**Why:** The project uses `.jsx` files without TypeScript. For a payment system handling money, type safety would prevent costly bugs.

**Suggestion:** Consider migrating to `.tsx` files, especially for:
- Payment verification parameters
- Order response types
- Cart item structures

---

## 📊 Summary Table

| # | Issue | Severity | File | Status |
|---|-------|----------|------|--------|
| 1 | Amount manipulation risk | 🔴 Critical | create-order.js | ⬜ Open |
| 2 | No idempotency / double payment | 🔴 Critical | verify-payment.js | ⬜ Open |
| 3 | Hardcoded business name | 🔴 High | Cart.jsx | ⬜ Open |
| 4 | Secret exposure in errors | 🟡 High | razorpay.js | ⬜ Open |
| 5 | Missing webhook | 🟡 High | verify-payment.js | ⬜ Open |
| 6 | Cart not cleared server-side | 🟡 High | Cart.jsx | ⬜ Open |
| 7 | EMI amount comparison bug | 🟡 Medium-High | PaymentSelector.jsx | ⬜ Open |
| 8 | Script not cleaned up | 🟡 Medium | Cart.jsx | ⬜ Open |
| 9 | Google Pay hardcoded USD | 🟡 Medium | Cart.jsx | ⬜ Open |
| 10 | No rate limiting | 🟡 Medium | API endpoints | ⬜ Open |
| 11 | Duplicated currency lists | 🟡 Medium | Multiple | ⬜ Open |
| 12 | StatCard logo XSS risk | 🟡 Medium | StatCard.jsx | ⬜ Open |
| 13 | Inconsistent error codes | 💬 Low | API endpoints | ⬜ Open |
| 14 | Excessive logging | 💬 Low | All files | ⬜ Open |
| 15 | Inline styles | 💬 Low | StatCard.jsx | ⬜ Open |
| 16 | No TypeScript | 💬 Low | All files | ⬜ Open |

---

## 🎯 Recommended Fix Priority

### Before Production Launch (P0):
1. **Fix #1** — Server-side amount validation (security)
2. **Fix #2** — Idempotency check (data integrity)
3. **Fix #5** — Implement Razorpay webhook (reliability)

### Before Next Release (P1):
4. **Fix #4** — Sanitize error messages (security)
5. **Fix #6** — Server-side cart clearing (data integrity)
6. **Fix #10** — Add rate limiting (cost protection)
7. **Fix #12** — Sanitize logoPath (security)

### Backlog (P2):
8. Remaining medium and low issues

---

## 🏁 Conclusion

The Razorpay integration demonstrates **strong engineering practices** — proper signature verification, clean error handling, and excellent UX with auto-selection and animations. The admin StatCard is a polished component with great attention to detail.

**The main gaps are security-focused**: server-side amount validation, idempotency, and webhook implementation. These should be addressed before handling real money in production.

Once the critical issues are resolved, this will be a **production-ready payment system** that serves Indian and international customers equally well.

---

*Review completed by Code Reviewer Agent — 6 April 2026*
