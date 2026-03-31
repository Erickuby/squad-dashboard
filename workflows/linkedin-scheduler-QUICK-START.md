# LinkedIn Scheduler - Quick Start Guide

Get up and running in 5 minutes! ⚡

## 🎯 5-Minute Setup

### 1. Import Workflow (30 seconds)
```
1. Open n8n (http://localhost:5678)
2. Click "Import from File" → Select linkedin-scheduler.json
3. Done!
```

### 2. Create LinkedIn App (2 minutes)
```
1. Go to https://www.linkedin.com/developers/
2. Click "Create App"
3. Name it, fill in your website URL
4. Select "Auth 2.0" and "Sign In with LinkedIn"
5. Create app
6. Copy Client ID and Client Secret
```

### 3. Configure n8n Credential (1 minute)
```
1. In n8n, click "LinkedIn API Call" node
2. Click Credential → Create New → LinkedIn OAuth2 API
3. Paste Client ID and Client Secret
4. Click "Sign in with LinkedIn"
5. Approve permissions
6. Save credential
```

### 4. Get Your Person URN (30 seconds)
```
1. Open terminal/command prompt
2. Run:
   curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     https://api.linkedin.com/v2/me
3. Copy the "id" value (e.g., abc123)
4. Format as: urn:li:person:abc123
```

### 5. Set Environment Variable (30 seconds)
```
1. In n8n, go to Settings → Environment Variables
2. Add: LINKEDIN_PERSON_URN=urn:li:person:YOUR_ID
3. Save
```

### 6. Test (30 seconds)
```
1. Click "Manual Trigger" node
2. Edit JSON:
   {"content":"Test post! #n8n","scheduledTime":"2024-12-31T10:00:00Z","platform":"linkedin"}
3. Click "Execute Workflow"
4. Check your LinkedIn profile!
```

## 📤 Test Webhook

```bash
curl -X POST http://localhost:5678/webhook/linkedin-schedule \
  -H "Content-Type: application/json" \
  -d '{
    "posts": [
      {
        "content": "Hello from webhook! 🚀",
        "scheduledTime": "2024-12-31T10:00:00Z",
        "platform": "linkedin"
      }
    ]
  }'
```

## 🔑 Required Permissions

Make sure your LinkedIn app has:
- ✅ `w_member_social` (Post to member's feed)
- ✅ `r_liteprofile` (Read profile)
- ✅ `r_emailaddress` (Read email - usually required)

## ⚠️ Common Gotchas

### Time Zone Issues
Always use UTC with Z suffix:
- ✅ `"2024-12-31T10:00:00Z"`
- ❌ `"2024-12-31T10:00:00"` (assumes local time)
- ❌ `"2024-12-31T10:00:00+05:00"` (n8n may not handle offset)

### Content Length
LinkedIn posts max 3000 characters. The workflow doesn't truncate - do it before sending.

### Rate Limiting
LinkedIn limits API calls:
- Free tier: ~100 posts/day
- Check LinkedIn Developer Portal for current limits

## 📊 Check Logs

```bash
# View last 10 entries
tail -n 10 linkedin-posts-log.csv

# Count successful posts
grep "success" linkedin-posts-log.csv | wc -l

# Count failed posts
grep "failed" linkedin-posts-log.csv | wc -l
```

## 🔄 Schedule Multiple Posts

```json
{
  "posts": [
    {
      "content": "Morning post ☀️",
      "scheduledTime": "2024-12-31T08:00:00Z",
      "platform": "linkedin"
    },
    {
      "content": "Afternoon post 🌤️",
      "scheduledTime": "2024-12-31T12:00:00Z",
      "platform": "linkedin"
    },
    {
      "content": "Evening post 🌙",
      "scheduledTime": "2024-12-31T18:00:00Z",
      "platform": "linkedin"
    }
  ]
}
```

## 🚀 Production Tips

1. **Activate Schedule Trigger**: Turn on automatic checking every 5 minutes
2. **Monitor Logs**: Check CSV regularly for failed posts
3. **Test First**: Always test with manual trigger before automation
4. **Backup Logs**: Move old logs to archive folder periodically
5. **Error Alerts**: Set up notifications for failed posts (see README)

## ❓ Quick Help

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Refresh OAuth token |
| 403 Forbidden | Check app permissions |
| Invalid URN | Verify Person URN format |
| Not posting | Check scheduled time is in the future |
| No logs | Check file write permissions |

## 📚 Full Documentation

See `linkedin-scheduler-README.md` for complete documentation, troubleshooting, and customization guides.

---

**You're ready to go! 🎉**
