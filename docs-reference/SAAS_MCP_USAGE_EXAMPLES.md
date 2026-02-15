# SaaS Builder MCP Tools - Usage Examples for Sampada

## Overview

The saas-builder power includes 6 MCP servers that provide tools for building and managing SaaS applications. This guide shows practical examples of using these tools with Sampada.

---

## Available MCP Servers

1. **fetch** - HTTP requests for external API integration
2. **stripe** - Payment processing and subscription management (disabled by default)
3. **aws-knowledge-mcp-server** - AWS documentation and best practices
4. **awslabs.dynamodb-mcp-server** - DynamoDB operations with tenant isolation
5. **awslabs.aws-serverless-mcp** - Serverless application deployment
6. **playwright** - Browser automation for testing (disabled by default)

---

## 1. Stripe MCP Server

### Enable Stripe Tools

Edit `C:\Users\Binod\.kiro\powers\installed\saas-builder\mcp.json`:

```json
{
  "mcpServers": {
    "stripe": {
      "command": "uvx",
      "args": ["mcp-server-stripe"],
      "env": {
        "STRIPE_API_KEY": "sk_test_51RHrYGQsiLOyjINS5ANdvPTlGiB6LHXhOZqE45yb1wpKVOJVLMZvhsMzv24JReBQO4TdXITEXxXBagehGcpDc9Dy003KfDZ7iy"
      },
      "disabled": false  // ✅ Change from true to false
    }
  }
}
```

### Example: List All Subscriptions

```typescript
// Using Kiro Powers API
const result = await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "stripe",
  toolName: "list_subscriptions",
  arguments: {
    limit: 100,
    status: "active"
  }
});

console.log('Active subscriptions:', result.data);
```

### Example: Get Customer Details

```typescript
const customer = await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "stripe",
  toolName: "get_customer",
  arguments: {
    customer_id: "cus_123456789"
  }
});

console.log('Customer:', customer.email, customer.name);
console.log('Subscriptions:', customer.subscriptions);
```

### Example: Create Usage Record

```typescript
// Track AI image generation usage
const usageRecord = await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "stripe",
  toolName: "create_usage_record",
  arguments: {
    subscription_item_id: "si_123456789",
    quantity: 1, // 1 AI generation
    timestamp: Math.floor(Date.now() / 1000),
    action: "increment"
  }
});
```

### Example: Cancel Subscription

```typescript
const canceled = await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "stripe",
  toolName: "cancel_subscription",
  arguments: {
    subscription_id: "sub_123456789",
    cancel_at_period_end: true // Don't cancel immediately
  }
});

console.log('Subscription will cancel at:', canceled.cancel_at);
```

---

## 2. AWS Knowledge MCP Server

### Example: Get Lambda Best Practices

```typescript
const lambdaBestPractices = await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "aws-knowledge-mcp-server",
  toolName: "search_aws_docs",
  arguments: {
    query: "Lambda function best practices for multi-tenant SaaS",
    service: "lambda"
  }
});

console.log('Best practices:', lambdaBestPractices);
```

### Example: DynamoDB Multi-Tenant Patterns

```typescript
const dynamoPatterns = await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "aws-knowledge-mcp-server",
  toolName: "search_aws_docs",
  arguments: {
    query: "DynamoDB tenant isolation patterns composite keys",
    service: "dynamodb"
  }
});
```

### Example: API Gateway Rate Limiting

```typescript
const rateLimiting = await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "aws-knowledge-mcp-server",
  toolName: "search_aws_docs",
  arguments: {
    query: "API Gateway throttling per tenant rate limiting",
    service: "apigateway"
  }
});
```

---

## 3. DynamoDB MCP Server

### Example: Create Table with Tenant Isolation

```typescript
const table = await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "awslabs.dynamodb-mcp-server",
  toolName: "create_table",
  arguments: {
    table_name: "sampada-designs",
    partition_key: "pk", // Format: ${tenantId}#DESIGN#${designId}
    sort_key: "sk", // Format: metadata | #USER#${userId}
    billing_mode: "PAY_PER_REQUEST",
    global_secondary_indexes: [
      {
        index_name: "GSI1",
        partition_key: "GSI1PK", // ${tenantId}
        sort_key: "GSI1SK", // ${entityType}#${timestamp}
      }
    ]
  }
});
```

### Example: Put Item with Tenant Prefix

