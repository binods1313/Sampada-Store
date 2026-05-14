# Browser Coder Instructions — Sampada Store Setup

**Date:** May 2026  
**Project:** Sampada Store  
**Accounts:** binods111@gmail.com (primary), binods1313@gmail.com (old — being migrated away from)

---

## TASK 1 — Enable Firebase

**Account:** binods111@gmail.com  
**Project:** gen-lang-client-0132215006

1. Go to `https://console.firebase.google.com`
2. Click **Add project** → Select existing Google Cloud project → choose **gen-lang-client-0132215006**
3. Enable Google Analytics when prompted → Continue
4. Once created, go to **Project Settings** (gear icon)
5. Under **Your apps** → click **</>** (Web app)
6. App nickname: `Sampada Web` → Register app
7. **Copy and send back all 6 values:**

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## TASK 2 — Create Service Account JSON key for GCS

**Google Cloud Console — binods111@gmail.com**

1. Go to `https://console.cloud.google.com/iam-admin/serviceaccounts`
2. Click **Create Service Account**
   - Name: `sampada-gcs-service`
   - Role: **Storage Admin**
3. Click the created service account → **Keys** tab → **Add Key → Create new key → JSON**
4. Download the JSON file
5. **Send back the JSON file** (rename it `gcs-service-account.json`)

---

## TASK 3 — Set up Cloud Scheduler (nightly Printify sync)

**Google Cloud Console — binods111@gmail.com**

1. Go to `https://console.cloud.google.com/cloudscheduler`
2. Click **Create Job**
3. Fill in:

| Field | Value |
|---|---|
| Name | `sampada-printify-sync` |
| Region | `asia-south1` |
| Frequency | `0 2 * * *` (runs at 2am IST daily) |
| Timezone | `Asia/Kolkata` |
| Target type | `HTTP` |
| URL | `https://sampada.online/api/printify/sync-product` |
| HTTP method | `POST` |
| Body | `{"scheduled": true}` |
| Auth header | `None` |

4. Click **Create**

---

## TASK 4 — Add binods111@gmail.com as Sanity Admin

1. Go to `https://sanity.io/manage`
2. Select the **Sampada** project (ID: `7lh35oho`)
3. Click **Members** → **Invite member**
4. Email: `binods111@gmail.com`
5. Role: **Administrator**
6. Send invite

---

## TASK 5 — Export Sanity dataset backup

1. Install Sanity CLI if not already: `npm install -g @sanity/cli`
2. In terminal, navigate to the sanity project folder
3. Run:
```bash
sanity dataset export production sampada-backup.tar.gz
```
4. **Send back the backup file** or upload to Google Drive and share the link

---

## TASK 6 — Add binods111@gmail.com to GitHub repo

1. Go to `https://github.com/binods1313/Sampada-Store`
2. Click **Settings** → **Collaborators** → **Add people**
3. Search: `binods111@gmail.com` or the GitHub username for that account
4. Role: **Admin**
5. Send invite

---

## TASK 7 — Add environment variables to Vercel

1. Go to `https://vercel.com/dashboard`
2. Find the **Sampada-Store** project → **Settings** → **Environment Variables**
3. Add ALL of these (copy exact values from the `.env` file in the project root):

```
GEMINI_API_KEY
GOOGLE_AI_API_KEY
GOOGLE_AI_KEY
GOOGLE_VISION_KEY
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_CLOUD_PROJECT_ID
GOOGLE_CLOUD_PROJECT_NUMBER
GCS_BUCKET_NAME
SANITY_API_WRITE_TOKEN
SANITY_WEBHOOK_SECRET
NEXT_PUBLIC_FEATURE_VISUAL_SEARCH=true
```

4. Set environment to: **Production + Preview + Development** for each
5. Click **Save** after each one

---

## TASK 8 — Confirm sampada.online domain on Vercel

1. In Vercel → Sampada-Store project → **Settings** → **Domains**
2. Confirm `sampada.online` is listed and shows **Valid Configuration** (green tick)
3. If not added: click **Add Domain** → type `sampada.online` → follow DNS instructions
4. **Send back:** Is the domain showing green/valid? Yes/No

---

## TASK 9 — Enable Vercel Analytics

1. In Vercel → Sampada-Store project → **Analytics** tab
2. Click **Enable Analytics**
3. Free tier — no configuration needed

---

## WHAT TO SEND BACK

Once all tasks are done, send back:

```
Firebase config values (Task 1):     [all 6 values]
GCS service account JSON (Task 2):   [file: gcs-service-account.json]
Cloud Scheduler created (Task 3):    Yes / No
Sanity invite sent (Task 4):         Yes / No
Sanity backup file (Task 5):         [file or Drive link]
GitHub invite sent (Task 6):         Yes / No
Vercel env vars added (Task 7):      Yes / No
Domain status (Task 8):              Valid / Not valid
Analytics enabled (Task 9):          Yes / No
```

---

## Context for the Coder

- The project is a Next.js Pages Router e-commerce app for **Sampada** — a premium Indian heritage fashion brand
- GitHub repo: `https://github.com/binods1313/Sampada-Store`
- Production URL: `https://sampada.online`
- Sanity project ID: `7lh35oho`
- Google Cloud project: `gen-lang-client-0132215006` (binods111@gmail.com)
- All API keys and secrets are in the `.env` file in the project root
