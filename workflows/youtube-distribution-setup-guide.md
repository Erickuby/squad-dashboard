# YouTube Cross-Platform Distribution - Setup Guide

This workflow automatically monitors your YouTube channel, repurposes content for multiple platforms, and posts with human approval via Telegram.

## Prerequisites

### 1. n8n Instance
- n8n installed and running (self-hosted or n8n cloud)
- Admin access to create workflows and credentials

### 2. YouTube Setup
- YouTube Data API v3 access
- OAuth2 credentials (client ID + secret)
- Your YouTube channel ID

### 3. Telegram Setup
- Telegram Bot Token from @BotFather
- Your Telegram Chat ID (numeric ID)

### 4. Social Platform Accounts
- **TikTok for Business** account with API access
- **Instagram Business** account (via Meta)
- **Facebook Page** with admin access

---

## Phase 1: YouTube API Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable YouTube Data API v3:
   - APIs & Services → Library → Search "YouTube Data API v3" → Enable

### Step 2: Create OAuth2 Credentials
1. Go to APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application"
4. Add authorized redirect URI:
   ```
   https://your-n8n-instance.com/rest/oauth2-credential/callback
   ```
5. Copy Client ID and Client Secret

### Step 3: Get Your YouTube Channel ID
1. Go to your YouTube channel
2. View page source (Ctrl+U)
3. Search for `channel_id` or `UC` followed by 22 characters
4. Example: `UC_xxxxxxxxxxxxxxxxxxxx`

---

## Phase 2: Telegram Setup

### Step 1: Create Telegram Bot
1. Open Telegram and search for `@BotFather`
2. Send: `/newbot`
3. Follow prompts to name your bot
4. Copy the API token (looks like `123456:ABC-DEF...`)

### Step 2: Get Your Chat ID
1. Open Telegram and search for `@userinfobot`
2. Click Start
3. It will reply with your Chat ID (numeric)

---

## Phase 3: Social Platform Setup

