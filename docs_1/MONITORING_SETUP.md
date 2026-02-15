# Google Cloud Monitoring Setup Guide

*Om Namah Sivaya* 🙏

**Created:** Jan 20, 2026 | 8:55 PM IST  
**Purpose:** Configure monitoring and alerting for Sampada production deployment

---

## 🎯 Overview

This guide sets up comprehensive monitoring for your Cloud Run application using:
- Google Cloud Monitoring (formerly Stackdriver)
- Custom health checks
- Error tracking
- Performance monitoring
- Automated alerts

---

## 📊 1. Health Check Endpoint

### **Endpoint Created:**
`https://sampada-315704971004.us-central1.run.app/api/health`

### **What It Checks:**
- ✅ Database connectivity
- ✅ Memory usage
- ✅ System uptime
- ✅ Environment info

### **Response Format:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-20T15:25:00.000Z",
  "uptime": 3600,
  "checks": {
    "database": {
      "status": "healthy",
      "message": "Database connection successful",
      "responseTime": 45
    },
    "memory": {
      "used": 128,
      "total": 512,
      "percentage": 25
    }
  }
}
```

---

## 🔔 2. Configure Cloud Run Health Checks

### **Via Google Cloud Console:**

1. **Go to Cloud Run:** https://console.cloud.google.com/run
2. **Select your service:** `sampada`
3. **Click "EDIT & DEPLOY NEW REVISION"**
4. **Scroll to "Container" section**
5. **Expand "Container, Networking, Security"**
6. **Under "Health checks":**
   - **Health check path:** `/api/health`
   - **Initial delay:** `10` seconds
   - **Timeout:** `5` seconds
   - **Period:** `10` seconds
   - **Failure threshold:** `3`
   - **Success threshold:** `1`

7. **Click "DEPLOY"**

### **Via gcloud CLI:**

```bash
gcloud run services update sampada \
  --region=us-central1 \
  --health-check-path=/api/health \
  --health-check-initial-delay=10s \
  --health-check-timeout=5s \
  --health-check-period=10s \
  --health-check-failure-threshold=3
```

---

## 📈 3. Set Up Uptime Checks

### **Create Uptime Check:**

1. **Go to Monitoring:** https://console.cloud.google.com/monitoring
2. **Click "Uptime checks"** in left menu
3. **Click "+ CREATE UPTIME CHECK"**

**Configuration:**
- **Title:** `Sampada Production Health`
- **Protocol:** `HTTPS`
- **Resource Type:** `URL`
- **Hostname:** `sampada-315704971004.us-central1.run.app`
- **Path:** `/api/health`
- **Check frequency:** `1 minute`
- **Regions:** Select 3-4 regions (e.g., USA, Europe, Asia)
- **Response timeout:** `10 seconds`
- **Response content:** Contains `"status":"healthy"`

4. **Click "CREATE"**

---

## 🚨 4. Configure Alerts

### **Alert 1: Service Down**

1. **Go to Alerting:** https://console.cloud.google.com/monitoring/alerting
2. **Click "+ CREATE POLICY"**

**Configuration:**
- **Name:** `Sampada - Service Down`
- **Condition:**
  - **Target:** Uptime check - Sampada Production Health
  - **Condition:** Check passed
  - **Threshold:** < 1 (fails)
  - **Duration:** 2 minutes
- **Notification:**
  - **Email:** your-email@example.com
  - **SMS:** (optional)
- **Documentation:**
  ```
  The Sampada production service is down or unhealthy.
  
  Check:
  1. Cloud Run logs: https://console.cloud.google.com/run/detail/us-central1/sampada/logs
  2. Health endpoint: https://sampada-315704971004.us-central1.run.app/api/health
  3. Database connection
  ```

### **Alert 2: High Error Rate**

**Condition:**
- **Metric:** `logging.googleapis.com/user/error_count`
- **Threshold:** > 10 errors in 5 minutes
- **Notification:** Email

### **Alert 3: High Memory Usage**

**Condition:**
- **Metric:** `run.googleapis.com/container/memory/utilizations`
- **Threshold:** > 90% for 5 minutes
- **Notification:** Email

### **Alert 4: Slow Response Time**

**Condition:**
- **Metric:** `run.googleapis.com/request_latencies`
- **Threshold:** p95 > 2000ms for 5 minutes
- **Notification:** Email

---

## 📊 5. Custom Dashboards

### **Create Monitoring Dashboard:**

1. **Go to Dashboards:** https://console.cloud.google.com/monitoring/dashboards
2. **Click "+ CREATE DASHBOARD"**
3. **Name:** `Sampada Production Metrics`

**Add Charts:**

#### **Chart 1: Request Count**
- **Resource:** Cloud Run Revision
- **Metric:** `run.googleapis.com/request_count`
- **Aggregation:** Sum
- **Chart type:** Line

#### **Chart 2: Response Latency**
- **Metric:** `run.googleapis.com/request_latencies`
- **Aggregation:** 50th, 95th, 99th percentile
- **Chart type:** Line

#### **Chart 3: Error Rate**
- **Metric:** `run.googleapis.com/request_count`
- **Filter:** `response_code_class = "5xx"`
- **Chart type:** Line

#### **Chart 4: Memory Usage**
- **Metric:** `run.googleapis.com/container/memory/utilizations`
- **Chart type:** Line

#### **Chart 5: CPU Usage**
- **Metric:** `run.googleapis.com/container/cpu/utilizations`
- **Chart type:** Line

#### **Chart 6: Instance Count**
- **Metric:** `run.googleapis.com/container/instance_count`
- **Chart type:** Stacked area

---

## 🔍 6. Log-Based Metrics

### **Create Custom Metrics:**

1. **Go to Logs Explorer:** https://console.cloud.google.com/logs
2. **Click "CREATE METRIC"**

**Metric 1: API Errors**
```
resource.type="cloud_run_revision"
resource.labels.service_name="sampada"
severity>=ERROR
```

**Metric 2: Slow Queries**
```
resource.type="cloud_run_revision"
jsonPayload.duration>1000
```

**Metric 3: Webhook Failures**
```
resource.type="cloud_run_revision"
jsonPayload.webhook="sanity"
jsonPayload.status="failed"
```

---

## 📱 7. Notification Channels

### **Set Up Email Notifications:**

1. **Go to Notification Channels:** https://console.cloud.google.com/monitoring/alerting/notifications
2. **Click "ADD NEW"**
3. **Select "Email"**
4. **Add your email address**
5. **Verify email**

### **Optional: Slack Integration**

1. **Create Slack webhook:** https://api.slack.com/messaging/webhooks
2. **Add webhook URL to Cloud Monitoring**
3. **Test notification**

---

## 🎯 8. Monitoring Endpoints

### **Available Endpoints:**

1. **Health Check:**
   ```
   GET /api/health
   ```

2. **Monitoring Dashboard:**
   ```
   GET /api/monitoring?type=all
   GET /api/monitoring?type=errors
   GET /api/monitoring?type=performance
   GET /api/monitoring?type=system
   ```

3. **Clear Metrics (Admin):**
   ```
   DELETE /api/monitoring?type=errors
   DELETE /api/monitoring?type=performance
   ```

---

## 📊 9. Performance Monitoring

### **Track Performance in Your Code:**

```typescript
import { withPerformanceTracking } from '@/lib/monitoring/performance';

