# Railway.app Deployment Guide

This guide walks you through deploying your Dental Clinic Website (Express API + PostgreSQL) to Railway.app for free.

## Prerequisites

- [Railway.app account](https://railway.app) (sign up with GitHub)
- Your repository pushed to GitHub
- Node.js 24+ installed locally (for testing)

## Step 1: Create a Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select **`alahdlmrad271-dot/Dental-Clinic-Website`** repository
6. Railway auto-detects it's a Node.js project ✓

## Step 2: Add PostgreSQL Database

1. In your Railway project dashboard, click **"Add Service"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway automatically creates a PostgreSQL instance
4. The `DATABASE_URL` environment variable is **auto-injected** ✓

## Step 3: Configure Environment Variables

Railway auto-detects and sets most variables, but verify:

1. Go to **"Variables"** tab in Railway
2. Confirm these are present:
   - `DATABASE_URL` ← Auto-set by PostgreSQL service
   - `NODE_ENV` ← Set to `production`
   - `PORT` ← Should be set to `5000` (or your Express server port)

**Add if missing:**

```bash
NODE_ENV=production
PORT=5000
```

## Step 4: Configure Build & Start Commands

Railway should auto-detect, but verify:

**Settings** tab:
- **Build Command**: `pnpm run build`
- **Start Command**: `pnpm --filter @workspace/api-server run start`
- **Install Command**: `pnpm install --frozen-lockfile`

If Railway doesn't auto-detect, add manually in the Railway dashboard.

## Step 5: Deploy Your Application

1. Click **"Deploy"** button in Railway dashboard
2. Monitor the build logs in real-time
3. Once successful, you'll see your production URL

## Step 6: Run Database Migrations

After your first deploy, you need to run Drizzle migrations:

### Option A: Railway Shell (Recommended)

1. In Railway dashboard, go to your **API Server service**
2. Click **"Shell"** tab
3. Run:
   ```bash
   pnpm --filter @workspace/db run push
   ```
4. Confirm migrations applied ✓

### Option B: Custom Deploy Script (Automatic)

Create a `scripts/db-migrate.mjs` file to auto-run on deploy:

```javascript
import { execSync } from 'child_process';

try {
  console.log('Running database migrations...');
  execSync('pnpm --filter @workspace/db run push', { stdio: 'inherit' });
  console.log('Migrations completed ✓');
} catch (error) {
  console.error('Migration failed:', error.message);
  process.exit(1);
}
```

Then update `artifacts/api-server/package.json`:
```json
{
  "scripts": {
    "postbuild": "node ../../scripts/db-migrate.mjs"
  }
}
```

## Step 7: Verify Deployment

1. Railway provides a **public URL** (e.g., `https://dental-clinic-website-prod.up.railway.app`)
2. Test your API:
   ```bash
   curl https://your-railway-url/health
   ```
3. Check logs in Railway dashboard for errors

## Monitoring & Maintenance

### View Live Logs
- Railway dashboard → **Logs** tab (real-time)

### Check Database
- Railway dashboard → **PostgreSQL service**
- Click **"Data"** to browse tables

### Redeploy
- Push to `main` branch → Auto-deploys
- Or manually click **"Deploy"** in Railway dashboard

## Troubleshooting

### Build Fails: "Cannot find module"
```bash
# Ensure pnpm-lock.yaml is committed
git add pnpm-lock.yaml
git push
```

### Database Connection Error
1. Check `DATABASE_URL` is set (Railway → Variables)
2. Verify PostgreSQL service is running (Railway → Services)
3. Restart the API service

### Port Already in Use
- Railroad auto-manages ports
- If issues, explicitly set `PORT=5000` in Variables

### Migrations Not Running
- Use Railway Shell to manually run: `pnpm --filter @workspace/db run push`
- Check logs for SQL errors

## Free Tier Details

- **Compute**: $5/month free credit (usually enough for hobby projects)
- **PostgreSQL**: Included in free credit
- **Bandwidth**: Included
- **After free credit**: Charges apply if you exceed $5/month

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Create Railway project and connect GitHub
3. ✅ Add PostgreSQL database
4. ✅ Configure environment variables
5. ✅ Deploy and run migrations
6. ✅ Monitor logs and database

## Useful Railway Commands

View logs locally (if Railway CLI installed):
```bash
railway logs
```

View environment:
```bash
railway shell
env | grep DATABASE_URL
```

## Resources

- [Railway Documentation](https://docs.railway.app)
- [Railway GitHub Integration](https://docs.railway.app/guides/github)
- [PostgreSQL on Railway](https://docs.railway.app/guides/postgresql)
- [Node.js on Railway](https://docs.railway.app/guides/nodejs)
