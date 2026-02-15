# 📊 Monitoring & Logging Setup - Sampada Platform

*Om Namah Sivaya* 🙏

## Overview
Complete monitoring and logging configuration for Sampada on Google Cloud Platform.

---

## 1. Google Cloud Logging

### 1.1 Enable Cloud Logging API
```bash
gcloud services enable logging.googleapis.com
gcloud services enable monitoring.googleapis.com
```

### 1.2 Configure Log Levels

**Update `next.config.js`:**
```javascript
module.exports = {
  // ... existing config
  
  // Custom logging for production
  env: {
    LOG_LEVEL: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
  },
}
```

**Create logging utility (`lib/logger.ts`):**
```typescript
// lib/logger.ts
import { Logging } from '@google-cloud/logging';

const logging = new Logging();
const log = logging.log('sampada-app');

export const logger = {
  info: (message: string, metadata?: any) => {
    const entry = log.entry({ severity: 'INFO' }, { message, ...metadata });
    log.write(entry);
    console.log(`[INFO] ${message}`, metadata);
  },
  
  error: (message: string, error?: Error, metadata?: any) => {
    const entry = log.entry(
      { severity: 'ERROR' },
      { message, error: error?.stack, ...metadata }
    );
    log.write(entry);
    console.error(`[ERROR] ${message}`, error, metadata);
  },
  
  warn: (message: string, metadata?: any) => {
    const entry = log.entry({ severity: 'WARNING' }, { message, ...metadata });
    log.write(entry);
    console.warn(`[WARN] ${message}`, metadata);
  },
  
  debug: (message: string, metadata?: any) => {
    if (process.env.LOG_LEVEL === 'debug') {
      console.log(`[DEBUG] ${message}`, metadata);
    }
  },
};
```

### 1.3 Implement Structured Logging

**Update API routes to use logger:**
```typescript
// Example: app/api/webhooks/sanity/route.ts
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    logger.info('Sanity webhook received', {
      type: payload._type,
      id: payload._id,
      action: payload._action
    });
    
    // ... process webhook
    
    logger.info('Webhook processed successfully', { id: payload._id });
    return NextResponse.json({ success: true });
    
  } catch (error) {
    logger.error('Webhook processing failed', error as Error, {
      url: request.url
    });
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
```

---

## 2. Application Performance Monitoring (APM)

### 2.1 Install Google Cloud Trace
```bash
npm install @google-cloud/trace-agent
```

**Create trace configuration (`lib/trace.ts`):**
```typescript
// lib/trace.ts
if (process.env.NODE_ENV === 'production') {
  require('@google-cloud/trace-agent').start({
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });
}
```

**Import in `app/layout.tsx`:**
```typescript
import '@/lib/trace'; // Must be first import
```

### 2.2 Custom Metrics

**Create metrics utility (`lib/metrics.ts`):**
```typescript
// lib/metrics.ts
import { MetricServiceClient } from '@google-cloud/monitoring';

const client = new MetricServiceClient();
const projectId = process.env.GOOGLE_CLOUD_PROJECT;

export async function recordMetric(
  metricType: string,
  value: number,
  labels: Record<string, string> = {}
) {
  const dataPoint = {
    interval: {
      endTime: {
        seconds: Date.now() / 1000,
      },
    },
    value: {
      doubleValue: value,
    },
  };

  const timeSeriesData = {
    metric: {
      type: `custom.googleapis.com/${metricType}`,
      labels,
    },
    resource: {
      type: 'global',
      labels: {
        project_id: projectId,
      },
    },
    points: [dataPoint],
  };

  const request = {
    name: client.projectPath(projectId!),
    timeSeries: [timeSeriesData],
  };

  try {
    await client.createTimeSeries(request);
  } catch (error) {
    console.error('Failed to record metric:', error);
  }
}

// Usage examples
export const metrics = {
  recordOrderPlaced: (amount: number) =>
    recordMetric('orders/placed', 1, { amount: amount.toString() }),
  
  recordAIGeneration: (service: string, duration: number) =>
    recordMetric('ai/generation_time', duration, { service }),
  
  recordWebhookProcessed: (type: string, success: boolean) =>
    recordMetric('webhooks/processed', 1, { type, success: success.toString() }),
};
```

