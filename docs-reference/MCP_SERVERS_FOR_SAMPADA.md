# MCP Servers for Sampada E-Commerce

## What is MCP?

**Model Context Protocol (MCP)** is a standard protocol that allows AI assistants to connect to external tools and services. MCP servers provide specialized capabilities like:
- Database access
- API integrations
- File system operations
- Web scraping
- Cloud service management
- And much more!

## Current MCP Configuration

Your current setup (from Powers) includes:
- ✅ Figma (design integration)
- ✅ Terraform (infrastructure)
- ✅ Fetch (web scraping)
- ✅ AWS Knowledge (AWS documentation)
- ✅ DynamoDB (database)
- ⚠️ Stripe (disabled - payment processing)
- ⚠️ Playwright (disabled - browser automation)

---

## Recommended MCP Servers for Sampada

### 🔥 Essential (Must Have)

#### 1. **Database - PostgreSQL MCP Server**
**Why**: Direct database access for Sampada's PostgreSQL database
```json
{
  "postgres": {
    "command": "uvx",
    "args": ["mcp-server-postgres"],
    "env": {
      "POSTGRES_CONNECTION_STRING": "postgresql://sampada-user:sampadabinod@34.28.88.114:5432/sampada"
    },
    "disabled": false
  }
}
```

**Capabilities**:
- Query products, orders, users
- Update inventory
- Analyze sales data
- Database migrations
- Performance optimization

#### 2. **Stripe Payment Processing** (Currently Disabled)
**Why**: Essential for e-commerce payment handling
```json
{
  "stripe": {
    "url": "https://mcp.stripe.com",
    "env": {
      "STRIPE_SECRET_KEY": "sk_test_51RHrYGQsiLOyjINS5ANdvPTlGiB6LHXhOZqE45yb1wpKVOJVLMZvhsMzv24JReBQO4TdXITEXxXBagehGcpDc9Dy003KfDZ7iy"
    },
    "disabled": false
  }
}
```

**Capabilities**:
- Process payments
- Manage subscriptions (Designer Pro/Ultra)
- Handle refunds
- View transaction history
- Manage customers

#### 3. **Google Cloud Storage**
**Why**: Manage product images and design files
```json
{
  "google-cloud-storage": {
    "command": "uvx",
    "args": ["mcp-server-gcs"],
    "env": {
      "GCS_BUCKET_NAME": "sampada-storage-87848430",
      "GOOGLE_CLOUD_PROJECT_ID": "sampada-store-2026"
    },
    "disabled": false
  }
}
```

**Capabilities**:
- Upload product images
- Manage design files
- Optimize images
- Generate thumbnails
- CDN management

#### 4. **Playwright Browser Automation** (Currently Disabled)
**Why**: E2E testing for checkout flow, product pages
```json
{
  "playwright": {
    "command": "npx",
    "args": ["-y", "@executeautomation/playwright-mcp-server"],
    "disabled": false
  }
}
```

**Capabilities**:
- Test checkout flow
- Verify payment processing
- Test product search
- Mobile responsiveness testing
- Screenshot generation

---

### 🎯 Highly Recommended

#### 5. **Sanity CMS**
**Why**: Manage Sampada's content (products, blog posts)
```json
{
  "sanity": {
    "command": "npx",
    "args": ["-y", "@sanity/mcp-server"],
    "env": {
      "SANITY_PROJECT_ID": "7lh35oho",
      "SANITY_DATASET": "production",
      "SANITY_API_TOKEN": "your-token-here"
    },
    "disabled": false
  }
}
```

**Capabilities**:
- Create/update products
- Manage blog content
- Update product descriptions
- Bulk operations
- Content migration

#### 6. **GitHub Integration**
**Why**: Code management, CI/CD, issue tracking
```json
{
  "github": {
    "command": "uvx",
    "args": ["mcp-server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token-here"
    },
    "disabled": false
  }
}
```

**Capabilities**:
- Create/manage issues
- Review pull requests
- Trigger deployments
- View commit history
- Manage releases

#### 7. **Vercel Deployment**
**Why**: Deploy and manage Sampada on Vercel
```json
{
  "vercel": {
    "command": "npx",
    "args": ["-y", "vercel-mcp-server"],
    "env": {
      "VERCEL_TOKEN": "your-token-here"
    },
    "disabled": false
  }
}
```

**Capabilities**:
- Deploy to production
- View deployment logs
- Manage environment variables
- Domain configuration
- Analytics access

#### 8. **Google Analytics**
**Why**: Track user behavior, sales analytics
```json
{
  "google-analytics": {
    "command": "uvx",
    "args": ["mcp-server-google-analytics"],
    "env": {
      "GA_PROPERTY_ID": "your-property-id",
      "GOOGLE_APPLICATION_CREDENTIALS": "./ga-credentials.json"
    },
    "disabled": false
  }
}
```

**Capabilities**:
- View traffic data
- Analyze conversion rates
- Track product views
- User demographics
- Sales funnel analysis

---

