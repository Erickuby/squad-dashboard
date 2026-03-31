# LinkedIn Scheduler Setup Checklist ✅

Use this checklist to verify your setup is complete and working.

## Phase 1: Workflow Import

- [ ] Workflow imported into n8n successfully
- [ ] All nodes are visible and connected
- [ ] No "missing node" errors
- [ ] Workflow can be opened and viewed
- [ ] Workflow saved successfully

## Phase 2: LinkedIn App Setup

- [ ] LinkedIn Developer account created
- [ ] Application created in LinkedIn Developer Portal
- [ ] Application name and details filled in
- [ ] Auth 2.0 enabled
- [ ] Sign In with LinkedIn enabled
- [ ] Application approved and active

## Phase 3: OAuth Configuration

- [ ] Redirect URL added to LinkedIn app:
  - Development: `http://localhost:5678/rest/oauth2-credential/callback`
  - Production: `https://your-domain.com/rest/oauth2-credential/callback`
- [ ] Client ID copied
- [ ] Client Secret copied
- [ ] Permissions configured:
  - [ ] `w_member_social`
  - [ ] `r_liteprofile`
  - [ ] `r_emailaddress`
- [ ] OAuth 2.0 settings saved

## Phase 4: n8n Credentials

- [ ] n8n credential created (LinkedIn OAuth2 API)
- [ ] Client ID entered correctly
- [ ] Client Secret entered correctly
- [ ] OAuth flow completed successfully
- [ ] Access token generated
- [ ] Refresh token available
- [ ] Credential assigned to LinkedIn API Call node
- [ ] Connection test successful

## Phase 5: Person URN Setup

- [ ] LinkedIn Person ID retrieved via API
- [ ] Person ID formatted correctly: `urn:li:person:XXXXXXXX`
- [ ] Environment variable created: `LINKEDIN_PERSON_URN`
- [ ] Environment variable value matches Person URN
- [ ] Environment variable saved
- [ ] (Optional) Image asset URN set up if using images: `LINKEDIN_ASSET_URN`

## Phase 6: n8n Configuration

- [ ] Workflow is active (green toggle)
- [ ] Schedule Trigger is active (if using)
- [ ] Webhook URL is accessible
- [ ] Time zone settings are correct
- [ ] File write permissions available (for CSV logging)
- [ ] Log file location accessible

## Phase 7: Testing - Manual Trigger

- [ ] Manual Trigger node selected
- [ ] Test payload prepared
- [ ] Payload is valid JSON
- [ ] Scheduled time is in the future
- [ ] Content length < 3000 characters
- [ ] Workflow executed
- [ ] Execution completed without errors
- [ ] LinkedIn API response: 201 (Success)

## Phase 8: Testing - Webhook

- [ ] Webhook URL copied
- [ ] Test script prepared (curl/Postman)
- [ ] POST request sent to webhook
- [ ] Response received (200 OK)
- [ ] Response contains: `success: true`
- [ ] Response contains `postId`
- [ ] Response contains `status`

## Phase 9: Verify Posting

- [ ] Post appears on LinkedIn profile
- [ ] Post content matches exactly
- [ ] Hashtags rendered correctly
- [ ] Scheduled time matches actual post time
- [ ] Post is visible to connections
- [ ] Engagement metrics visible

## Phase 10: Logging Verification

- [ ] Log file created: `linkedin-posts-log.csv`
- [ ] Log file is writable
- [ ] Successful post logged with `status: success`
- [ ] `linkedinPostId` is populated
- [ ] `postedAt` timestamp is accurate
- [ ] Content is recorded (escaped special chars)
- [ ] All columns present and populated

## Phase 11: Error Handling Test

- [ ] Test with invalid Person URN
  - [ ] Error logged with `status: failed` or `retry`
  - [ ] Error message captured
  - [ ] Retry scheduled (if within limit)
- [ ] Test with empty content
  - [ ] Validation or API error captured
  - [ ] Logged appropriately
- [ ] Test with past scheduled time
  - [ ] Post still executes (immediate posting)
  - [ ] Logged correctly

## Phase 12: Multiple Posts Test

- [ ] Test payload with multiple posts
- [ ] All posts scheduled
- [ ] All posts processed
- [ ] All posts logged
- [ ] No duplicate posts created
- [ ] Each post has unique `postId`

## Phase 13: Automation Test

- [ ] Schedule Trigger activated
- [ ] Interval set correctly (e.g., 5 minutes)
- [ ] Pending posts checked regularly
- [ ] Posts published at scheduled times
- [ ] No posts missed or duplicated

## Phase 14: Production Readiness

- [ ] All tests passed
- [ ] Documentation reviewed
- [ ] Team trained on usage
- [ ] Monitoring set up
- [ ] Error alerts configured
- [ ] Backup procedures documented
- [ ] Rate limits considered
- [ ] Security review completed

## Phase 15: Integration Test (if applicable)

- [ ] External system connected
- [ ] Data mapping verified
- [ ] Automated triggering works
- [ ] Error handling works
- [ ] Logging comprehensive
- [ ] Performance acceptable

---

## Quick Validation Commands

```bash
# Test LinkedIn API connection
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  https://api.linkedin.com/v2/me

# Test webhook endpoint
curl -X POST http://localhost:5678/webhook/linkedin-schedule \
  -H "Content-Type: application/json" \
  -d '{"content":"Test","scheduledTime":"2024-12-31T10:00:00Z","platform":"linkedin"}'

# Check log file
cat linkedin-posts-log.csv | tail -5

# Count successful posts
grep "success" linkedin-posts-log.csv | wc -l

# Count failed posts
grep "failed" linkedin-posts-log.csv | wc -l
```

## Common Issues Reference

| Issue | Checklist Item | Quick Fix |
|-------|----------------|-----------|
| 401 Unauthorized | Phase 4 | Refresh OAuth token |
| 403 Forbidden | Phase 3 | Check app permissions |
| Invalid URN | Phase 5 | Verify Person URN format |
| No logs | Phase 6 | Check write permissions |
| Post not appearing | Phase 9 | Wait 1-2 min for LinkedIn indexing |

---

**All checkboxes marked? You're ready to go! 🚀**

Need help? See `linkedin-scheduler-README.md` or `linkedin-scheduler-QUICK-START.md`
