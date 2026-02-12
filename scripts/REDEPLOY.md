# Force Vercel Redeploy

This script triggers a Vercel redeploy to clear any cached deployments.

## Usage

Run this script from the `squad-dashboard` directory:

```bash
node scripts/force-redeploy.js
```

Then wait 1-2 minutes for Vercel to redeploy.

## Why This Helps

- Vercel sometimes caches old builds or API responses
- This forces a fresh deployment
- New version headers and cache-busting will work better

## Alternative: Manual Redeploy

If the script doesn't work, you can manually redeploy from Vercel:
1. Go to https://vercel.com/dashboard
2. Find `squad-dashboard` project
3. Click "Redeploy" button (three dots → Redeploy)
