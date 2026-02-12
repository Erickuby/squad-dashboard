# Cloud Backend Setup

This guide will help you set up Supabase as the cloud backend for the squad dashboard.

## Why Supabase?

- Free tier (plenty for this use case)
- Real-time subscriptions (live updates!)
- Simple REST API
- Easy to set up

## Step 1: Create a Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up or log in
4. Click "New Project"
5. Fill in the details:
   - Name: `squad-dashboard`
   - Database password: (save this!)
   - Region: Choose closest to you (EU West for UK)
6. Wait for the project to be created (2-3 minutes)

## Step 2: Create the Table

1. Go to "Table Editor" in the left sidebar
2. Click "Create a new table"
3. Name it: `squad_state`
4. Add these columns:

   | Name | Type | Default |
   |------|------|---------|
   | id | int8 | (auto-increment) |
   | state_data | jsonb | |
   | updated_at | timestamptz | now() |

5. Click "Save"
6. Make `id` the Primary Key

## Step 2.5: Disable Row Level Security (RLS)

1. Go to "Authentication" → "Policies" in the left sidebar
2. Find the `squad_state` table
3. Click "Disable RLS" for this table

**Why?** The dashboard needs to read and write without authentication since it's a simple tracking app with no sensitive data.

## Step 3: Get Your Credentials

1. Go to "Project Settings" → "API"
2. Copy these values:
   - **Project URL** (looks like: `https://xxx.supabase.co`)
   - **Anon public key** (also called "anon/public key")

## Step 4: Set Up Local Environment Variables

Create a `.env.local` file in the `squad-dashboard` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual values from Step 3.

## Step 5: Update the Dashboard

The dashboard has been updated to read from Supabase automatically when environment variables are present.

## Step 6: Sync Script

Use the provided sync script to push your `squad-state.json` to Supabase:

```bash
node scripts/sync-to-supabase.js
```

This should be run whenever you update `squad-state.json`.

## Step 7: Automated Sync (Optional)

You can modify your squad task workflow to automatically sync to Supabase when tasks are assigned/updated.

## Testing

1. Run the sync script once to populate Supabase
2. Start the dev server: `npm run dev`
3. Open http://localhost:3000
4. You should see your squad state from Supabase

## Deploying to Netlify

Once Supabase is working locally, deploy to Netlify:

1. Go to your Netlify site settings
2. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
3. Deploy!

## Troubleshooting

**Dashboard shows loading state forever:**
- Check that `.env.local` exists with correct values
- Check browser console for errors

**Sync script fails with "violates row-level security policy":**
- Go to Authentication → Policies → Find `squad_state` → Click "Disable RLS"
- See Step 2.5 in setup guide above

**Sync script fails:**
- Make sure Supabase project is active
- Check your API credentials
- Make sure RLS is disabled for squad_state table

**Data not updating:**
- Make sure you're running the sync script after modifying `squad-state.json`
- Check Supabase dashboard to verify data is being saved

## Security Note

The `anon` key is safe to use in client-side code for this use case. For production apps with sensitive data, you'd use Row Level Security (RLS) policies.
