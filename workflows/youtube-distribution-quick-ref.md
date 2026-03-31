# YouTube Distribution Workflow - Quick Reference

## Quick Start (5 Minutes)

### Import & Configure
1. Import `youtube-distribution-v1.json` into n8n
2. Add credentials: YouTube, Telegram, TikTok, Meta
3. Update IDs:
   - Telegram Chat ID (in all Telegram nodes)
   - YouTube Channel ID (in YouTube search node)
   - Instagram Business Account ID
   - Facebook Page ID
4. Activate workflow

### First Test
1. Upload a video to YouTube
2. Wait up to 15 minutes
3. Check Telegram for approval request
4. Click "Approve" to test posting

---

## Essential Values to Replace

### In Telegram Nodes (all 5 nodes)
```
channelId: "YOUR_TELEGRAM_CHAT_ID"
```
→ Replace with your numeric Telegram Chat ID

### In YouTube Search Node
```
q: "={{$credentials.youtubeApiConfig.channelId}}"
```
→ Add your channel ID to credentials

### In Instagram Node
```
"YOUR_INSTAGRAM_BUSINESS_ACCOUNT_ID"
```
→ Replace with your IG Business Account numeric ID

### In Facebook Node
```
"YOUR_FACEBOOK_PAGE_ID"
```
→ Replace with your Facebook Page numeric ID

---

## Workflow Architecture

```
┌─────────────────┐
│  Schedule Trigger│ (every 15 min)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  YouTube Search │ (find new videos)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Check Videos   │ (any new?)
└────────┬────────┘
         │ Yes
         ▼
┌─────────────────┐
│  Extract Data   │ (video metadata)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Telegram Notif│ (new video detected)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Generate Content│ (4 platform versions)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Approval Request│ (Telegram buttons)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Wait Approval   │ (Telegram trigger)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Check Response  │ (yes/no)
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
  Yes        No
    │         │
    ▼         ▼
┌────────┐ ┌────────────┐
│Post All│ │ Send Reject│
│Platforms│ │ Notification│
└────────┘ └────────────┘
    │
    ▼
┌─────────┐
│Success  │ (4 notifs)
│Notifs   │
└─────────┘
```

---

## Platform-Specific Details

### YouTube Shorts
- **Aspect Ratio**: 9:16 (vertical)
- **Max Duration**: 60 seconds
- **Caption**: Title + original link + #AI #Productivity #ProjectManagement
- **API**: YouTube Data API v3

### TikTok
- **Aspect Ratio**: 9:16 (vertical)
- **Max Duration**: 60 seconds
- **Caption**: Title + "Link in bio" + hashtags
- **API**: TikTok for Business API
- **Required**: Business account with API access

### Instagram Reels
- **Aspect Ratio**: 9:16 (vertical)
- **Max Duration**: 90 seconds
- **Caption**: Title + hashtags + channel mention
- **API**: Instagram Graph API
- **Required**: Business/Creator account

### Facebook
- **Aspect Ratio**: 16:9 (horizontal) or 9:16 (vertical)
- **Max Duration**: 240 seconds (4 minutes)
- **Caption**: Title + description + full YouTube link
- **API**: Facebook Graph API
- **Required**: Facebook Page

---

## Caption Templates

### YouTube Shorts
```
{{ $json.title }} - Quick tips for project managers!

#AI #Productivity #ProjectManagement

Watch full video: {{ $json.videoUrl }}
```

### TikTok
```
{{ $json.title }}

Full video on YouTube! Link in bio

#AI #Productivity #ProjectManagement #TechTips #Shorts
```

### Instagram Reels
```
{{ $json.title }}

Watch full video on my YouTube channel!

#AI #Productivity #ProjectManager #Automation #Tech #AIProductivity
```

### Facebook
```
{{ $json.title }}

Check out the full video for more AI productivity tips!

{{ $json.videoUrl }}

#AI #Productivity #Technology #Automation #ProjectManagement
```

---

## Common Issues & Fixes

### Issue: "No videos found"
**Cause**: Channel ID incorrect or no new videos
**Fix**: Verify channel ID, check `publishedAfter` parameter

### Issue: Telegram not sending
**Cause**: Wrong Chat ID or bot not started
**Fix**: Get correct Chat ID, send `/start` to your bot

### Issue: "401 Unauthorized"
**Cause**: OAuth token expired
**Fix**: Re-authenticate credentials in n8n

