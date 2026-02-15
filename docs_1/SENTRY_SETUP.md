# Sentry Integration Guide

*Om Namah Sivaya* 🙏

**Created:** Jan 20, 2026 | 9:35 PM IST  
**Status:** ✅ **INTEGRATED (Dry Run)**

---

## 🎯 Overview

Sentry has been integrated into the Next.js application to provide:
- **Error Tracking:** Capture exceptions in Client, Server, and Edge functions.
- **Performance Monitoring:** Track transaction duration and bottlenecks.
- **Replay:** Record session replays for debugging (Client-side).

## ⚙️ Configuration Files

1. **`instrumentation.ts`**
   - Central registration point for Next.js 13+ (App Router).
   - Imports server and edge configs based on runtime.

2. **`sentry.client.config.ts`**
   - Configures Sentry for the browser.
   - Enables Replay (10% sampling) and Tracing (10% sampling).

3. **`sentry.server.config.ts`**
   - Configures Sentry for Node.js server environment.

4. **`sentry.edge.config.ts`**
   - Configures Sentry for Edge Middleware.

5. **`next.config.js`**
   - Updated with `withSentryConfig`.
   - **Important:** Configured with `dryRun: !process.env.SENTRY_AUTH_TOKEN`.
   - This prevents build failures if the Sentry Auth Token is missing during deployment.

## 🚀 How to Enable Full Sentry Uploads

Right now, the build is set to **skip source map uploads** (`dryRun: true`) because the `SENTRY_AUTH_TOKEN` is likely missing in your Cloud Run/Build environment.

To enable full functionality (readable stack traces in Sentry Dashboard):

### 1. Get Your Sentry Auth Token
- Go to Sentry > Settings > Account > API > Auth Tokens.
- Create a new token with `project:releases` scope.

### 2. Add to Cloud Run Environment
You need to add this token as a Build environment variable, or easier, just add it to your `next.config.js` environment (though usually it's needed at *build* time, not runtime).

**Correct way for Cloud Run via Source Deploy:**
When you deploy via source (`gcloud run deploy --source .`), the build happens in Cloud Build. You need to pass the arg.

```bash
gcloud run deploy sampada --source . --set-env-vars SENTRY_AUTH_TOKEN=your_token_here
```
*Note: This sets it for runtime, but standard Cloud Build with `npm run build` might pick it up if configured correctly, or you might need a `cloudbuild.yaml` for advanced secret handling.*

**Simpler Approach:**
Just define it in your `.env.local` or `.env.production` if you are building locally.

---

## 🔍 Verification

Once deployed, you can verify Sentry is active by checking the browser console/network tab for requests to `sentry.io` (or your tunnel route).

*Har Har Mahadev!* 🕉️
