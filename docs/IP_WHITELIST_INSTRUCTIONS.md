# IP Whitelisting for Cloud SQL

## Your Public IP: 122.172.84.119

## Steps to Whitelist:

### 1. Go to Google Cloud Console
https://console.cloud.google.com/sql/instances/sampada-db?project=sampada-store-2026

### 2. Click on "Connections" tab

### 3. Click "Networking" section

### 4. Under "Authorized networks", click "ADD NETWORK"

### 5. Add your IP:
- **Name:** Local Development
- **Network:** 122.172.84.119
- Click **DONE**
- Click **SAVE**

### 6. Wait 1-2 minutes for changes to apply

### 7. Restart your dev server:
```powershell
# Press Ctrl+C to stop
npm run dev
```

### 8. Test the connection:
Visit: http://localhost:3000/admin/dashboard

---

**The admin dashboard should now connect directly to Cloud SQL!** 🎉

*Om Namah Sivaya!* 🕉️