### Issue: TikTok API rejected
**Cause**: No API access or wrong permissions
**Fix**: Apply for TikTok for Business, enable video publishing

### Issue: Instagram not posting
**Cause**: Not Business account or missing permissions
**Fix**: Convert to Business, add `instagram_content_publish` permission

---

## Modify Polling Frequency

**Default**: Every 15 minutes

**To change**:
1. Open "Poll YouTube Every 15 Min" node
2. Edit `minutesInterval` value
3. Save and activate

**Recommended**:
- Production: 15-30 minutes
- Testing: 2-5 minutes (for faster feedback)

---

## Enable/Disable Platforms

### To Enable Only Specific Platforms
1. Open "Generate Platform Content" node
2. Edit the `platforms` object
3. Remove unwanted entries (e.g., delete tiktok entry)
4. Save

**Example - Only YouTube Shorts:**
```javascript
const platforms = {
  youtubeShorts: {
    name: 'YouTube Shorts',
    aspectRatio: '9:16',
    maxDuration: 60,
    description: `{{ $json.title }} - Quick tips!`
  }
};
```

### To Disable Temporarily
1. Right-click platform posting node
2. Select "Disable"
3. Activate workflow

---

## API Quotas & Limits

### YouTube Data API v3
- **Quota**: 10,000 units/day
- **Cost per search**: 100 units
- **Max daily checks**: 100 times (at 15-min intervals)

### Telegram Bot API
- **No quota**: Free unlimited use
- **Rate limit**: 30 messages/second

### TikTok API
- **Quota**: Varies by plan
- **Free tier**: Limited posts/day
- **Business tier**: Higher limits

### Instagram Graph API
- **Quota**: 200 API calls/hour/user
- **Limit varies**: Based on plan

### Facebook Graph API
- **Quota**: 200 API calls/hour/user
- **Higher quotas**: Business accounts

---

## Monitoring Tips

### Check Workflow Status
1. Go to n8n "Executions" tab
2. Filter by workflow name
3. Review recent executions
4. Check for errors or failed runs

### Monitor API Usage
1. Visit Google Cloud Console for YouTube API
2. Check TikTok Developer Dashboard
3. Check Meta Business Suite for Instagram/Facebook

### Track Posted Videos
- YouTube Shorts: Check your channel's Shorts tab
- TikTok: Check your profile's videos
- Instagram: Check your Reels section
- Facebook: Check your page's videos

---

## Performance Optimization

### Speed Up Workflow
- Reduce polling interval (for testing only)
- Minimize data passing between nodes
- Use webhook triggers instead of polling

### Reduce API Costs
- Check only during active posting hours
- Cache video metadata
- Batch platform posts

### Improve Reliability
- Add error handling nodes
- Implement retry logic
- Set up alerting for failures

---

## Next Customizations

### Add Video Editing
Insert FFmpeg node to automatically:
- Crop videos to 9:16
- Trim to platform-specific durations
- Add watermarks or overlays

### Add AI Captioning
Use OpenAI or Claude API to:
- Generate captions from video
- Summarize video content
- Create catchy hooks

### Add Analytics
Track performance with:
- Platform-specific analytics nodes
- Database storage (Supabase, Google Sheets)
- Weekly performance reports

### Add Scheduling
Post at optimal times:
- Time zone awareness
- Platform-specific best times
- A/B test posting times

---

## Emergency Stop

### To Immediately Stop Workflow
1. Open workflow in n8n
2. Click "Deactivate" (toggle off)
3. Verify workflow shows "Inactive" status

### To Stop Specific Platform
1. Right-click platform posting node
2. Select "Disable"
3. Workflow continues for other platforms

---

## Support Resources

### Documentation
- n8n: https://docs.n8n.io
- YouTube API: https://developers.google.com/youtube/v3
- Telegram Bot API: https://core.telegram.org/bots/api
- TikTok API: https://developers.tiktok.com
- Instagram Graph API: https://developers.facebook.com/docs/instagram-api

### Community
- n8n Community: https://community.n8n.io
- Stack Overflow: tag with n8n
- YouTube API Forum

---

## Version History

**v1.0** (2026-02-19)
- Initial release
- 4 platform support (YouTube Shorts, TikTok, Instagram, Facebook)
- Telegram approval flow
- Automated video monitoring

---

This quick reference covers the essentials. For detailed setup instructions, see `youtube-distribution-setup-guide.md`. For testing procedures, see `youtube-distribution-testing-checklist.md`.
