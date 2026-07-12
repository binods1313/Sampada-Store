╔══════════════════════════════════════════════════════════════════╗
║  SAMPADA ORIGINALS — FULL CODEBASE AUDIT                         ║
║  Find everything incomplete, broken, or missing                  ║
╚══════════════════════════════════════════════════════════════════╝

Do a thorough audit of the entire codebase. Do NOT fix 
anything yet. Only audit and report findings in the exact 
format below. I will prioritize what to fix after seeing 
the full report.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AUDIT SECTION 1 — TODO / FIXME / PLACEHOLDER SCAN

  Run these commands and paste the full output:

  grep -rn "TODO" --include="*.jsx" --include="*.tsx" \
    --include="*.js" --include="*.ts" \
    --exclude-dir=node_modules --exclude-dir=.next .

  grep -rn "FIXME\|HACK\|PLACEHOLDER\|coming soon\|not implemented\|stub\|dummy\|hardcoded" \
    --include="*.jsx" --include="*.tsx" \
    --include="*.js" --include="*.ts" \
    --exclude-dir=node_modules --exclude-dir=.next .

  grep -rn "href=\"#\"\|href='#'" \
    --include="*.jsx" --include="*.tsx" \
    --exclude-dir=node_modules --exclude-dir=.next .

  grep -rn "console.log\|console.error" \
    --include="*.jsx" --include="*.tsx" \
    --include="*.js" --include="*.ts" \
    --exclude-dir=node_modules --exclude-dir=.next . \
    | grep -v "//.*console"

  Paste all output. These reveal: unfinished logic, 
  debug code left in production, dead links, and stubs.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AUDIT SECTION 2 — PAGE BY PAGE VISUAL + CODE CHECK

  Open each page file and check:
  a) Does the page render without console errors?
  b) Are there any empty sections (no content)?
  c) Are there any broken images (missing src)?
  d) Are there any buttons/links with no action?
  e) Is there placeholder text ("Lorem ipsum", 
     "Coming soon", "TBD", "Sample text")?
  f) Are there any hardcoded test emails, prices, 
     or names that should come from Sanity/DB?

  Check these pages specifically:

  CUSTOMER PAGES:
  / (homepage)
  /shop
  /about
  /company
  /team
  /contact
  /support
  /stories
  /blog
  /careers
  /documentation
  /creative-studio
  /subscribe (if built)
  /privacy-policy
  /terms-and-conditions
  /refund-policy
  /account
  /wishlist
  /checkout
  /success

  ADMIN PAGES:
  /admin (dashboard)
  /admin/products
  /admin/products/add
  /admin/orders
  /admin/categories
  /admin/analytics
  /admin/ai-tools
  /admin/ai-hub
  /admin/ai-usage
  /admin/bulk-tag
  /admin/seo/bulk-generate
  /admin/subscriptions (if built)

  For each page report in this format:
  ┌─────────────────────┬──────┬────────────────────────┐
  │ Page                │ Status│ Issues Found          │
  ├─────────────────────┼──────┼────────────────────────┤
  │ /about              │ ⚠️   │ CTA button has href=#  │
  │ /admin/orders       │ ✅   │ None                   │
  │ /careers            │ ❌   │ Page is empty/stub     │
  └─────────────────────┴──────┴────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AUDIT SECTION 3 — API ROUTES CHECK

  For every file in pages/api/, check:
  a) Is it a stub (returns hardcoded data or does nothing)?
  b) Does it have proper error handling (try/catch)?
  c) Does it reference an env variable that might not 
     be set? (grep for process.env inside each file)
  d) Is it actually called by any frontend page, or 
     is it orphaned/unused?

  Report format:
  ┌──────────────────────────────┬────────┬─────────────────┐
  │ API Route                    │ Status │ Issue           │
  ├──────────────────────────────┼────────┼─────────────────┤
  │ /api/newsletter.js           │ ⚠️ Stub│ Does nothing    │
  │ /api/creative/grok-imagine   │ ✅     │ Working         │
  │ /api/support-ticket          │ ❌     │ No error handler│
  └──────────────────────────────┴────────┴─────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AUDIT SECTION 4 — COMPONENTS NEVER MOUNTED

  Find components that are built but never imported 
  anywhere:

  List every file in components/ directory.
  For each component file, check if it is imported 
  in any page or other component.

  Run:
  for f in $(find components -name "*.jsx" -o -name "*.tsx"); do
    name=$(basename $f | sed 's/\..*//')
    count=$(grep -rl "$name" --include="*.jsx" \
      --include="*.tsx" --include="*.js" \
      --exclude-dir=node_modules --exclude-dir=.next \
      . | wc -l)
    echo "$count uses: $f"
  done

  Report any component with 0 or 1 uses 
  (1 use = only its own file, effectively unused).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AUDIT SECTION 5 — ENV VARIABLES HEALTH CHECK

  Find every process.env reference in the codebase:

  grep -rn "process\.env\." \
    --include="*.jsx" --include="*.tsx" \
    --include="*.js" --include="*.ts" \
    --exclude-dir=node_modules --exclude-dir=.next . \
    | grep -oP 'process\.env\.\w+' | sort | uniq

  Then compare this list against what is actually set 
  in .env and .env.local (show variable NAMES only, 
  never values).

  Report any variable referenced in code but missing 
  from env files — these will silently fail in production.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AUDIT SECTION 6 — NAVIGATION & LINKS HEALTH

  Check the following for broken or missing links:

  a) Navbar "More" dropdown — does every item link 
     to a real existing page?
  b) Footer — do all 3 legal links go to real pages?
     (privacy-policy, terms-and-conditions, refund-policy)
  c) Footer column links — do all go to real pages?
  d) Admin sidebar — which links 404?
     (already known: /admin/users, /admin/reviews, 
      /admin/settings — confirm and add any others)
  e) Any <Link href=""> with empty string?
  f) Any Next.js <Link> pointing to an external URL 
     without target="_blank"?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AUDIT SECTION 7 — DESIGN & UI CONSISTENCY CHECK

  Using your frontend design skills, review each 
  customer-facing page and flag:

  a) Pages where footer is MISSING
     (homepage was missing it — is it fixed now?)
  b) Pages where claymorphism was NOT applied yet
     (we applied it to company, about, team, contact,
      support, stories — any others that look plain?)
  c) Pages where font is inconsistent
     (should be Cormorant Garamond for headings, 
      Inter for body everywhere)
  d) Pages where brand colors are wrong
     (crimson #8B1A1A, gold #C9A84C, cream #FAF6F0)
  e) Mobile responsiveness — any page that breaks 
     below 375px width?
  f) Any page missing a proper <title> tag or 
     meta description?
  g) Any <title> tag using JSX array instead of 
     template literal? (previously fixed in legal pages
     — check all remaining pages)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AUDIT SECTION 8 — SANITY CMS CONNECTIONS

  Check which pages fetch from Sanity and which 
  should but don't:

  a) grep for sanityClient or createClient across 
     all page files
  b) Are blog posts pulling from Sanity or hardcoded?
  c) Are products pulling from Sanity or a local file?
  d) Is the hero banner content (slides, quotes, stat 
     cards) coming from Sanity or hardcoded?
  e) Are team member cards hardcoded or from Sanity?
  f) Any Sanity query that has no error handling 
     (no try/catch, no fallback if data is null)?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AUDIT SECTION 9 — BUILD & PERFORMANCE

  Run: npm run build
  
  Report:
  a) Any build errors (paste exact error)
  b) Any build warnings (paste exact warning)
  c) Any pages flagged as very large bundle size
  d) Any images not using Next.js <Image> component
     (these won't be optimized):
     grep -rn "<img " --include="*.jsx" \
       --include="*.tsx" \
       --exclude-dir=node_modules --exclude-dir=.next .

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FINAL DELIVERABLE — MASTER REPORT

After completing all sections above, give me a single 
prioritized list in this format:

🔴 CRITICAL (broken in production, user-facing):
  1. [issue] — [file] — [what's needed]
  2. ...

🟡 INCOMPLETE (built but not finished/wired):
  1. [issue] — [file] — [what's needed]
  2. ...

🟢 MISSING FEATURES (not built yet):
  1. [feature] — [where it should go]
  2. ...

⚪ NICE TO HAVE (design/polish improvements):
  1. [improvement] — [page/component]
  2. ...

Do NOT fix anything during this audit.
Do NOT skip any section.
Show me the full report — I will then tell you 
what to fix first.