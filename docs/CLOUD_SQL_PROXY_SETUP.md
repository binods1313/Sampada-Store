# Cloud SQL Proxy Setup Instructions

## Instance Connection Name:
```
sampada-store-2026:us-central1:sampada-db
```

## Step 1: Start Cloud SQL Proxy

Open a **NEW PowerShell terminal** and run:

```powershell
cloud_sql_proxy -instances=sampada-store-2026:us-central1:sampada-db=tcp:5432
```

**Keep this terminal running!** It acts as a secure tunnel to your Cloud SQL database.

## Step 2: Update .env.local

Change DATABASE_URL to use localhost (127.0.0.1):

```env
DATABASE_URL="postgresql://sampada-user:sampadabinod@127.0.0.1:5432/sampada"
```

## Step 3: Restart Dev Server

1. Stop the current `npm run dev` (Ctrl+C)
2. Start it again: `npm run dev`

## Verification

Once proxy is running, you should see:
```
Ready for new connections
```

Then the admin dashboard should connect successfully!

---

**Status:**
- [ ] Cloud SQL Proxy running
- [ ] .env.local updated
- [ ] Dev server restarted
- [ ] Dashboard loading

*Om Namah Sivaya!* 🕉️