### 💡 Nice to Have

#### 9. **Slack Notifications**
**Why**: Get alerts for orders, errors, deployments
```json
{
  "slack": {
    "command": "uvx",
    "args": ["mcp-server-slack"],
    "env": {
      "SLACK_BOT_TOKEN": "xoxb-your-token",
      "SLACK_TEAM_ID": "your-team-id"
    },
    "disabled": false
  }
}
```

**Capabilities**:
- Send order notifications
- Alert on errors
- Deployment notifications
- Customer support integration

#### 10. **SendGrid Email**
**Why**: Transactional emails (order confirmations, shipping)
```json
{
  "sendgrid": {
    "command": "uvx",
    "args": ["mcp-server-sendgrid"],
    "env": {
      "SENDGRID_API_KEY": "your-api-key"
    },
    "disabled": false
  }
}
```

**Capabilities**:
- Send order confirmations
- Shipping notifications
- Marketing emails
- Password resets
- Newsletter management

#### 11. **Printify Integration**
**Why**: Manage print-on-demand products
```json
{
  "printify": {
    "command": "npx",
    "args": ["-y", "printify-mcp-server"],
    "env": {
      "PRINTIFY_API_KEY": "your-api-key",
      "PRINTIFY_SHOP_ID": "25358004"
    },
    "disabled": false
  }
}
```

**Capabilities**:
- Sync products
- Manage orders
- Update inventory
- Track shipments
- Product variants

#### 12. **Redis Cache**
**Why**: Session management, caching
```json
{
  "redis": {
    "command": "uvx",
    "args": ["mcp-server-redis"],
    "env": {
      "REDIS_URL": "redis://localhost:6379"
    },
    "disabled": false
  }
}
```

**Capabilities**:
- Cache product data
- Session storage
- Rate limiting
- Real-time features
- Performance optimization

#### 13. **Sentry Error Tracking**
**Why**: Monitor and debug production errors
```json
{
  "sentry": {
    "command": "npx",
    "args": ["-y", "sentry-mcp-server"],
    "env": {
      "SENTRY_DSN": "your-dsn",
      "SENTRY_AUTH_TOKEN": "your-token"
    },
    "disabled": false
  }
}
```

**Capabilities**:
- View error reports
- Track performance issues
- User impact analysis
- Release tracking
- Alert management

#### 14. **Google Gemini AI**
**Why**: AI-powered features (recommendations, search)
```json
{
  "gemini": {
    "command": "uvx",
    "args": ["mcp-server-gemini"],
    "env": {
      "GOOGLE_AI_API_KEY": "AIzaSyCks2X17Qiqc8tgfQA6Nbtk1fKocsEMYiXg"
    },
    "disabled": false
  }
}
```

**Capabilities**:
- Product recommendations
- Visual search (already implemented!)
- Content generation
- Customer support chatbot
- Image analysis

---

## Complete Recommended Configuration

Here's the complete `mcp.json` configuration for Sampada:

```json
{
  "mcpServers": {
    "postgres": {
      "command": "uvx",
      "args": ["mcp-server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://sampada-user:sampadabinod@34.28.88.114:5432/sampada"
      },
      "disabled": false,
      "autoApprove": ["query", "list_tables", "describe_table"]
    },
    "stripe": {
      "url": "https://mcp.stripe.com",
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_51RHrYGQsiLOyjINS5ANdvPTlGiB6LHXhOZqE45yb1wpKVOJVLMZvhsMzv24JReBQO4TdXITEXxXBagehGcpDc9Dy003KfDZ7iy"
      },
      "disabled": false,
      "autoApprove": ["list_customers", "retrieve_customer"]
    },
    "google-cloud-storage": {
      "command": "uvx",
      "args": ["mcp-server-gcs"],
      "env": {
        "GCS_BUCKET_NAME": "sampada-storage-87848430",
        "GOOGLE_CLOUD_PROJECT_ID": "sampada-store-2026"
      },
      "disabled": false,
      "autoApprove": ["list_objects", "get_object"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"],
      "disabled": false
    },
    "sanity": {
      "command": "npx",
      "args": ["-y", "@sanity/mcp-server"],
      "env": {
        "SANITY_PROJECT_ID": "7lh35oho",
        "SANITY_DATASET": "production"
      },
      "disabled": false,
      "autoApprove": ["list_documents", "get_document"]
    },
    "github": {
      "command": "uvx",
      "args": ["mcp-server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token-here"
      },
      "disabled": false,
      "autoApprove": ["list_issues", "get_issue"]
    },
    "vercel": {
      "command": "npx",
      "args": ["-y", "vercel-mcp-server"],
      "env": {
        "VERCEL_TOKEN": "your-token-here"
      },
      "disabled": false
    },
    "slack": {
      "command": "uvx",
      "args": ["mcp-server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-token",
        "SLACK_TEAM_ID": "your-team-id"
      },
      "disabled": false
    },
    "gemini": {
      "command": "uvx",
      "args": ["mcp-server-gemini"],
      "env": {
        "GOOGLE_AI_API_KEY": "AIzaSyCks2X17Qiqc8tgfQA6Nbtk1fKocsEMYiXg"
      },
      "disabled": false
    }
  },
  "powers": {
    "mcpServers": {
      "power-figma-figma": {
        "url": "https://mcp.figma.com/mcp",
        "disabled": false
      },
      "power-terraform-terraform": {
        "command": "docker",
        "args": ["run", "-i", "--rm", "hashicorp/terraform-mcp-server"],
        "disabled": false
      },
      "power-saas-builder-fetch": {
        "command": "uvx",
        "args": ["mcp-server-fetch"],
        "disabled": false
      },
      "power-saas-builder-aws-knowledge-mcp-server": {
        "url": "https://knowledge-mcp.global.api.aws",
        "disabled": false
      },
      "power-saas-builder-awslabs.dynamodb-mcp-server": {
        "command": "uvx",
        "args": ["awslabs.dynamodb-mcp-server@latest"],
        "env": {
          "FASTMCP_LOG_LEVEL": "ERROR"
        },
        "disabled": false
      }
    }
  }
}
```