### TikTok API Setup
1. Apply for TikTok for Developers access
2. Create an app in [TikTok Developer Portal](https://developers.tiktok.com/)
3. Request video publishing permissions
4. Get API Key and Secret

### Instagram/Facebook (Meta) Setup
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Instagram Basic Display" and "Instagram Graph API" products
4. Configure permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_read_engagement`
5. Get your Instagram Business Account ID and Facebook Page ID

---

## Phase 4: Configure n8n Workflow

### Step 1: Import Workflow
1. Open n8n
2. Click "Import from File" or paste the JSON
3. Open the workflow in editor

### Step 2: Configure Credentials

#### YouTube OAuth2
1. Open "Search New YouTube Videos" node
2. Click "Create Credential" → "YouTube OAuth2 API"
3. Enter Client ID and Secret from Phase 1
4. Complete OAuth flow (authorize your Google account)

#### Telegram API
1. Open "Send Telegram Notification" node
2. Click "Create Credential" → "Telegram API"
3. Enter API Token from @BotFather
4. Test credential to verify

#### TikTok OAuth2
1. Open "Post TikTok" node
2. Create TikTok OAuth2 credential
3. Enter API Key and Secret
4. Complete OAuth flow

#### Meta OAuth2
1. Open "Post Instagram Reel" node
2. Create Meta OAuth2 credential
3. Enter App ID and Secret
4. Complete OAuth flow with Facebook login

### Step 3: Update Telegram Chat ID
Find all "Telegram" nodes and update `channelId` parameter:
- Replace `YOUR_TELEGRAM_CHAT_ID` with your actual numeric ID

### Step 4: Update YouTube Channel ID
In the YouTube Search node, update the query:
```
channelId: YOUR_YOUTUBE_CHANNEL_ID
```

Replace with your channel ID from Phase 1.

### Step 5: Update Instagram and Facebook IDs
- `YOUR_INSTAGRAM_BUSINESS_ACCOUNT_ID` in Instagram node
- `YOUR_FACEBOOK_PAGE_ID` in Facebook node

---

## Phase 5: Test the Workflow

### Test 1: YouTube Monitoring
1. Activate the workflow
2. Upload a test video to YouTube (or wait for next upload)
3. Check workflow executions
4. Verify you receive Telegram notification

### Test 2: Approval Flow
1. When approval request comes, click "Approve" button
2. Verify workflow continues to posting
3. Try "Reject" to verify rejection flow

### Test 3: Platform Posting
1. Test each platform individually:
   - Comment out other platform nodes
   - Run workflow
   - Verify post appears on platform

---

## Customization Options

### Adjust Polling Frequency
In "Poll YouTube Every 15 Min" node:
- Change `minutesInterval` to your preference
- Recommended: 15-30 minutes

### Customize Captions
In "Generate Platform Content" node, modify the platform descriptions:
- Update templates for each platform
- Add platform-specific hashtags
- Adjust tone for each audience

### Platform Selection
To use only specific platforms:
1. Disconnect unwanted platform nodes
2. Keep only platforms you want
3. Update "Generate Platform Content" to remove unwanted entries

---

## Troubleshooting

### YouTube API Errors
- **403 Forbidden**: Check API quotas and OAuth scopes
- **401 Unauthorized**: Re-authenticate credentials
- **No videos found**: Verify channel ID is correct

### Telegram Not Sending
- Check API token is valid
- Verify Chat ID is correct (must be numeric)
- Check Bot is started: send `/start` to your bot

### TikTok API Rejected
- TikTok API access requires business account approval
- Check your app has video publishing permissions
- Verify video format meets TikTok requirements

### Instagram/Facebook Not Posting
- Verify Instagram account is Business/Creator
- Check page access tokens are valid
- Ensure you have page admin permissions

### Workflow Not Triggering
- Check n8n is running
- Verify schedule trigger is active
- Check execution logs for errors

---

## Advanced Features

### Custom Video Editing
To automatically edit videos (crop to 9:16):
1. Add FFmpeg node after "Extract Video Data"
2. Configure FFmpeg to crop video
3. Pass processed video to platform nodes

### Multi-Language Support
Modify "Generate Platform Content" to create multiple language versions:
- Add language detection
- Translate captions
- Create separate posts per language

### Analytics Tracking
Add a database node after successful posts to track:
- Post IDs
- Timestamps
- Platform
- Performance metrics (fetch via API later)

---

## Security Notes

1. **Store credentials securely** in n8n credential manager
2. **Don't share workflow JSON** with credentials embedded
3. **Use environment variables** for sensitive IDs when possible
4. **Limit API scopes** to minimum required permissions
5. **Monitor API quotas** to avoid hitting limits

---

## Maintenance

### Regular Tasks
- Check workflow execution logs weekly
- Monitor API usage and quotas
- Update credentials before expiry
- Test platform posting monthly

### Platform API Changes
Social platforms frequently update APIs:
- Monitor changelogs
- Test after updates
- Update workflow as needed

---

## Next Steps

Once basic workflow is working:

1. **Add video editing**: Automatically crop to 9:16 for TikTok/Reels
2. **AI captioning**: Use OpenAI or similar to generate captions
3. **Analytics integration**: Track performance across platforms
4. **A/B testing**: Test different captions and posting times
5. **Content scheduling**: Schedule posts at optimal times

---

## Support

If you encounter issues:
1. Check n8n execution logs
2. Verify all credentials are valid
3. Test API endpoints individually
4. Review platform API documentation
5. Contact platform support if needed

---

## Workflow Components

### Core Nodes
- **Schedule Trigger**: Polls YouTube every 15 minutes
- **YouTube Search**: Finds new videos
- **Data Extraction**: Parses video metadata
- **Content Generation**: Creates platform-specific content
- **Telegram Approval**: Sends approval requests
- **Platform Posting**: Posts to each platform
- **Notification**: Confirms successful posts

### Data Flow
```
YouTube Upload → Detection → Extraction → Content Generation
                                          ↓
                              Approval Request → Approval → Multi-Platform Post
```

---

This workflow is production-ready once credentials are configured. Start with YouTube + Telegram, then enable platforms one at a time as you verify each works correctly.