---

## 3. Error Tracking with Sentry (Optional but Recommended)

### 3.1 Install Sentry
```bash
npm install @sentry/nextjs
```

### 3.2 Configure Sentry
```bash
npx @sentry/wizard@latest -i nextjs
```

**Update `sentry.client.config.ts`:**
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  
  beforeSend(event, hint) {
    // Filter out sensitive data
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers;
    }
    return event;
  },
});
```

---

## 4. Uptime Monitoring

### 4.1 Create Uptime Check
```bash
gcloud monitoring uptime create sampada-uptime \
  --resource-type=uptime-url \
  --host=sampada.shop \
  --path=/ \
  --check-interval=60s \
  --timeout=10s
```

### 4.2 Health Check Endpoint

**Create `/api/health/route.ts`:**
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    checks: {
      database: 'unknown',
      sanity: 'unknown',
    },
  };

  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;
    checks.checks.database = 'healthy';
  } catch (error) {
    checks.checks.database = 'unhealthy';
    checks.status = 'degraded';
  }

  try {
    // Check Sanity
    const response = await fetch(
      `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/ping`
    );
    checks.checks.sanity = response.ok ? 'healthy' : 'unhealthy';
  } catch (error) {
    checks.checks.sanity = 'unhealthy';
    checks.status = 'degraded';
  }

  const statusCode = checks.status === 'healthy' ? 200 : 503;
  return NextResponse.json(checks, { status: statusCode });
}
```

---

## 5. Alert Policies

### 5.1 High Error Rate Alert
```bash
gcloud alpha monitoring policies create \
  --notification-channels=YOUR_CHANNEL_ID \
  --display-name="Sampada - High Error Rate" \
  --condition-display-name="Error rate > 5%" \
  --condition-threshold-value=5 \
  --condition-threshold-duration=300s \
  --condition-threshold-comparison=COMPARISON_GT \
  --condition-threshold-aggregations=metric.type="logging.googleapis.com/user/error_count",resource.type="cloud_run_revision"
```

### 5.2 High Response Time Alert
```bash
gcloud alpha monitoring policies create \
  --notification-channels=YOUR_CHANNEL_ID \
  --display-name="Sampada - Slow Response Time" \
  --condition-display-name="Response time > 2s" \
  --condition-threshold-value=2000 \
  --condition-threshold-duration=300s \
  --condition-threshold-comparison=COMPARISON_GT \
  --condition-threshold-aggregations=metric.type="run.googleapis.com/request_latencies",resource.type="cloud_run_revision"
```

### 5.3 Database Connection Alert
```bash
gcloud alpha monitoring policies create \
  --notification-channels=YOUR_CHANNEL_ID \
  --display-name="Sampada - Database Connection Issues" \
  --condition-display-name="DB connections > 80%" \
  --condition-threshold-value=80 \
  --condition-threshold-duration=300s \
  --condition-threshold-comparison=COMPARISON_GT \
  --condition-threshold-aggregations=metric.type="cloudsql.googleapis.com/database/postgresql/num_backends",resource.type="cloudsql_database"
```

---

## 6. Dashboard Setup

### 6.1 Create Custom Dashboard

**Via Console:**
1. Go to **Monitoring → Dashboards**
2. Click **Create Dashboard**
3. Name: "Sampada Production Metrics"
4. Add charts:

**Chart 1: Request Rate**
```
Metric: run.googleapis.com/request_count
Resource: cloud_run_revision
Filter: service_name="abscommerce"
Aggregation: rate(1m)
```

**Chart 2: Error Rate**
```
Metric: logging.googleapis.com/user/error_count
Resource: cloud_run_revision
Filter: service_name="abscommerce"
Aggregation: rate(1m)
```

**Chart 3: Response Time (p95)**
```
Metric: run.googleapis.com/request_latencies
Resource: cloud_run_revision
Filter: service_name="abscommerce"
Aggregation: 95th percentile
```

**Chart 4: Database Connections**
```
Metric: cloudsql.googleapis.com/database/postgresql/num_backends
Resource: cloudsql_database
Filter: database_id="sampada-db"
```