---

## Installation Guide

### Prerequisites

1. **Install uv (Python package manager)**:
```bash
# Windows (PowerShell)
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Or via pip
pip install uv
```

2. **Install Node.js** (for npx commands)
Already installed ✓

### Installing MCP Servers

```bash
# Test if uvx works
uvx --version

# Install a server (example: PostgreSQL)
uvx mcp-server-postgres

# Test with npx (example: Playwright)
npx -y @executeautomation/playwright-mcp-server
```

---

## Priority Implementation Plan

### Phase 1: Essential (Week 1)
1. ✅ Enable Stripe (payment processing)
2. ✅ Enable Playwright (testing)
3. ✅ Add PostgreSQL (database access)
4. ✅ Add Google Cloud Storage (image management)

### Phase 2: Core Features (Week 2)
5. ✅ Add Sanity CMS (content management)
6. ✅ Add GitHub (code management)
7. ✅ Add Vercel (deployment)

### Phase 3: Analytics & Monitoring (Week 3)
8. ✅ Add Google Analytics (user tracking)
9. ✅ Add Sentry (error tracking)
10. ✅ Add Slack (notifications)

### Phase 4: Enhancements (Week 4)
11. ✅ Add SendGrid (emails)
12. ✅ Add Printify (POD integration)
13. ✅ Add Redis (caching)
14. ✅ Add Gemini (AI features)

---

## Use Cases for Sampada

### 1. Database Operations
```
"Show me all orders from the last 7 days"
"Update product inventory for SKU-12345"
"Find users who haven't completed checkout"
```

### 2. Payment Processing
```
"Process a refund for order #12345"
"Show subscription status for user@email.com"
"List failed payment attempts today"
```

### 3. Content Management
```
"Create a new product in Sanity"
"Update product description for item XYZ"
"Publish the new blog post"
```

### 4. Testing & QA
```
"Run E2E test for checkout flow"
"Test mobile responsiveness of product page"
"Generate screenshots of all pages"
```

### 5. Deployment
```
"Deploy to production"
"Show recent deployment logs"
"Rollback to previous version"
```

### 6. Analytics
```
"Show conversion rate for last month"
"Which products have the highest views?"
"Analyze cart abandonment rate"
```

### 7. Customer Support
```
"Send order confirmation email to customer"
"Notify team about critical error"
"Create support ticket for issue"
```

---

## Security Best Practices

1. **Never commit API keys** - Use environment variables
2. **Use read-only tokens** when possible
3. **Enable autoApprove** only for safe operations
4. **Rotate keys regularly**
5. **Use test keys** in development
6. **Monitor MCP server logs**

---

## Troubleshooting

### MCP Server Won't Start

```bash
# Check if uvx is installed
uvx --version

# Try installing the server manually
uvx mcp-server-postgres

# Check logs
# Look in Kiro's MCP Server view
```

### Connection Errors

1. Check environment variables are set correctly
2. Verify API keys are valid
3. Check network connectivity
4. Review server logs in Kiro

### Performance Issues

1. Disable unused servers
2. Use autoApprove for frequent operations
3. Cache responses when possible
4. Monitor server resource usage

---

## Resources

- **MCP Documentation**: https://modelcontextprotocol.io/
- **MCP Server Registry**: https://github.com/modelcontextprotocol/servers
- **Kiro MCP Guide**: Check command palette → "MCP"
- **Community Servers**: https://github.com/topics/mcp-server

---

## Next Steps

1. **Review current configuration** - Check what's already enabled
2. **Enable Stripe** - Critical for payment processing
3. **Enable Playwright** - Essential for testing
4. **Add PostgreSQL** - Direct database access
5. **Test each server** - Verify functionality
6. **Document workflows** - How to use each server

---

**Last Updated**: February 15, 2026
**Status**: Recommended Configuration
**Priority**: Essential servers first, then expand based on needs
