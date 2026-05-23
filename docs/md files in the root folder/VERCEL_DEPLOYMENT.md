# Sampada-Store Deployment Instructions

## Vercel Environment Variables Setup

For production deployment on Vercel, add the following environment variables in the Vercel dashboard under Settings > Environment Variables:

### Required Variables:
- `NEXTAUTH_URL=https://sampada-store-sfy2.vercel.app`
- `NEXTAUTH_SECRET=[Generate a random 32-character secret using a tool like: openssl rand -base64 32]`
- `NEXT_PUBLIC_BASE_URL=https://sampada-store-sfy2.vercel.app`

### Existing Variables (should remain the same):
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN`
- `SANITY_API_WRITE_TOKEN`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `PRINTIFY_API_KEY`
- `PRINTIFY_SHOP_ID`
- `PERPLEXITY_API_KEY`
- `GITHUB_ID`
- `GITHUB_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## OAuth Provider Configuration

Make sure your OAuth providers have the correct redirect URIs:

### Google OAuth:
- Authorized Redirect URIs: `https://sampada-store-sfy2.vercel.app/api/auth/callback/google`

### GitHub OAuth:
- Authorization Callback URL: `https://sampada-store-sfy2.vercel.app/api/auth/callback/github`

## Deployment Steps

1. Add all environment variables to Vercel dashboard
2. Trigger a new deployment
3. Test the authentication flow at https://sampada-store-sfy2.vercel.app

## Troubleshooting

If you still encounter 500 errors:
1. Check Vercel function logs for specific error messages
2. Verify all environment variables are correctly set
3. Ensure NEXTAUTH_SECRET is a strong random value
4. Confirm NEXTAUTH_URL matches your production domain exactly