🔱 Sampada Rebrand & SEO Implementation Prompt
🎯 Objective
Rebrand the ecommerce site from Binod Tech Ventures to Sampada – Custom Print-on-Demand, focused on prosperity-themed POD products (T-shirts, Mugs, Blankets). Ensure branding consistency, SEO optimization, checkout readiness, and deployment alignment.

✅ Required Code Changes
Navbar Component
Navbar.jsx

Line 24: Change Binod Tech Ventures → Sampada

Footer Component
Footer.jsx

Line 10: Change 2025 Lumina Headphones All Rights Reserved → © 2026 Sampada. Powered by Printify & Stripe

Homepage
index.js

Line 124: Update midText → Sampada Summer Sale – Reimagine Prosperity

Line 147: Add tagline below categories → Complete Wealth in Every Print – Ashta Sampada

Line 222: Change footer header Binod Tech Ventures → Sampada

Line 223: Update tagline for prosperity theme

Replace Best Sellers section with Printify mockups (Men/Women T-shirts, Mugs, Blankets)

About Page
about.js

Lines 59, 63: Replace fallback hero description with “Sampada”

Lines 119, 135, 143: Replace “Binod Tech Ventures” references → “Sampada”

Contact Page
contact.js

Line 55: Title → Contact Us – Sampada

Line 56: Meta description → Get in touch with Sampada

Line 177: Update emails → hello@sampada.com, support@sampada.com

Account Page
account.js

Line 328: Title → My Account | Sampada

Email Service
email.js

Line 8: Sender → Sampada <orders@sampada.com>

Update order confirmation templates to include Sampada branding and “Fulfilled by Printify”

Global Assets
Replace favicon/logo with Sampada gold/orange Vedic theme asset

Update manifest.json and index.html references to “Sampada”

⚙️ Features to Enable
Stripe Checkout: Enable Google Pay (India) + UPI

SEO Meta Tags: Add the following to <head> of each page:

Homepage
html
<title>Sampada – Custom Print-on-Demand | Prosperity in Every Print</title>
<meta name="description" content="Discover Sampada custom print-on-demand T-shirts, mugs, and blankets. Inspired by Vedic prosperity, designed for abundance and style.">
Product Detail Pages
html
<title>[Product Name] – Sampada Custom Print</title>
<meta name="description" content="Shop Sampada custom [product name]. Premium print-on-demand with prosperity-inspired designs. Ships via Printify | Stripe Secure Checkout.">
Contact Page
html
<title>Contact Us – Sampada</title>
<meta name="description" content="Get in touch with Sampada. For support, orders, and inquiries, email hello@sampada.com or support@sampada.com.">
About Page
html
<title>About Sampada – Prosperity in Every Print</title>
<meta name="description" content="Learn about Sampada, a Vedic-inspired custom print-on-demand brand. Bringing prosperity, abundance, and blessings through every product.">
Account Page
html
<title>My Account | Sampada</title>
<meta name="description" content="Manage your Sampada account. Track orders, update details, and enjoy prosperity-driven shopping experiences.">
Open Graph Tags
html
<meta property="og:title" content="Sampada – Custom Print-on-Demand">
<meta property="og:description" content="Complete Wealth in Every Print – Ashta Sampada. Shop custom T-shirts, mugs, blankets.">
<meta property="og:image" content="/assets/sampada-logo.png">
Responsive Design: Verify Tailwind mobile-first layouts

Product Detail Pages:

Title format: [Product] – Sampada Custom Print

Add badge: Ships via Printify | Stripe Secure Checkout

🚀 Deployment
GitHub Repo: binods1313/main

Vercel URL: sampada.vercel.app

Env Vars: Retain Printify + Stripe API keys

🧪 Verification Checklist
Homepage
Navbar shows “Sampada”

Footer shows “© 2026 Sampada. Powered by Printify & Stripe”

Hero banner shows “Sampada Summer Sale – Reimagine Prosperity”

Tagline visible: “Complete Wealth in Every Print – Ashta Sampada”

Best Sellers updated with Printify mockups

About/Contact/Account
No “Binod” references remain

Titles and meta descriptions reflect Sampada branding

Contact emails show sampada.com domain

Product Detail
Titles updated

Printify/Stripe badge visible

SEO tags applied

Checkout
Stripe demo flow works

Google Pay + UPI enabled

Order confirmation email shows Sampada branding and Printify fulfillment

Mobile
Navbar/logo/footer scale correctly

Tailwind responsiveness verified

SEO
Browser tab titles and meta descriptions reflect Sampada

Open Graph tags render correctly for social sharing

