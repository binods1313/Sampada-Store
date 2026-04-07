# Deploy Sampada to sampada.store on Hostinger

**Date:** 2026-04-06  
**Domain:** sampada.store  
**Hosting Provider:** Hostinger  
**Target:** Production deployment

---

## 📋 Prerequisites Checklist

- [x] Domain purchased: `sampada.store`
- [ ] Hostinger VPS plan (minimum **KVM 2** - 2 CPU, 4GB RAM, 50GB SSD)
- [ ] Cloud SQL PostgreSQL connection string ready
- [ ] Stripe live API keys ready
- [ ] Sanity production credentials ready
- [ ] All API keys ready (VATlayer, Razorpay, etc.)

---

## Step 1: Set Up Hostinger VPS

### 1.1 Choose VPS Plan

Recommended: **KVM 2** (₹699-₹899/month)
- 2 vCPU Cores
- 4 GB RAM
- 50 GB NVMe SSD
- 2 TB Bandwidth (enough for Sampada)

### 1.2 Select OS Template

- **Ubuntu 22.04 LTS** (recommended)
- Or Ubuntu 24.04 LTS

### 1.3 Access Your VPS

After VPS is ready, you'll get:
- **IP Address:** e.g., `123.45.67.89`
- **Username:** `root`
- **Password:** (set during setup)

SSH into your server:
```bash
ssh root@YOUR_VPS_IP
```

---

## Step 2: Configure Domain DNS (sampada.store)

### 2.1 Go to Hostinger Domains

1. Login to Hostinger → **Domains** → `sampada.store`
2. Click **DNS / Nameservers**
3. Add these records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | `@` | `YOUR_VPS_IP` | 3600 |
| A | `www` | `YOUR_VPS_IP` | 3600 |
| CNAME | `api` | `sampada.store` | 3600 |

### 2.2 Verify DNS Propagation

```bash
# Wait 5-30 minutes, then test
nslookup sampada.store
nslookup www.sampada.store
```

Both should return your VPS IP.

---

## Step 3: Set Up the Server

SSH into your VPS and run these commands:

### 3.1 Update System & Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git nginx certbot python3-certbot-nginx build-essential

# Verify installations
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
nginx -v        # Should show nginx version
```

### 3.2 Install PM2 (Process Manager)

```bash
npm install -g pm2
pm2 --version
```

### 3.3 Create Deploy User (Security Best Practice)

```bash
# Create non-root user
adduser deploy
usermod -aG sudo deploy

# Give deploy user SSH access
mkdir -p /home/deploy/.ssh
cp /root/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

Now switch to the deploy user:
```bash
su - deploy
```

---

## Step 4: Deploy Sampada

### 4.1 Clone Repository

```bash
# From deploy user
cd ~
git clone https://github.com/binods1313/Sampada-Store.git
cd Sampada-Store
```

### 4.2 Install Dependencies & Build

```bash
# Install production dependencies
npm ci --production=false

# Build the Next.js app
npm run build
```

### 4.3 Create Production Environment File

```bash
nano .env.production
```

Add this (fill in your actual values):

```bash
# ===== SAMPADA.PRODUCTION =====

# Database (Cloud SQL PostgreSQL)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_DB_IP:5432/sampada?sslmode=disable"

# Stripe (Live Keys)
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_DESIGNER_KEY="pk_live_..."
STRIPE_DESIGNER_PRO_PRICE_ID="price_..."
STRIPE_DESIGNER_ULTRA_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Google Cloud
GOOGLE_CLOUD_PROJECT_ID="sampada-store-87848430"
GCS_BUCKET_NAME="sampada-storage-87848430"

# Google AI (Gemini)
GOOGLE_AI_API_KEY="AIzaSy..."

# OpenRouter
OPENROUTER_API_KEY="sk-or-v1-..."

# SendGrid
SENDGRID_API_KEY="SG...."
SENDGRID_FROM_EMAIL="noreply@sampada.store"
SENDGRID_FROM_NAME="Sampada"

# Printify
PRINTIFY_API_KEY="..."
PRINTIFY_SHOP_ID="..."

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID="7lh35oho"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_WRITE_TOKEN="..."

# NextAuth
NEXTAUTH_SECRET="PFBN0MFKQrQ17xjMbNVi1GXqPzixPFrfgElWdXYx4ZPU9WRDkbspKgT5eRA9qf3YZig712gRwZO"
NEXTAUTH_URL="https://sampada.store"

# Application
NODE_ENV="production"
NEXT_PUBLIC_BASE_URL="https://sampada.store"
NEXT_PUBLIC_API_URL="https://sampada.store"

# Payment APIs
VAT_API_KEY="0ef0eafaad30336b3f791432906fb2fe"
RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_SECRET="..."

# Mailchimp
MAILCHIMP_API_KEY="..."
MAILCHIMP_AUDIENCE_ID="..."
MAILCHIMP_SERVER_PREFIX="us1"

# Lob.com
LOB_API_KEY="..."

# Clearbit
CLEARBIT_API_KEY="..."

# GA4
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

Save and exit (`Ctrl+X`, `Y`, `Enter`).

### 4.4 Start with PM2

```bash
# Start the app with PM2
NODE_ENV=production pm2 start npm --name "sampada-store" -- start

