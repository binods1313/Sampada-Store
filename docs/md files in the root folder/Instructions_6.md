╔══════════════════════════════════════════════════════════════════╗
║  SAMPADA ORIGINALS — NEWSLETTER/SUBSCRIPTION SYSTEM REPAIR       ║
║  Fix the plumbing BEFORE building the subscription page          ║
╚══════════════════════════════════════════════════════════════════╝

CONTEXT FROM YOUR AUDIT:
  You found 3 competing newsletter systems, one broken write client,
  a fake MD5 hash function, and 2 fully-built but unmounted
  components. We fix this in 4 phases, in order. Do not skip ahead
  to Phase 4 (the subscription page) until Phases 1–3 are verified
  working. Each phase ends with a verification step — show me proof
  before moving to the next phase.

══════════════════════════════════════════════════════════════════
DECISION — PICK ONE SYSTEM, KILL THE OTHERS
══════════════════════════════════════════════════════════════════

We are standardizing on MAILCHIMP as the single source of truth
for all newsletter/subscriber data. Reasons: lib/mailchimp.js is
already feature-complete (abandoned-cart, post-purchase, stats),
and Mailchimp gives built-in email automation (welcome emails,
discount codes) that Sanity does not.

Sanity's newsletterSubscriber schema stays in the CMS for now
(do not delete the schema) but stops being written to going
forward. We are not migrating existing Sanity subscriber data
in this task — flag it to me separately if there's existing data
in there worth exporting to Mailchimp.

══════════════════════════════════════════════════════════════════
PHASE 1 — FIX hashEmail() IN lib/mailchimp.js
══════════════════════════════════════════════════════════════════

THE BUG:
  Mailchimp's API requires subscriber identifiers to be the
  lowercase MD5 hash of the email address (this is how Mailchimp
  looks up existing members for PATCH/update calls). The current
  hashEmail() is not doing real MD5, so every PATCH call (abandoned
  cart, post-purchase update) silently fails against real Mailchimp
  members.

THE FIX:
  Install the crypto module (built into Node, no new package needed)
  and replace hashEmail with:

  import crypto from 'crypto';

  function hashEmail(email) {
    return crypto
      .createHash('md5')
      .update(email.trim().toLowerCase())
      .digest('hex');
  }

  Find every place hashEmail() is called in lib/mailchimp.js
  (subscribe, abandoned-cart, post-purchase functions) and confirm
  they all use this corrected version.

VERIFICATION:
  Write a one-off test: hashEmail('test@example.com') should
  return 55502f40dc8b7c769880b10874abc9d0 (this is the real MD5
  of that string — confirm your output matches exactly).

══════════════════════════════════════════════════════════════════
PHASE 2 — UNIFY ALL SIGNUP FORMS TO ONE API ROUTE
══════════════════════════════════════════════════════════════════

KEEP:
  pages/api/mailchimp/[action].js  ← this is the real, working route

DELETE OR REDIRECT (do not leave silently broken):
  pages/api/newsletter/subscribe.js
    → This currently writes to Sanity using the read-only client
      and will keep 500ing. DELETE this file's Sanity write logic.
      Replace its entire body with a redirect to the Mailchimp
      route so any old references don't break:

      export default async function handler(req, res) {
        // Deprecated — forwards to unified Mailchimp route
        const mailchimpHandler = require('../mailchimp/[action]').default;
        req.query.action = 'subscribe';
        return mailchimpHandler(req, res);
      }

  pages/api/newsletter.js
    → This is the stub the blog page uses and does nothing.
      Replace its body the same way — forward to
      /api/mailchimp/[action] with action=subscribe.

RESULT: every existing form on the site (homepage, blog, any
future page) that calls /api/newsletter, /api/newsletter/subscribe,
or /api/mailchimp/subscribe all end up hitting the same real
Mailchimp logic. No frontend form code needs to change.

VERIFICATION:
  Test all 3 endpoints with a curl POST of a test email and
  confirm all 3 return the same success response and the email
  appears in the Mailchimp audience.

══════════════════════════════════════════════════════════════════
PHASE 3 — FIX ENV VARIABLE SPLIT
══════════════════════════════════════════════════════════════════

THE BUG:
  .env has real Mailchimp keys. .env.local has placeholder values.
  Next.js loads .env.local with HIGHER priority than .env in
  development, so local dev is silently using fake credentials.

