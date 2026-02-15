# MCP Quick Start for Sampada

## What You Need to Know

**MCP (Model Context Protocol)** = Tools that give AI superpowers 🚀

Think of MCP servers as plugins that let me:
- Access your database directly
- Process payments via Stripe
- Deploy to Vercel
- Test your site automatically
- Manage content in Sanity
- And much more!

---

## Current Status

### ✅ Already Enabled (from Powers)
- Figma (design integration)
- Terraform (infrastructure)
- Fetch (web scraping)
- AWS Knowledge (AWS docs)
- DynamoDB (database)

### ⚠️ Disabled But Available
- Stripe (payment processing) - **ENABLE THIS!**
- Playwright (browser testing) - **ENABLE THIS!**

### 🆕 Recommended to Add
- PostgreSQL (your Sampada database)
- Google Cloud Storage (product images)
- Sanity CMS (content management)
- GitHub (code management)
- Vercel (deployment)

---

## Quick Actions

### 1. Enable Stripe (5 minutes)

**Why**: Process payments, manage subscriptions

**How**:
1. Open: `C:\Users\Binod\.kiro\settings\mcp.json`
2. Find the Stripe section under `powers.mcpServers`
3. Change `"disabled": true` to `"disabled": false`
4. Restart Kiro

**Test it**:
```
"Show me recent Stripe transactions"
"List all Designer Pro subscribers"
```

### 2. Enable Playwright (5 minutes)

**Why**: Automated testing for checkout, product pages

**How**:
1. Open: `C:\Users\Binod\.kiro\settings\mcp.json`
2. Find the Playwright section
3. Change `"disabled": true` to `"disabled": false`
4. Restart Kiro

**Test it**:
```
"Test the checkout flow"
"Take a screenshot of the homepage"
```

### 3. Add PostgreSQL (10 minutes)

**Why**: Direct access to your Sampada database

**How**:
1. Install uv (if not installed):
   ```bash
   powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
   ```

2. Add to `mcp.json` under `mcpServers`:
   ```json
   "postgres": {
     "command": "uvx",
     "args": ["mcp-server-postgres"],
     "env": {
       "POSTGRES_CONNECTION_STRING": "postgresql://sampada-user:sampadabinod@34.28.88.114:5432/sampada"
     },
     "disabled": false
   }
   ```

3. Restart Kiro

**Test it**:
```
"Show me all products in the database"
"How many orders were placed today?"
"List users who signed up this week"
```

---

## Top 5 MCP Servers for Sampada

### 1. 🔥 PostgreSQL (Essential)
**What**: Direct database access
**Use**: Query products, orders, users, analytics
**Priority**: HIGH

### 2. 💳 Stripe (Essential)
**What**: Payment processing
**Use**: Manage payments, subscriptions, refunds
**Priority**: HIGH

### 3. 🎨 Sanity CMS (Highly Recommended)
**What**: Content management
**Use**: Create/update products, blog posts
**Priority**: MEDIUM

### 4. 🧪 Playwright (Highly Recommended)
**What**: Browser automation
**Use**: E2E testing, screenshots, QA
**Priority**: MEDIUM

### 5. 🚀 Vercel (Recommended)
**What**: Deployment management
**Use**: Deploy, view logs, manage env vars
**Priority**: MEDIUM

---

## Example Workflows

### Managing Products
```
With PostgreSQL + Sanity:
"Show me products with low inventory"
"Update the description for product SKU-123"
"Create a new product category"
```

### Processing Orders
```
With PostgreSQL + Stripe:
"Show orders pending payment"
"Process refund for order #12345"
"List failed transactions today"
```

### Testing & QA
```
With Playwright:
"Test the checkout flow on mobile"
"Take screenshots of all product pages"
"Verify the search functionality works"
```

### Deployment
```
With Vercel + GitHub:
"Deploy the latest changes to production"
"Show me the deployment logs"
"Rollback to the previous version"
```

### Analytics
```
With PostgreSQL:
"What are the top 10 selling products?"
"Show revenue by month for 2026"
"Which products have the most views?"
```

---

## Installation Checklist

### Phase 1: Essentials (Do This First)
- [ ] Install uv: `powershell -c "irm https://astral.sh/uv/install.ps1 | iex"`
- [ ] Enable Stripe in mcp.json
- [ ] Enable Playwright in mcp.json
- [ ] Add PostgreSQL to mcp.json
- [ ] Restart Kiro
- [ ] Test each server

### Phase 2: Core Features (Next)
- [ ] Add Sanity CMS
- [ ] Add Google Cloud Storage
- [ ] Add GitHub integration
- [ ] Add Vercel deployment
- [ ] Test workflows

### Phase 3: Enhancements (Later)
- [ ] Add Google Analytics
- [ ] Add Slack notifications
- [ ] Add SendGrid emails
- [ ] Add Sentry error tracking

---

## Common Commands

### Database Queries
```
"Show me all products"
"Count total orders"
"List users registered today"
"Find products with price > $50"
"Show order details for #12345"
```

### Payment Operations
```
"List Stripe customers"
"Show subscription status for user@email.com"
"Process refund for $50"
"View payment methods for customer"
```

### Testing
```
"Test the homepage loads correctly"
"Check if checkout flow works"
"Take screenshot of product page"
"Test mobile responsiveness"
```

### Deployment
```
"Deploy to production"
"Show deployment status"
"View recent logs"
"List environment variables"
```

---

## Troubleshooting

### "MCP server not found"
**Solution**: Install uv first
```bash
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### "Connection failed"
**Solution**: Check your API keys and connection strings in mcp.json

### "Server disabled"
**Solution**: Change `"disabled": true` to `"disabled": false` in mcp.json

### "Command not found"
**Solution**: Make sure Node.js and npm are installed

---

## Security Tips

1. ✅ Use test API keys in development
2. ✅ Never commit mcp.json with real keys to git
3. ✅ Use environment variables for sensitive data
4. ✅ Enable autoApprove only for safe operations
5. ✅ Rotate API keys regularly

---

## Getting Help

1. **Check MCP Server View** in Kiro
2. **View logs** for error messages
3. **Test connection** with simple commands
4. **Restart Kiro** after config changes
5. **Check documentation** for each server

---

## Next Steps

1. ✅ Enable Stripe (5 min)
2. ✅ Enable Playwright (5 min)
3. ✅ Add PostgreSQL (10 min)
4. ✅ Test with simple commands
5. ✅ Add more servers as needed

---

**Quick Reference**: See `MCP_SERVERS_FOR_SAMPADA.md` for complete details

**Last Updated**: February 15, 2026