# Save PM2 process list
pm2 save

# Start PM2 on system boot
pm2 startup
```

Your app is now running at `http://localhost:3000`

### 4.5 Verify the App is Running

```bash
# Check PM2 status
pm2 status

# Should show:
# │ sampada-store │ online │ 0 │ ... │

# Test locally
curl http://localhost:3000
# Should return HTML
```

---

## Step 5: Configure Nginx as Reverse Proxy

### 5.1 Create Nginx Config

```bash
sudo nano /etc/nginx/sites-available/sampada.store
```

Add this:

```nginx
server {
    listen 80;
    server_name sampada.store www.sampada.store;

    # Redirect HTTP → HTTPS (after SSL is set up)
    # return 301 https://$server_name$request_uri;

    # For now, proxy to Node.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Increase upload limit for image uploads
    client_max_body_size 50M;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1000;
}
```

### 5.2 Enable the Site

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/sampada.store /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test nginx config
sudo nginx -t

# If OK, restart nginx
sudo systemctl restart nginx
```

---

## Step 6: Set Up SSL (HTTPS) with Let's Encrypt

### 6.1 Get SSL Certificate

```bash
sudo certbot --nginx -d sampada.store -d www.sampada.store
```

Follow prompts:
1. Enter your email
2. Accept terms
3. Choose redirect option (2: Redirect all HTTP to HTTPS)

### 6.2 Auto-Renew SSL

Certbot auto-renews by default. Verify:
```bash
sudo certbot renew --dry-run
```

---

## Step 7: Set Up PM2 Ecosystem File (Better Process Management)

```bash
nano ecosystem.config.js
```

Add:

```javascript
module.exports = {
  apps: [{
    name: 'sampada-store',
    script: 'npm',
    args: 'start',
    cwd: '/home/deploy/Sampada-Store',
    env_production: {
      NODE_ENV: 'production',
    },
    instances: 2, // Run 2 instances for load balancing
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    error_file: '/home/deploy/Sampada-Store/logs/pm2-error.log',
    out_file: '/home/deploy/Sampada-Store/logs/pm2-out.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }]
};
```

```bash
# Create logs directory
mkdir -p /home/deploy/Sampada-Store/logs

# Start with ecosystem file
pm2 delete sampada-store
pm2 start ecosystem.config.js
pm2 save
```

---

## Step 8: Deploy Updates (Future)

When you push new code to GitHub:

```bash
# SSH into server
ssh deploy@YOUR_VPS_IP

# Pull latest code
cd ~/Sampada-Store
git pull origin main

# Install dependencies (if any changed)
npm ci --production=false

# Rebuild
npm run build

# Restart PM2
pm2 restart sampada-store

# Check status
pm2 status
pm2 logs sampada-store --lines 50
```

---

## Step 9: Monitor & Maintain

### 9.1 View Logs

```bash
# PM2 logs
pm2 logs sampada-store

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### 9.2 Monitor Resources

```bash
# CPU/RAM usage
pm2 monit

# System resources
htop

# Disk usage
df -h
```

### 9.3 Firewall (Security)

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
sudo ufw status
```

---

## 🎯 Quick Reference Commands

| Task | Command |
|------|---------|
| Start app | `pm2 start ecosystem.config.js` |
| Stop app | `pm2 stop sampada-store` |
| Restart app | `pm2 restart sampada-store` |
| View logs | `pm2 logs sampada-store` |
| Rebuild after update | `git pull && npm run build && pm2 restart sampada-store` |
| Check SSL expiry | `sudo certbot certificates` |
| Renew SSL | `sudo certbot renew` |
| Restart Nginx | `sudo systemctl restart nginx` |

---

## 📊 Expected Costs

| Service | Cost/Month |
|---------|-----------|
| Hostinger KVM 2 VPS | ₹699-₹899 (~$8-11) |
| Domain (sampada.store) | Already purchased |
| SSL Certificate | FREE (Let's Encrypt) |
| Cloud SQL PostgreSQL | $10-30 (if separate) |
| Stripe fees | 2.9% + ₹3 per transaction |
| **Total** | **~₹700-900/month** |

---

## ⚠️ Before Going Live

1. [ ] Switch Stripe keys to live mode
2. [ ] Switch Razorpay keys to live mode
3. [ ] Test full checkout flow with real payment
4. [ ] Test email notifications (SendGrid)
5. [ ] Verify GA4 tracking is working
6. [ ] Test on mobile devices
7. [ ] Run Lighthouse audit (aim for 90+ on all metrics)
8. [ ] Set up error monitoring (Sentry)
9. [ ] Configure automated backups for database
10. [ ] Set up monitoring alerts (UptimeRobot, etc.)

---

## 🚀 Alternative: Vercel (Easier Option)

If VPS setup feels complex, you can deploy to **Vercel** (free tier available):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Add custom domain
vercel domains add sampada.store
```

Vercel advantages:
- Zero server management
- Automatic SSL
- Automatic deployments on git push
- Free tier: 100GB bandwidth
- Easy custom domain setup

Vercel disadvantages:
- More expensive at scale
- Less control over infrastructure
- Serverless cold starts

---

**Ready to deploy? Start with Step 1 and work through each step!** 🚀