// Wrap async functions
const result = await withPerformanceTracking(
  'fetchProducts',
  async () => {
    return await prisma.product.findMany();
  },
  'database'
);
```

### **Track Errors:**

```typescript
import { errorTracker } from '@/lib/monitoring/errorTracking';

try {
  // Your code
} catch (error) {
  errorTracker.logError(error, { context: 'productFetch' });
  throw error;
}
```

---

## 🎯 10. Best Practices

### **Monitoring Checklist:**

- ✅ Health checks configured
- ✅ Uptime monitoring active
- ✅ Error alerts set up
- ✅ Performance alerts configured
- ✅ Custom dashboard created
- ✅ Notification channels tested
- ✅ Log-based metrics created
- ✅ Regular review schedule (weekly)

### **Alert Thresholds:**

| Metric | Warning | Critical |
|--------|---------|----------|
| Error Rate | > 5/min | > 20/min |
| Response Time (p95) | > 1s | > 2s |
| Memory Usage | > 80% | > 90% |
| CPU Usage | > 70% | > 85% |
| Uptime | < 99% | < 95% |

---

## 🚀 Quick Start Commands

### **Check Health:**
```bash
curl https://sampada-315704971004.us-central1.run.app/api/health
```

### **View Monitoring Data:**
```bash
curl https://sampada-315704971004.us-central1.run.app/api/monitoring?type=all
```

### **View Cloud Run Logs:**
```bash
gcloud run services logs read sampada --region=us-central1 --limit=50
```

### **View Metrics:**
```bash
gcloud monitoring time-series list \
  --filter='metric.type="run.googleapis.com/request_count"' \
  --format=json
```

---

## 📖 Additional Resources

- **Cloud Monitoring Docs:** https://cloud.google.com/monitoring/docs
- **Cloud Run Monitoring:** https://cloud.google.com/run/docs/monitoring
- **Alerting Best Practices:** https://cloud.google.com/monitoring/alerts/best-practices

---

**Monitoring is now fully configured!** 🎉

*Har Har Mahadev!* 🕉️ *Om Namah Sivaya!* 🙏
