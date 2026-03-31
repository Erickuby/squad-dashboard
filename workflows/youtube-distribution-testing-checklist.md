# YouTube Distribution Workflow - Testing Checklist

## Before Testing: Prerequisites Checklist

- [ ] n8n instance running and accessible
- [ ] YouTube Data API v3 enabled
- [ ] YouTube OAuth2 credentials created
- [ ] YouTube Channel ID obtained
- [ ] Telegram Bot created (@BotFather)
- [ ] Telegram Chat ID obtained
- [ ] All credentials added to n8n
- [ ] Workflow imported into n8n
- [ ] All node parameters updated (chat IDs, channel IDs, etc.)

---

## Phase 1: YouTube Monitoring Test

### Test 1.1: Credential Connection
- [ ] Open "Search New YouTube Videos" node
- [ ] Click "Test Credential"
- [ ] Verify connection successful
- [ ] Result: ✅ or ❌

### Test 1.2: YouTube Search
- [ ] Manually execute the workflow
- [ ] Check if YouTube videos are returned
- [ ] Verify video metadata is correct (title, ID, thumbnail)
- [ ] Result: ✅ or ❌

### Test 1.3: New Video Detection
- [ ] Check the `publishedAfter` parameter
- [ ] Verify it uses `$workflow.lastExecuted`
- [ ] Upload a test video to your YouTube channel
- [ ] Wait for next workflow run (up to 15 min)
- [ ] Verify workflow detects new video
- [ ] Result: ✅ or ❌

---

## Phase 2: Telegram Notification Test

### Test 2.1: Telegram Credential
- [ ] Open "Send Telegram Notification" node
- [ ] Click "Test Credential"
- [ ] Verify connection successful
- [ ] Result: ✅ or ❌

### Test 2.2: Notification Delivery
- [ ] Execute workflow with test video
- [ ] Check Telegram for notification message
- [ ] Verify message format is correct
  - [ ] Video title displayed
  - [ ] Video link clickable
  - [ ] Platform list shown
- [ ] Result: ✅ or ❌

### Test 2.3: Message Formatting
- [ ] Check message uses proper Markdown
- [ ] Verify emojis display correctly
- [ ] Test on Telegram mobile app
- [ ] Result: ✅ or ❌

---

## Phase 3: Content Generation Test

### Test 3.1: Data Extraction
- [ ] Execute workflow up to "Extract Video Data"
- [ ] Check output includes:
  - [ ] videoId
  - [ ] title
  - [ ] description
  - [ ] thumbnail URL
  - [ ] publishedAt
  - [ ] videoUrl
- [ ] Result: ✅ or ❌

### Test 3.2: Platform Content Generation
- [ ] Execute workflow through "Generate Platform Content"
- [ ] Verify 4 items generated (one per platform)
- [ ] Check each item has:
  - [ ] platform name
  - [ ] platformKey
  - [ ] aspectRatio
  - [ ] maxDuration
  - [ ] platformDescription
- [ ] Result: ✅ or ❌

### Test 3.3: Caption Templates
- [ ] Check YouTube Shorts caption includes original link
- [ ] Check TikTok caption includes "Link in bio"
- [ ] Check Instagram caption includes hashtags
- [ ] Check Facebook caption includes full video link
- [ ] Result: ✅ or ❌

---

## Phase 4: Approval Flow Test

### Test 4.1: Approval Request Sending
- [ ] Execute workflow to "Send Approval Request"
- [ ] Receive Telegram message with approval buttons
- [ ] Verify buttons display: "✅ Approve" and "❌ Reject"
- [ ] Click "Approve" button
- [ ] Result: ✅ or ❌

### Test 4.2: Approval Processing
- [ ] After clicking "Approve", wait for workflow
- [ ] Check workflow moves to platform posting nodes
- [ ] Verify Telegram callback_data includes videoId and platform
- [ ] Result: ✅ or ❌

### Test 4.3: Rejection Flow
- [ ] Execute workflow again for test video
- [ ] Click "❌ Reject" button
- [ ] Verify workflow sends rejection notification
- [ ] Verify workflow stops (no platform posting)
- [ ] Result: ✅ or ❌

---

## Phase 5: Platform Posting Tests

### Test 5.1: YouTube Shorts Posting
- [ ] Approve a post for YouTube Shorts
- [ ] Check workflow calls YouTube API
- [ ] Verify HTTP request includes:
  - [ ] video file
  - [ ] title
  - [ ] description
  - [ ] tags
- [ ] Check your YouTube Shorts for new video
- [ ] Result: ✅ or ❌

