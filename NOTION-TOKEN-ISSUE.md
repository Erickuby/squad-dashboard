# Notion Setup Issue - Token Format

## Problem

The Notion API token is showing as **invalid**. 

## Error Details

```
APIResponseError: API token is invalid.
code: 'unauthorized'
status: 401
```

## Possible Causes

**1. Wrong Token Format**
- Your token starts with: `ntn_G974142019IIk1KbaZq587hj9UgzttK65zb17zaAee0KD`
- Standard Notion tokens start with: `secret_` (not `ntn_`)

**2. Token from Wrong Source**
- `ntn_` might be from a different integration system
- Need to verify token is from [Notion My Integrations](https://www.notion.so/my-integrations)

**3. Integration Not Created**
- Integration might not be created yet
- Or created in wrong workspace

## Solution

### Step 1: Check Token Format

Go to [Notion My Integrations](https://www.notion.so/my-integrations)

1. Find your "Squad Dashboard" integration
2. Click to view details
3. Check the **Internal Integration Token**
4. Should start with: `secret_` (32+ characters)

### Step 2: If Token Starts with `secret_`

Update `.env.local`:
```bash
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: If No Integration Exists

Create one:
1. Go to [Notion My Integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Fill in:
   - **Name**: "Squad Dashboard"
   - **Associated workspace**: Your workspace
   - **Type**: Internal
4. Click **Submit**
5. Copy the new token (should start with `secret_`)

### Step 4: Test Again

After updating token, run:
```bash
cd squad-dashboard
node scripts/sync-notion.js setup
```

Should see:
```
✅ Found existing Notion database

============================================================
  ✅ Database Setup Complete
============================================================

Database ID: 305244a246958074bf54c8efaa53edcb
```

## Database ID

✅ The database ID looks correct: `305244a246958074bf54c8efaa53edcb`

This is 32 characters, which is the correct format.

## Next Steps

1. ✅ Check Notion My Integrations
2. ✅ Verify token starts with `secret_`
3. ✅ Update `.env.local` with correct token
4. ✅ Test with: `node scripts/sync-notion.js setup`
5. ✅ If successful, approve a task to test auto-sync

## Current Status

- ❌ Notion token invalid (starts with `ntn_`, should be `secret_`)
- ✅ Database ID correct (32 characters)
- ✅ Dependencies installed
- ✅ Script ready to test

Once you update the token, the integration should work! 🚀