```typescript
const design = await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "awslabs.dynamodb-mcp-server",
  toolName: "put_item",
  arguments: {
    table_name: "sampada-designs",
    item: {
      pk: `tenant_${tenantId}#DESIGN#${designId}`,
      sk: "metadata",
      GSI1PK: `tenant_${tenantId}`,
      GSI1SK: `DESIGN#${Date.now()}`,
      tenantId: tenantId,
      designId: designId,
      name: "My Custom T-Shirt",
      canvasData: JSON.stringify(fabricCanvas),
      createdAt: new Date().toISOString(),
    }
  }
});
```

### Example: Query All Designs for Tenant

```typescript
const designs = await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "awslabs.dynamodb-mcp-server",
  toolName: "query",
  arguments: {
    table_name: "sampada-designs",
    index_name: "GSI1",
    key_condition_expression: "GSI1PK = :tenantId AND begins_with(GSI1SK, :entityType)",
    expression_attribute_values: {
      ":tenantId": `tenant_${tenantId}`,
      ":entityType": "DESIGN"
    }
  }
});

console.log('Designs:', designs.Items);
```

---

## 4. AWS Serverless MCP Server

### Example: Deploy Lambda Function

```typescript
const deployment = await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "awslabs.aws-serverless-mcp",
  toolName: "deploy_lambda",
  arguments: {
    function_name: "sampada-ai-image-generator",
    runtime: "nodejs20.x",
    handler: "index.handler",
    code_path: "./lambda/ai-image-generator",
    environment_variables: {
      GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,
      GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME,
    },
    timeout: 300, // 5 minutes for AI generation
    memory_size: 1024,
  }
});

console.log('Lambda ARN:', deployment.FunctionArn);
```

### Example: Create API Gateway

```typescript
const api = await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "awslabs.aws-serverless-mcp",
  toolName: "create_api_gateway",
  arguments: {
    api_name: "sampada-designer-api",
    routes: [
      {
        path: "/designs",
        method: "GET",
        lambda_function: "sampada-list-designs",
        authorizer: "sampada-jwt-authorizer"
      },
      {
        path: "/designs",
        method: "POST",
        lambda_function: "sampada-create-design",
        authorizer: "sampada-jwt-authorizer"
      },
      {
        path: "/ai/generate-image",
        method: "POST",
        lambda_function: "sampada-ai-image-generator",
        authorizer: "sampada-jwt-authorizer"
      }
    ]
  }
});

console.log('API URL:', api.ApiEndpoint);
```

### Example: Deploy Lambda Authorizer

```typescript
const authorizer = await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "awslabs.aws-serverless-mcp",
  toolName: "deploy_lambda",
  arguments: {
    function_name: "sampada-jwt-authorizer",
    runtime: "nodejs20.x",
    handler: "authorizer.handler",
    code_path: "./lambda/authorizer",
    environment_variables: {
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    },
  }
});

// Authorizer extracts tenant context from JWT
// Returns: { tenantId, userId, roles, tier }
```

---

## 5. Fetch MCP Server

### Example: Verify Printify Order Status

```typescript
const printifyOrder = await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "fetch",
  toolName: "fetch",
  arguments: {
    url: `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/orders/${orderId}.json`,
    method: "GET",
    headers: {
      "Authorization": `Bearer ${process.env.PRINTIFY_API_KEY}`,
      "Content-Type": "application/json"
    }
  }
});