### Test 5.2: TikTok Posting
- [ ] Approve a post for TikTok
- [ ] Check workflow calls TikTok API
- [ ] Verify HTTP request includes:
  - [ ] video_url
  - [ ] caption
- [ ] Check your TikTok account for new video
- [ ] Result: ✅ or ❌

### Test 5.3: Instagram Reels Posting
- [ ] Approve a post for Instagram
- [ ] Check workflow calls Instagram Graph API
- [ ] Verify HTTP request includes:
  - [ ] video_url
  - [ ] caption
  - [ ] Instagram Business Account ID
- [ ] Check your Instagram Reels for new video
- [ ] Result: ✅ or ❌

### Test 5.4: Facebook Posting
- [ ] Approve a post for Facebook
- [ ] Check workflow calls Facebook Graph API
- [ ] Verify HTTP request includes:
  - [ ] file_url
  - [ ] description
  - [ ] Facebook Page ID
- [ ] Check your Facebook page for new video
- [ ] Result: ✅ or ❌

---

## Phase 6: Success Notifications Test

### Test 6.1: YouTube Success Notification
- [ ] After successful YouTube Shorts post
- [ ] Verify Telegram success message received
- [ ] Check message includes video title and original link
- [ ] Result: ✅ or ❌

### Test 6.2: Other Platform Success
- [ ] Test each platform's success notification
- [ ] Verify all 4 success messages work
- [ ] Check messages are properly formatted
- [ ] Result: ✅ or ❌

---

## Phase 7: Error Handling Test

### Test 7.1: Invalid YouTube Credentials
- [ ] Temporarily invalidate YouTube credential
- [ ] Run workflow
- [ ] Verify error is caught
- [ ] Check error notification sent to Telegram
- [ ] Result: ✅ or ❌

### Test 7.2: Platform API Failure
- [ ] Temporarily disable TikTok API (if possible)
- [ ] Try posting to TikTok
- [ ] Verify workflow doesn't crash
- [ ] Check error is logged
- [ ] Result: ✅ or ❌

### Test 7.3: Network Timeout
- [ ] Slow down internet connection
- [ ] Run workflow
- [ ] Check if workflow handles timeout
- [ ] Verify retry logic (if added)
- [ ] Result: ✅ or ❌

---

## Phase 8: End-to-End Test

### Test 8.1: Full Workflow
- [ ] Upload new video to YouTube
- [ ] Wait for workflow to trigger (≤15 min)
- [ ] Receive Telegram notification
- [ ] Receive approval requests for 4 platforms
- [ ] Approve all platforms
- [ ] Verify all 4 posts appear
- [ ] Receive 4 success notifications
- [ ] Result: ✅ or ❌

### Test 8.2: Partial Approval
- [ ] Upload new video
- [ ] Approve only YouTube Shorts and TikTok
- [ ] Reject Instagram and Facebook
- [ ] Verify only 2 posts appear
- [ ] Verify rejection notifications for rejected platforms
- [ ] Result: ✅ or ❌

---

## Phase 9: Data Verification

### Test 9.1: Original Link Tracking
- [ ] Check all posted videos include original YouTube link
- [ ] Verify YouTube Shorts link works
- [ ] Verify TikTok "Link in bio" is set up
- [ ] Verify Instagram caption has link
- [ ] Verify Facebook post has link
- [ ] Result: ✅ or ❌

### Test 9.2: Hashtag Verification
- [ ] Check each platform's hashtags
- [ ] Verify platform-specific hashtags used
- [ ] Verify hashtags are relevant to AI/productivity niche
- [ ] Result: ✅ or ❌

### Test 9.3: Caption Quality
- [ ] Read each platform's caption
- [ ] Check for proper formatting
- - [ ] Check for typos
- [ ] Verify tone matches platform
- [ ] Result: ✅ or ❌

---

## Phase 10: Performance Test

### Test 10.1: Execution Time
- [ ] Time workflow execution
- [ ] Verify complete run < 5 minutes
- [ ] Check for slow nodes
- [ ] Result: ✅ or ❌

### Test 10.2: Multiple Videos
- [ ] Upload 3 videos to YouTube
- [ ] Check workflow processes all 3
- [ ] Verify no duplicates
- [ ] Verify all approvals requested
- [ ] Result: ✅ or ❌

---

## Issue Log

| Test # | Issue | Description | Resolution |
|--------|-------|-------------|------------|
|        |       |             |            |
|        |       |             |            |
|        |       |             |            |

---

## Notes

```
Add any observations, findings, or customizations during testing:

```

---

## Final Approval

All tests passed: ✅ or ❌

Workflow ready for production: ✅ or ❌

Date: _______________

Tester: _______________