THE FIX:
  Open .env.local and either:
    a) Remove the Mailchimp placeholder lines entirely (let it
       fall through to the real .env values), OR
    b) Copy the real values from .env into .env.local

  Confirm with me which approach before doing it — option (a) is
  cleaner but only works if .env is actually loaded in dev mode
  too. Check next.config.js / package.json for how env files are
  loaded before choosing.

  Also confirm .env.local is in .gitignore (it should be, since
  it's meant for local overrides) and that .env with real keys is
  NOT committed to git history. If real keys are in git history,
  flag this to me immediately — they need rotating.

VERIFICATION:
  In dev mode, log process.env.MAILCHIMP_API_KEY (first 6 chars
  only, never log the full key) and confirm it matches the real
  key from .env, not a placeholder.

══════════════════════════════════════════════════════════════════
PHASE 4 — WELCOME EMAIL + DISCOUNT CODE
══════════════════════════════════════════════════════════════════

THE GAP:
  /api/mailchimp/[action].js (or wherever subscribe logic lives)
  returns a hardcoded WELCOME10 code but never sends a welcome
  email, and NewsletterSection never shows the code to the user.

THE FIX (pick based on what's simpler given current setup):

  OPTION A — Mailchimp Automation (recommended, no code needed):
  Set up a Mailchimp "Welcome new subscribers" automation inside
  the Mailchimp dashboard itself (not code) that triggers on new
  subscriber and sends an email containing the WELCOME10 code as
  static text. Tell me once this is set up — no file changes needed.

  OPTION B — Send via code (if Mailchimp automation isn't available
  on the current plan):
  Use Mailchimp's transactional email or a simple SendGrid call
  (SENDGRID_FROM_EMAIL already exists in env, confirming SendGrid
  is already integrated elsewhere) to send a welcome email with
  the code immediately after successful subscribe.

  EITHER WAY — also fix the frontend:
  In NewsletterSection's success state (after the API call
  succeeds), display the code returned by the API:
    "✓ You're in! Use code WELCOME10 for 10% off your first order."

VERIFICATION:
  Subscribe a real test email and confirm: (1) the success message
  shows the code on screen, (2) a welcome email arrives (if Option
  A or B implemented) within a few minutes.

══════════════════════════════════════════════════════════════════
PHASE 5 — MOUNT THE ORPHAN COMPONENTS
══════════════════════════════════════════════════════════════════

NewsletterSignup and ExitIntentPopup are fully built but mounted
nowhere. Decide where each goes:

  NewsletterSignup component:
    Mount in the footer (components/SampadaFooter.jsx) above the
    copyright line, OR at the bottom of the blog page — pick
    whichever placement doesn't duplicate the homepage's existing
    "Join the Legacy" section. Confirm with me which placement
    before implementing if it's ambiguous from the component's
    current props/styling.

  ExitIntentPopup component:
    Mount globally in pages/_app.js so it can trigger site-wide,
    OR scope it to just the homepage if that's what it was
    originally designed for. Check the component's existing CSS
    classes for clues on intended scope, and tell me what you find
    before deciding.

  Both components should call the SAME unified API route from
  Phase 2 (/api/mailchimp/[action] with action=subscribe).

VERIFICATION:
  Trigger ExitIntentPopup (mouse leaves viewport top) and confirm
  it submits successfully. Confirm NewsletterSignup renders in
  its new location without breaking existing layout.

══════════════════════════════════════════════════════════════════
PHASE 6 — NOW BUILD THE SUBSCRIPTION PAGE
══════════════════════════════════════════════════════════════════

Only start this once Phases 1–5 are verified working.

Create: pages/subscribe.jsx

This page now has a SOLID backend to plug into — the free tier
signup uses the same unified Mailchimp route from Phase 2.

PAGE STRUCTURE:

1. Hero section
   Background: var(--sampada-dark)
   Title: "Join the Legacy" — Libre Baskerville
   Subtitle (Sanskrit): "धर्मो रक्षति रक्षितः" — Tiro Devanagari Sanskrit
   Description: "Be the first to know about new drops, heritage
   stories, and exclusive offers"

2. Three membership tiers (cards, side by side on desktop,
   stacked on mobile)

   TIER 1 — Heritage Circle (Free)
   Border: var(--sampada-gold)
   Benefits list:
     Weekly heritage stories
     New collection alerts
     Style tips from Kavya
     Early access to sales
   CTA: "Join Free →"
   Action: POST to /api/mailchimp/[action] (action=subscribe)
           with an additional tag: 'heritage-circle'

   TIER 2 — Gold Member (₹299/month)
   Border: var(--sampada-crimson)
   Badge: "MOST POPULAR"
   Benefits list:
     Everything in Heritage Circle
     10% off every order
     Exclusive member-only drops
     Priority customer support
     Monthly style consultation with Kavya AI
   CTA: "Become Gold Member →"
   Action: Stripe checkout — create a new Stripe Price object
   for this recurring subscription if one doesn't already exist.
   Check lib/stripe.js or wherever Stripe is configured for the
   pattern used in /checkout, and follow the same pattern for
   creating a subscription checkout session (mode: 'subscription'
   not mode: 'payment').

   TIER 3 — Sampada Originals (₹999/month)
   Border: linear-gradient(135deg, gold, crimson)
   Badge: "PREMIUM"
   Benefits list:
     Everything in Gold
     20% off every order
     Free shipping on all orders
     Quarterly mystery heritage box
     Personal styling session (video call)
     Name on our Heritage Wall
   CTA: "Join the Inner Circle →"
   Action: Same Stripe subscription pattern as Tier 2, different
   Price ID.

   IMPORTANT — Stripe subscription webhook:
   Check if a webhook handler for subscription events
   (customer.subscription.created, invoice.paid, etc.) already
   exists. If not, flag this to me — paid tiers need a webhook
   to actually activate/deactivate membership status, this is
   not optional for a working paid subscription system.

3. Email newsletter strip (below the tier cards)
   Simple inline form: email input + "Subscribe →" button
   Text: "Just want updates? Join our free list."
   Action: same unified /api/mailchimp/[action] route, tag:
   'newsletter-only'

4. Social proof row
   "1,200+ customers"  |  "4.8★ rating"  |
   "Heritage since 2024"  |  "Made in India 🇮🇳"

STYLING RULES:
  Page background: var(--sampada-cream)
  Use existing brand CSS variables for all colors — do not
  hardcode hex values, reference the variables already defined
  in styles/sampada-brand.css
  Headings: Libre Baskerville
  Body: Inter
  Inline styles only — no Tailwind (matching existing pattern)
  Fully responsive — tiers stack vertically below 768px

══════════════════════════════════════════════════════════════════
PHASE 7 — NAVIGATION + DISCOVERABILITY
══════════════════════════════════════════════════════════════════

Files to modify:
  components/HomePage/SampadaNavbar.jsx
    → Add "Membership" to the "More" dropdown, linking to /subscribe

  components/HomePage/SampadaFooter.jsx
    → Add "Membership" link under the Company column

DO NOT TOUCH: Footer.jsx (the other footer file, if it's
different from SampadaFooter.jsx), Blog files beyond the newsletter
API forward, Careers page, Documentation page, any OAuth/NextAuth
files.

══════════════════════════════════════════════════════════════════
PHASE 8 — ADMIN DASHBOARD INTEGRATION
══════════════════════════════════════════════════════════════════

Add to the MODULES config array in pages/admin/index.jsx:

  {
    id: 'subscriptions',
    label: 'Subscriptions',
    icon: '💌',
    description: 'Newsletter subscribers and membership management',
    href: '/admin/subscriptions',
    status: 'active',
    accentColor: '#C9A84C',
    badge: 'MAILCHIMP'
  }

Create: pages/admin/subscriptions.jsx showing:
  - Total Mailchimp subscriber count (via existing lib/mailchimp.js
    stats function)
  - New subscribers this week
  - Breakdown by tag: heritage-circle / newsletter-only / gold /
    premium (if Stripe subscriptions are tracked separately,
    show paid tier counts from Stripe, not Mailchimp)
  - Recent subscriber emails (last 10, masked partially for
    privacy: e.g. "j***@gmail.com")
  - Direct link to open Mailchimp dashboard in new tab

══════════════════════════════════════════════════════════════════
ABSOLUTE RULES
══════════════════════════════════════════════════════════════════

1. Do not proceed to the next phase until the current phase's
   verification step is shown to me.
2. Do not delete the Sanity newsletterSubscriber schema — just
   stop writing to it going forward.
3. Never log full API keys or secrets, even in test/debug output.
4. Run npm run build after Phase 1, Phase 2, and Phase 6 — report
   build status each time, not just at the very end.
5. DO NOT DEPLOY without my explicit go-ahead.

══════════════════════════════════════════════════════════════════
✅ FINAL VERIFICATION (after all phases)
══════════════════════════════════════════════════════════════════

1. hashEmail() test output matches expected MD5
2. All 3 newsletter API endpoints forward to the same Mailchimp
   logic — show curl test results for each
3. Confirm correct Mailchimp key is loaded in dev (masked output)
4. A real test subscribe shows the WELCOME10 code on screen and
   (if implemented) triggers a welcome email
5. NewsletterSignup and ExitIntentPopup are visibly mounted and
   functional somewhere on the site
6. /subscribe page renders all 3 tiers correctly on desktop and
   mobile
7. Stripe checkout session is correctly created for Gold and
   Premium tier buttons (show the session ID logged, don't
   need to complete a real payment)
8. Flag clearly: does a Stripe subscription webhook already
   exist? Yes/No — if no, this is the next task, not optional
9. /admin/subscriptions shows real subscriber counts
10. npm run build passes with zero errors after all phases