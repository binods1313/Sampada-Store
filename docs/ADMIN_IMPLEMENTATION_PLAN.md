# Admin System Implementation Plan

**Created:** 2026-04-06
**Goal:** Build world-class, easy-to-operate admin system

---

## Phase 1: Razorpay Integration (P0)

### 1.1 Create Razorpay Library
- File: `lib/razorpay.js`
- Functions: `createRazorpayOrder`, `verifyPayment`, `refundPayment`
- Support: UPI, Net Banking, Cards, Wallets, EMI

### 1.2 Create Razorpay API Endpoint
- File: `pages/api/razorpay/create-order.js`
- File: `pages/api/razorpay/verify-payment.js`

### 1.3 Add Payment Selector to Checkout
- File: `components/PaymentSelector.jsx`
- Toggle between Stripe and Razorpay based on currency
- INR → Razorpay, USD/EUR/GBP → Stripe

### 1.4 Update Cart Component
- Add Razorpay checkout button for INR currency
- Show payment method badges

---

## Phase 2: Admin Dashboard Polish (P1)

### 2.1 Center Headers & Balance Margins
- Files: `pages/admin/index.jsx`, `pages/admin/categories/index.jsx`
- Fix: Headers should be truly centered with balanced margins
- Align "+ Add Category" button properly

### 2.2 Fix Stat Cards
- Files: `components/admin/StatCard.jsx`, `pages/admin/index.jsx`
- Resize cards so logos fit fully
- Shift text to the right of logos (logo left, text right)
- Use flex layout with proper alignment

### 2.3 Consistent Padding & Spacing
- Replace inline styles with design tokens
- Use CSS variables from `styles/admin-tokens.css`

---

## Phase 3: Accessibility & UX (P1)

### 3.1 Add Alt Text to All Images
- Product images, category images, stat card logos
- File: `components/ProductForm.jsx`, `pages/admin/categories/index.jsx`

### 3.2 Add Stock Status Badges
- Green badge for "In Stock"
- Red badge for "Out of Stock"
- File: `pages/admin/products/index.jsx`

### 3.3 Fix Contrast Ratios
- Ensure all text meets WCAG 4.5:1 minimum
- Update gold accent colors if needed

---

## Phase 4: Categories Page Centering (P1)

### 4.1 Center Header Properly
- Fix flex layout so title is truly centered
- Balance "+ Add Category" button positioning

### 4.2 Balance Table Layout
- Center table headers
- Ensure consistent column spacing

---

## Phase 5: Code Review & Performance (P0)

### 5.1 Run Code Review
- Agent: `code-reviewer`
- Check: Correctness, security, performance

### 5.2 Performance Benchmark
- Agent: `performance-benchmarker`
- Measure: Load times, bundle size, render performance

### 5.3 Verify Goals
- Agent: `gsd-verifier`
- Confirm: Logos fit, text never overlaps, both payment processors work, categories centered

---

## Execution Order

1. ✅ Audit complete (done)
2. ⏳ Razorpay integration (2-3 hours)
3. ⏳ Dashboard polish (1-2 hours)
4. ⏳ Accessibility fixes (1 hour)
5. ⏳ Categories page fix (30 min)
6. ⏳ Code review & performance (30 min)
7. ⏳ Verification (30 min)

**Total Estimated Time:** 5-7 hours