**Chart 5: AI API Calls**
```
Metric: custom.googleapis.com/ai/generation_time
Resource: global
Aggregation: count
```

### 6.2 Export Dashboard as Code

```bash
# Export dashboard configuration
gcloud monitoring dashboards describe DASHBOARD_ID --format=json > dashboard.json
```

---

## 7. Log Analysis Queries

### 7.1 Common Log Queries

**View all errors (last 24h):**
```
resource.type="cloud_run_revision"
resource.labels.service_name="abscommerce"
severity="ERROR"
timestamp>="2026-01-18T00:00:00Z"
```

**Webhook processing times:**
```
resource.type="cloud_run_revision"
jsonPayload.message="Webhook processed successfully"
```

**Slow database queries:**
```
resource.type="cloud_run_revision"
jsonPayload.message=~"prisma.*"
jsonPayload.duration>1000
```

**AI service usage:**
```
resource.type="cloud_run_revision"
jsonPayload.service=~"ai/.*"
```

### 7.2 Create Log-Based Metrics

```bash
# Metric for webhook processing time
gcloud logging metrics create webhook_processing_time \
  --description="Time to process Sanity webhooks" \
  --value-extractor='EXTRACT(jsonPayload.duration)' \
  --log-filter='resource.type="cloud_run_revision" AND jsonPayload.message="Webhook processed successfully"'
```

---

## 8. Performance Optimization Monitoring

### 8.1 Core Web Vitals Tracking

**Add to `app/layout.tsx`:**
```typescript
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  );
}
```

### 8.2 Custom Performance Marks

```typescript
// lib/performance.ts
export function measurePerformance(name: string, fn: () => Promise<any>) {
  return async (...args: any[]) => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const duration = performance.now() - start;
      
      // Log to Cloud Monitoring
      await recordMetric('performance/duration', duration, { operation: name });
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      await recordMetric('performance/error', duration, { operation: name });
      throw error;
    }
  };
}

// Usage
const getProductWithOrders = measurePerformance(
  'getProductWithOrders',
  async (slug: string) => {
    // ... implementation
  }
);
```

---

## 9. Cost Monitoring

### 9.1 Set Budget Alerts
```bash
gcloud billing budgets create \
  --billing-account=YOUR_BILLING_ACCOUNT \
  --display-name="Sampada Monthly Budget" \
  --budget-amount=100USD \
  --threshold-rule=percent=50 \
  --threshold-rule=percent=90 \
  --threshold-rule=percent=100
```

### 9.2 Track AI API Costs

**Create cost tracking:**
```typescript
// lib/ai-cost-tracker.ts
export async function trackAICost(service: string, tokens: number) {
  const costPerToken = {
    'gemini-pro': 0.00025 / 1000, // $0.00025 per 1K tokens
  };
  
  const cost = tokens * costPerToken['gemini-pro'];
  
  await recordMetric('ai/cost', cost, { service });
  
  // Store in database for monthly reports
  await prisma.aICostLog.create({
    data: {
      service,
      tokens,
      cost,
      timestamp: new Date(),
    },
  });
}
```

---

## 10. Notification Channels

### 10.1 Email Notifications
```bash
gcloud alpha monitoring channels create \
  --display-name="Sampada Alerts Email" \
  --type=email \
  --channel-labels=email_address=alerts@sampada.shop
```

### 10.2 Slack Notifications (Optional)
```bash
gcloud alpha monitoring channels create \
  --display-name="Sampada Alerts Slack" \
  --type=slack \
  --channel-labels=url=YOUR_SLACK_WEBHOOK_URL
```

---

## Quick Reference: Monitoring Commands

```bash
# View recent logs
gcloud run services logs read abscommerce --region=asia-south1 --limit=100

# Tail logs in real-time
gcloud run services logs tail abscommerce --region=asia-south1

# View metrics
gcloud monitoring time-series list \
  --filter='metric.type="run.googleapis.com/request_count"'

# List alert policies
gcloud alpha monitoring policies list

# Test alert
gcloud alpha monitoring policies test POLICY_ID
```

---

**Monitoring & Logging Setup Complete! 📊**

*Har Har Mahadev!* 🕉️