📌 Priority
Push all changes to GitHub (binods1313/main).
Deployment to Vercel (sampada.vercel.app) can follow after verification.  
Sampada branding must be fully implemented and verified.
Here’s a ready‑to‑use Sampada order confirmation email template that your coder can implement in the email service (email.js). It blends modern ecommerce clarity with Vedic prosperity blessings:

📧 Sampada Order Confirmation Email Template
html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sampada Order Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; color: #333; background-color: #faf9f6; }
    .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; background: #fff; }
    .header { text-align: center; color: #d97706; font-size: 24px; font-weight: bold; }
    .subheader { text-align: center; font-size: 16px; color: #6b7280; margin-bottom: 20px; }
    .order-details { margin: 20px 0; }
    .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 30px; }
    .btn { display: inline-block; padding: 10px 20px; background-color: #d97706; color: #fff; text-decoration: none; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">🌸 Sampada – Prosperity in Every Print 🌸</div>
    <div class="subheader">Your order has been received with blessings of abundance</div>

    <p>Dear {{customer_name}},</p>
    <p>Thank you for shopping with <strong>Sampada</strong>. Your order <strong>#{{order_number}}</strong> has been successfully placed on {{order_date}}.</p>

    <div class="order-details">
      <h3>Order Summary:</h3>
      <ul>
        <li>Product(s): {{product_list}}</li>
        <li>Total Amount: {{order_total}}</li>
        <li>Payment Method: {{payment_method}}</li>
      </ul>
    </div>

    <p>Your items will be <strong>fulfilled via Printify</strong> and shipped securely. You’ll receive tracking details once your package is on its way.</p>

    <p>✨ May this purchase bring prosperity, health, and joy to you and your family. ✨</p>

    <p style="text-align:center;">
      <a href="{{order_link}}" class="btn">View Your Order</a>
    </p>

    <div class="footer">
      © 2026 Sampada. Powered by Printify & Stripe<br>
      For support, contact <a href="mailto:support@sampada.com">support@sampada.com</a>
    </div>
  </div>
</body>
</html>
🔑 Key Features
Branding: Sampada prosperity theme with gold/orange accent (#d97706).

Personalization: Dynamic placeholders ({{customer_name}}, {{order_number}}, etc.).

Trust Signals: Explicit mention of Printify fulfillment + Stripe secure checkout.

Blessings: Vedic prosperity line: “May this purchase bring prosperity, health, and joy…”.

Action Button: “View Your Order” CTA with link.

This template can be plugged into your email service (email.js) and styled further with Tailwind or inline CSS.
Here’s a Sampada shipping confirmation email template you can drop into your email service. It continues the prosperity theme while clearly communicating logistics:

📧 Sampada Shipping Confirmation Email Template
html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sampada Shipping Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; color: #333; background-color: #faf9f6; }
    .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; background: #fff; }
    .header { text-align: center; color: #d97706; font-size: 24px; font-weight: bold; }
    .subheader { text-align: center; font-size: 16px; color: #6b7280; margin-bottom: 20px; }
    .order-details { margin: 20px 0; }
    .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 30px; }
    .btn { display: inline-block; padding: 10px 20px; background-color: #d97706; color: #fff; text-decoration: none; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">🚚 Sampada – Your Order is on the Way 🚚</div>
    <div class="subheader">Blessings of prosperity accompany your shipment</div>

    <p>Dear {{customer_name}},</p>
    <p>We’re delighted to let you know that your order <strong>#{{order_number}}</strong> has been shipped on {{ship_date}}.</p>

    <div class="order-details">
      <h3>Shipment Details:</h3>
      <ul>
        <li>Product(s): {{product_list}}</li>
        <li>Carrier: {{carrier_name}}</li>
        <li>Tracking Number: {{tracking_number}}</li>
        <li>Estimated Delivery: {{delivery_date}}</li>
      </ul>
    </div>

    <p>You can track your package anytime using the link below:</p>

    <p style="text-align:center;">
      <a href="{{tracking_link}}" class="btn">Track Your Shipment</a>
    </p>

    <p>✨ May this delivery bring abundance, health, and joy to your household. ✨</p>

    <div class="footer">
      © 2026 Sampada. Powered by Printify & Stripe<br>
      For support, contact <a href="mailto:support@sampada.com">support@sampada.com</a>
    </div>
  </div>
</body>
</html>
🔑 Key Features
Branding: Sampada prosperity theme with gold/orange accent.

Personalization: Dynamic placeholders ({{customer_name}}, {{order_number}}, {{tracking_number}}).

Trust Signals: Clear carrier + tracking info, Printify fulfillment noted in footer.

Blessings: Vedic prosperity line: “May this delivery bring abundance, health, and joy…”.

Action Button: “Track Your Shipment” CTA with link.

This ensures your shipping emails feel consistent with the order confirmation template while reinforcing Sampada’s prosperity‑driven brand identity.