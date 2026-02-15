# GitHub OAuth Login Fix

**Issue**: "Page does not exist" error when trying to login with GitHub  
**Status**: Configuration issue with GitHub OAuth App  
**Date**: February 16, 2026

---

## Problem

When clicking "Sign in with GitHub", users get a "Page does not exist" error, but Google login works fine.

### Root Cause

The GitHub OAuth App is not properly configured or the credentials are incorrect/expired.

---

## Solution

### Step 1: Check Current GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click on "OAuth Apps"
3. Find your Sampada app (or create a new one)

### Step 2: Verify OAuth App Settings

Your GitHub OAuth App should have these settings:

```
Application name: Sampada Store
Homepage URL: http://localhost:3000
Authorization callback URL: http://localhost:3000/api/auth/callback/github
```

**CRITICAL**: The callback URL MUST be exactly:
```
http://localhost:3000/api/auth/callback/github
```

For production, it should be:
```
https://yourdomain.com/api/auth/callback/github
```

### Step 3: Get New Credentials

1. In your GitHub OAuth App settings
2. Copy the **Client ID**
3. Generate a new **Client Secret** (if needed)
4. Update your `.env` file

### Step 4: Update .env File

Replace the current GitHub credentials in `.env`:

```env
# Current (possibly incorrect)
GITHUB_ID=0v231ih7pkkTumkKBncL
GITHUB_SECRET=2911367853c17e123e44611831a1cec914c75a47

# Should look more like this (example format)
GITHUB_ID=Iv1.a1b2c3d4e5f6g7h8
GITHUB_SECRET=1234567890abcdef1234567890abcdef12345678
```

**Note**: Your actual credentials will be different. Get them from GitHub.

---

## Quick Fix Steps

### Option 1: Create New GitHub OAuth App (Recommended)

1. **Go to GitHub**:
   ```
   https://github.com/settings/developers
   ```

2. **Click "New OAuth App"**

3. **Fill in the form**:
   ```
   Application name: Sampada Store Local
   Homepage URL: http://localhost:3000
   Authorization callback URL: http://localhost:3000/api/auth/callback/github
   ```

4. **Click "Register application"**

5. **Copy Client ID**:
   - You'll see it immediately

6. **Generate Client Secret**:
   - Click "Generate a new client secret"
   - Copy it immediately (you won't see it again!)

7. **Update .env**:
   ```env
   GITHUB_ID=<paste Client ID here>
   GITHUB_SECRET=<paste Client Secret here>
   ```

8. **Restart dev server**:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

9. **Test login**:
   - Go to http://localhost:3000
   - Click "Sign in"
   - Click GitHub
   - Should work now!

### Option 2: Fix Existing OAuth App

1. **Go to your existing OAuth App**:
   ```
   https://github.com/settings/developers
   ```

2. **Click on your Sampada app**

3. **Verify callback URL**:
   ```
   Authorization callback URL: http://localhost:3000/api/auth/callback/github
   ```

4. **If wrong, update it and save**

5. **Generate new Client Secret**:
   - Click "Generate a new client secret"
   - Copy it

6. **Update .env with new secret**

7. **Restart dev server**

---

## Verification Checklist

After updating credentials:

- [ ] GitHub OAuth App exists
- [ ] Callback URL is correct: `http://localhost:3000/api/auth/callback/github`
- [ ] Client ID copied to .env
- [ ] Client Secret copied to .env
- [ ] Dev server restarted
- [ ] Tested GitHub login
- [ ] No "Page does not exist" error

---

## Common Issues

### Issue 1: "Page does not exist"
**Cause**: Callback URL is wrong  
**Fix**: Update callback URL in GitHub OAuth App settings

### Issue 2: "Invalid client_id"
**Cause**: GITHUB_ID is wrong or expired  
**Fix**: Copy correct Client ID from GitHub

### Issue 3: "Invalid client_secret"
**Cause**: GITHUB_SECRET is wrong or expired  
**Fix**: Generate new Client Secret and update .env

### Issue 4: "Redirect URI mismatch"
**Cause**: Callback URL doesn't match  
**Fix**: Ensure callback URL is exactly `http://localhost:3000/api/auth/callback/github`

---

## Testing

### Test GitHub Login

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Open browser**:
   ```
   http://localhost:3000
   ```

3. **Click "Sign in"**

4. **Click GitHub icon**

5. **Should redirect to GitHub**:
   - You'll see GitHub authorization page
   - Click "Authorize"
   - Should redirect back to your app
   - Should be logged in

### Expected Flow

```
Your App → Click "Sign in with GitHub"
  ↓
GitHub Authorization Page
  ↓
Click "Authorize"
  ↓
Redirect to: http://localhost:3000/api/auth/callback/github
  ↓
NextAuth processes callback
  ↓
Redirect to: http://localhost:3000
  ↓
User is logged in ✅
```

---

## Production Setup

For production deployment, you'll need:

1. **Create separate OAuth App** for production:
   ```
   Application name: Sampada Store Production
   Homepage URL: https://yourdomain.com
   Authorization callback URL: https://yourdomain.com/api/auth/callback/github
   ```

2. **Update production environment variables**:
   ```env
   GITHUB_ID=<production Client ID>
   GITHUB_SECRET=<production Client Secret>
   NEXTAUTH_URL=https://yourdomain.com
   ```

3. **Never commit credentials** to git!

---

## Security Best Practices

1. **Never commit .env file** to git
2. **Use different credentials** for dev and production
3. **Rotate secrets regularly**
4. **Use environment variables** in production (Vercel, etc.)
5. **Keep Client Secret secure** - treat it like a password

---

## Debugging

### Enable NextAuth Debug Mode

Already enabled in development:
```typescript
debug: process.env.NODE_ENV === 'development',
```

### Check Console Logs

When testing, check browser console and terminal for errors:

**Browser Console**:
- Look for redirect errors
- Check network tab for failed requests

**Terminal**:
- NextAuth will log authentication flow
- Look for "Error creating Sanity user" messages

### Test with curl

```bash
# Test if GitHub OAuth endpoint is accessible
curl -I https://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID
```

---

## Alternative: Disable GitHub Login Temporarily

If you need to deploy quickly and GitHub login isn't critical:

### Option 1: Comment out GitHub provider

**File**: `lib/nextAuthOptions.ts`

```typescript
export const authOptions: NextAuthOptions = {
    providers: [
        // GithubProvider({
        //     clientId: process.env.GITHUB_ID || '',
        //     clientSecret: process.env.GITHUB_SECRET || '',
        // }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
    // ... rest of config
};
```

### Option 2: Hide GitHub button in UI

**File**: `components/LoginModal.jsx`

Find the GitHub button and comment it out or add a condition.

---

## Summary

The issue is with GitHub OAuth App configuration. To fix:

1. Create or update GitHub OAuth App
2. Set correct callback URL: `http://localhost:3000/api/auth/callback/github`
3. Copy Client ID and Client Secret
4. Update .env file
5. Restart dev server
6. Test login

**Most common fix**: Wrong callback URL in GitHub OAuth App settings.

---

## Need Help?

If you're still having issues:

1. Check GitHub OAuth App settings
2. Verify callback URL is EXACTLY correct
3. Generate new Client Secret
4. Clear browser cache
5. Try incognito mode
6. Check terminal logs for errors

---

**Status**: Ready to fix - follow steps above

**Time to fix**: 5-10 minutes

**Difficulty**: Easy (just configuration)