console.log('Order status:', printifyOrder.status);
```

### Example: Sync Sanity Product Data

```typescript
const sanityProduct = await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "fetch",
  toolName: "fetch",
  arguments: {
    url: `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
    method: "GET",
    headers: {
      "Authorization": `Bearer ${process.env.SANITY_API_TOKEN}`
    },
    params: {
      query: '*[_type == "product" && _id == $id][0]',
      variables: JSON.stringify({ id: productId })
    }
  }
});

// Update ProductCache in PostgreSQL
await db.productCache.upsert({
  where: { sanityId: productId },
  update: {
    name: sanityProduct.name,
    price: sanityProduct.price,
    inStock: sanityProduct.inStock,
  },
  create: {
    sanityId: productId,
    name: sanityProduct.name,
    price: sanityProduct.price,
    inStock: sanityProduct.inStock,
  },
});
```

---

## 6. Playwright MCP Server (Testing)

### Enable Playwright

Edit `C:\Users\Binod\.kiro\powers\installed\saas-builder\mcp.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "uvx",
      "args": ["mcp-server-playwright"],
      "disabled": false  // ✅ Change from true to false
    }
  }
}
```

### Example: Test Subscription Flow

```typescript
const test = await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "playwright",
  toolName: "navigate",
  arguments: {
    url: "http://localhost:3000/subscription"
  }
});

// Click Pro plan button
await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "playwright",
  toolName: "click",
  arguments: {
    selector: "button[data-plan='pro']"
  }
});

// Verify redirected to Stripe checkout
const currentUrl = await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "playwright",
  toolName: "get_url",
  arguments: {}
});

console.log('Redirected to:', currentUrl);
// Should be: https://checkout.stripe.com/...
```

### Example: Test Designer Canvas

```typescript
// Navigate to designer
await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "playwright",
  toolName: "navigate",
  arguments: {
    url: "http://localhost:3000/designer"
  }
});

// Add text to canvas
await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "playwright",
  toolName: "click",
  arguments: {
    selector: "button[data-tool='text']"
  }
});

// Take screenshot
const screenshot = await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "playwright",
  toolName: "screenshot",
  arguments: {
    path: "./test-screenshots/designer-canvas.png"
  }
});
```

---

## Practical Integration Examples

### Example 1: Automated Subscription Monitoring

```typescript
// Check for subscriptions ending soon
const subscriptions = await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "stripe",
  toolName: "list_subscriptions",
  arguments: {
    status: "active",
    limit: 100
  }
});

const endingSoon = subscriptions.data.filter(sub => {
  const daysUntilEnd = (sub.current_period_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24);
  return daysUntilEnd <= 7;
});

// Send reminder emails
for (const sub of endingSoon) {
  console.log(`Subscription ${sub.id} ends in ${daysUntilEnd} days`);
  // Send email via SendGrid
}
```

### Example 2: Usage-Based Billing Calculation

```typescript
// Get all active subscriptions
const subscriptions = await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "stripe",
  toolName: "list_subscriptions",
  arguments: { status: "active" }
});

// Calculate usage for each tenant
for (const sub of subscriptions.data) {
  const tenantId = sub.metadata.tenantId;
  
  // Get usage from database
  const usage = await db.designUsageLog.aggregate({
    where: {
      userId: tenantId,
      action: 'ai_used',
      timestamp: {
        gte: new Date(sub.current_period_start * 1000),
        lte: new Date(sub.current_period_end * 1000),
      }
    },
    _count: true,
  });
  
  // Report usage to Stripe
  if (usage._count > 0) {
    await kiroPowers({
      action: "use",
      powerName: "saas-builder",
      serverName: "stripe",
      toolName: "create_usage_record",
      arguments: {
        subscription_item_id: sub.items.data[0].id,
        quantity: usage._count,
        timestamp: Math.floor(Date.now() / 1000),
      }
    });
  }
}
```

### Example 3: Serverless AI Image Generation

```typescript
// Deploy Lambda function for AI image generation
const lambda = await kiroPowers({
  action: "use",
  powerName: "saas-builder",
  serverName: "awslabs.aws-serverless-mcp",
  toolName: "deploy_lambda",
  arguments: {
    function_name: "sampada-ai-image-gen",
    runtime: "nodejs20.x",
    handler: "index.handler",
    code_path: "./lambda/ai-image-gen",
    environment_variables: {
      GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,
      GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME,
    },
    timeout: 300,
    memory_size: 2048, // More memory for AI processing
  }
});

// Update Next.js API route to call Lambda
// app/api/ai/generate-image/route.ts
export async function POST(req: NextRequest) {
  const tenantId = req.headers.get('x-tenant-id');
  const { prompt } = await req.json();
  
  // Call Lambda function
  const result = await fetch(lambda.FunctionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-tenant-id': tenantId,
    },
    body: JSON.stringify({ prompt }),
  });
  
  return NextResponse.json(await result.json());
}
```

---

## Configuration Tips

### 1. Enable All Useful Servers

```json
{
  "mcpServers": {
    "fetch": { "disabled": false },
    "stripe": { "disabled": false },  // ✅ Enable for billing
    "aws-knowledge-mcp-server": { "disabled": false },
    "awslabs.dynamodb-mcp-server": { "disabled": false },
    "awslabs.aws-serverless-mcp": { "disabled": false },
    "playwright": { "disabled": false }  // ✅ Enable for testing
  }
}
```

### 2. Set Environment Variables

Make sure these are set in your environment:
- `STRIPE_API_KEY` - For Stripe MCP server
- `AWS_PROFILE` or `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` - For AWS servers
- `AWS_REGION` - Default region for AWS operations

### 3. Auto-Approve Trusted Tools

```json
{
  "mcpServers": {
    "stripe": {
      "autoApprove": [
        "list_subscriptions",
        "get_customer",
        "create_usage_record"
      ]
    }
  }
}
```

---

## Next Steps

1. **Enable Stripe MCP** - Start monitoring subscriptions
2. **Test with Playwright** - Automate subscription flow testing
3. **Explore AWS Knowledge** - Learn serverless patterns
4. **Plan DynamoDB migration** - For scale (when needed)
5. **Deploy Lambda functions** - Move AI operations to serverless

---

## Resources

- SaaS Builder Power: `C:\Users\Binod\.kiro\powers\installed\saas-builder\`
- MCP Configuration: `C:\Users\Binod\.kiro\powers\installed\saas-builder\mcp.json`
- Global MCP Settings: `C:\Users\Binod\.kiro\settings\mcp.json`
- Kiro Powers API: Use `kiroPowers()` function in your code
