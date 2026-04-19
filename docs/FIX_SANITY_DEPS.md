# Fix Sanity Dependency Conflict

## Problem
```
npm error ERESOLVE unable to resolve dependency tree
npm error peer sanity @"^3 || ^4.0.0-0" from @sanity/code-input@5.2.0
```

**Root Cause:** `next-sanity@9.10.2` requires `sanity@^3.99.0` but you have `sanity@5.17.1`

## Solution Applied

Updated `package.json` with compatible versions:
- `sanity`: `^5.17.1` → `^5.20.0`
- `@sanity/vision`: `^5.17.1` → `^5.20.0`
- Added `sanity: "^5.20.0"` to `overrides` to force resolution

## How to Apply the Fix

### Step 1: Stop the Dev Server
Press `Ctrl+C` in the terminal running the dev server.

### Step 2: Clean Install
Run these commands in order:

```powershell
# Delete lock file and node_modules
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# Clean npm cache
npm cache clean --force

# Install with legacy peer deps (recommended for this project)
npm install --legacy-peer-deps

# OR use overrides (already configured in package.json)
npm install
```

### Step 3: Verify Fix
```powershell
# Check for dependency warnings
npm ls sanity @sanity/code-input next-sanity

# Should show no "invalid" warnings
```

### Step 4: Test Build
```powershell
# Start dev server
npm run dev

# Check for warnings in console
# Should start without dependency warnings
```

### Step 5: Run Audit
```powershell
npm audit fix --legacy-peer-deps
```

## Alternative: Use Yarn or pnpm

If npm continues to fail:

```powershell
# Install pnpm
npm install -g pnpm

# Install with pnpm (handles peer deps better)
pnpm install
```

## What Changed

| Package | Before | After |
|---------|--------|-------|
| sanity | ^5.17.1 | ^5.20.0 |
| @sanity/vision | ^5.17.1 | ^5.20.0 |
| next-sanity | ^9.10.2 | ^9.10.2 (unchanged) |
| @sanity/code-input | ^7.0.12 | ^7.0.12 (unchanged) |

## Why This Works

1. **sanity ^5.20.0** satisfies `next-sanity`'s peer requirement of `^3.99.0` (which means >=3.99.0)
2. **overrides** force npm to resolve all sanity requests to ^5.20.0
3. **@sanity/code-input@7.0.12** requires `sanity: ^5` which is satisfied by ^5.20.0

## If Issues Persist

Try installing with exact versions:

```powershell
npm install sanity@5.20.0 @sanity/vision@5.20.0 @sanity/code-input@7.0.12 next-sanity@9.10.2 --legacy-peer-deps
```

## Expected Result

After fix, `npm ls sanity` should show:
```
abscommerce@0.1.0
+-- @sanity/code-input@7.0.12
| `-- sanity@5.20.0 deduped
+-- @sanity/vision@5.20.0
| `-- sanity@5.20.0 deduped
+-- next-sanity@9.10.2
| `-- sanity@5.20.0 deduped
`-- sanity@5.20.0
```

No "invalid" warnings should appear.
