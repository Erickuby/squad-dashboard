# Notion Scripts Database - Manual Setup Required

**Issue:** The current Notion integration ("Squad Dashboard") is an **Internal Integration** owned by a single user. It doesn't have permissions to create workspace-level pages.

---

## What I Tried

I attempted to create a "YouTube Scripts - Master Database" page but received this error:

```
Error: Provide a `parent.page_id` or `parent.database_id` parameter to create a page, or use a public integration with `insert_content` capability.
```

This means the integration can only create pages that are:
- Attached to an existing page (parent.page_id)
- Attached to a database (parent.database_id)

---

## Solution Options

### Option 1: Create Scripts Page Manually (Recommended)

**Steps:**
1. Open Notion
2. Click "+ New page" in your workspace
3. Title: `📹 YouTube Scripts - Master Database`
4. **Do NOT add a parent** - Leave it as a workspace-level page
5. Click "Add to workspace" (if prompted)
6. **Copy the page URL** (from the address bar)
7. **Paste the page URL here** and I can save it

### Option 2: Add to Existing Database

**Steps:**
1. Find the "Squad Completed Tasks" database in your workspace
2. Open the database (not a specific task page)
3. Click "+" to add a new row/page
4. Create a new page with title: `YouTube Scripts Master Database`
5. Copy the page ID from the URL
6. **Paste the page ID** here and I can save it

### Option 3: Create New Public Integration

**Steps:**
1. Go to [Notion My Integrations](https://www.notion.so/my-integrations)
2. Click your "Squad Dashboard" integration
3. **Upgrade** it to have broader permissions
4. **Re-run** this script with the same integration

---

## What to Provide Me

Once you have the page created, give me:

1. **The page URL** (copy from Notion address bar)
   - Example: `https://www.notion.so/workspace/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?pageId=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

2. **OR the page ID** (32-character string from URL)
   - Example: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

Then I'll update the `.env.local` file with:
```bash
NOTION_SCRIPTS_PAGE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_SCRIPTS_PAGE_URL=https://www.notion.so/...
```

And update the script to automatically use this page for future script additions.

---

## Why This Happened

**Notion Integration Types:**

| Type | Capabilities |
|-------|-------------|
| **Internal** | Create pages attached to parent pages or databases |
| **Public** | Create workspace-level pages, insert content anywhere |

**Your current integration:** Internal
**Required for workspace pages:** Public integration

---

## Recommendation

**Use Option 1** (Manual creation is fastest)

Creating a page manually takes 2 minutes and gives you full control over where it lives in your workspace structure.

Once you provide the page ID/URL, I can:
- Save it to `.env.local`
- Update the script to auto-link future scripts
- Create child pages automatically for new scripts

---

**What would you like to do?**

1. ✅ Create the page manually and give me the URL
2. ✅ Upgrade the integration to public (takes 5-10 minutes)
3. ✅ Use Squad Dashboard database for scripts (simplest - just add a row)

Let me know which option you prefer!
