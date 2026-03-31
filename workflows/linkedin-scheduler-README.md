# LinkedIn Post Scheduler - n8n Workflow

A comprehensive n8n workflow for automating LinkedIn post scheduling with error handling, retry logic, and logging capabilities.

## 📋 Features

- ✅ **Multiple Trigger Options**: Webhook, Manual, and Scheduled triggers
- ✅ **Bulk Post Support**: Schedule multiple posts at once
- ✅ **LinkedIn API Integration**: Direct posting to LinkedIn via UGC Posts API
- ✅ **Smart Scheduling**: Checks scheduled time before posting
- ✅ **Error Handling**: Automatic retry with configurable limits
- ✅ **Comprehensive Logging**: CSV log file with all posting attempts
- ✅ **Status Tracking**: Pending, waiting, success, failed, retry statuses
- ✅ **Image Support**: Optional image attachment for posts

## 🚀 Quick Start

### 1. Import the Workflow

1. Open n8n (http://localhost:5678)
2. Click **Import from File** (or drag & drop)
3. Select `linkedin-scheduler.json`
4. Click **Import**

### 2. Set Up LinkedIn API Credentials

#### Step 1: Create a LinkedIn Application

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Click **Create App**
3. Fill in required information:
   - App name: e.g., "LinkedIn Post Scheduler"
   - Company website: Your website URL
   - Company email: Your email address
   - Company logo: Upload a logo
4. Select **Auth 2.0** and **Sign In with LinkedIn**
5. Agree to terms and create the app

#### Step 2: Configure OAuth 2.0

In your LinkedIn App settings:

1. Go to **Auth** tab
2. Add redirect URL: `http://localhost:5678/rest/oauth2-credential/callback`
3. Or if using a hosted n8n: `https://your-n8n-domain.com/rest/oauth2-credential/callback`
4. Save changes

#### Step 3: Get Your Credentials

1. Go to **Auth** tab
2. Note down:
   - **Client ID**
   - **Client Secret**

#### Step 4: Configure n8n Credential

1. In the n8n workflow, click on the **LinkedIn API Call** node
2. Click **Credential** → **Create New Credential**
3. Select **LinkedIn OAuth2 API**
4. Fill in:
   - **Client ID**: (from LinkedIn app)
   - **Client Secret**: (from LinkedIn app)
   - **Access Token**: Click **Sign in with LinkedIn** to generate
5. Save the credential

#### Step 5: Get Your Person URN

You need your LinkedIn Person URN to post content:

1. After OAuth setup, use the LinkedIn API to get your profile:
   ```bash
   curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     https://api.linkedin.com/v2/me
   ```

2. Copy the `id` value - this is your Person URN (e.g., `urn:li:person:abc123`)

#### Step 6: Set Environment Variables

In n8n, set these environment variables:

1. Go to n8n Settings → Environment Variables
2. Add:
   ```
   LINKEDIN_PERSON_URN=urn:li:person:YOUR_PERSON_ID
   LINKEDIN_ASSET_URN=urn:li:digitalmediaAsset:YOUR_ASSET_ID  # Optional, for images
   ```
3. Save

### 3. Test the Workflow

#### Manual Trigger

1. Click the **Manual Trigger** node
2. Edit the input JSON:
   ```json
   {
     "content": "Hello, LinkedIn! This is my first automated post. #n8n #automation",
     "scheduledTime": "2024-12-31T10:00:00Z",
     "platform": "linkedin"
   }
   ```
3. Click **Execute Workflow**
4. Check the log file: `linkedin-posts-log.csv`

#### Webhook Trigger

1. Activate the workflow (toggle **Active**)
2. Send a POST request:
   ```bash
   curl -X POST http://localhost:5678/webhook/linkedin-schedule \
     -H "Content-Type: application/json" \
     -d '{
       "posts": [
         {
           "content": "First post from webhook!",
           "scheduledTime": "2024-12-31T10:00:00Z",
           "platform": "linkedin"
         }
       ]
     }'
   ```

## 📖 Usage Guide

### Input Format

#### Single Post

```json
{
  "content": "Your post content here #hashtags",
  "scheduledTime": "2024-12-31T10:00:00Z",
  "platform": "linkedin"
}
```

#### Multiple Posts

```json
{
  "posts": [
    {
      "content": "First post #automation",
      "scheduledTime": "2024-12-31T10:00:00Z",
      "platform": "linkedin"
    },
    {
      "content": "Second post #productivity",
      "scheduledTime": "2024-12-31T14:00:00Z",
      "platform": "linkedin"
    },
    {
      "content": "Third post #tech",
      "scheduledTime": "2024-12-31T18:00:00Z",
      "platform": "linkedin"
    }
  ]
}
```

#### Post with Image

```json
{
  "content": "Check out this image!",
  "scheduledTime": "2024-12-31T10:00:00Z",
  "platform": "linkedin",
  "metadata": {
    "imageUrl": "https://example.com/image.jpg",
    "imageAlt": "Image description",
    "assetId": "YOUR_ASSET_ID"
  }
}
```

**Note**: For images, you must first upload the image to LinkedIn's media service and get the asset URN.

### Trigger Options

#### 1. Webhook Trigger (Recommended for External Systems)

- **URL**: `http://localhost:5678/webhook/linkedin-schedule`
- **Method**: POST
- **Content-Type**: application/json
- **Use case**: Integrate with other systems, web forms, CRMs

**Response**:
```json
{
  "success": true,
  "message": "Post processed",
  "postId": "post_1234567890_abc123",
  "status": "success",
  "linkedinPostId": "urn:li:ugcPost:123456789",
  "attempts": 1
}
```

#### 2. Manual Trigger

- **Use case**: Testing, one-off posts
- **How to use**: Click the node and edit the JSON payload
- **Limitations**: Can't schedule multiple posts at once

#### 3. Schedule Trigger

- **Interval**: Every 5 minutes (configurable)
- **Use case**: Process queued posts from external sources
- **How it works**: Reads from an external queue/database and dispatches to webhook

### Workflow Logic

1. **Input Normalization**: Accepts single posts or arrays, normalizes to consistent format
2. **Filter Pending**: Only processes posts with status "pending"
3. **Schedule Check**: Waits until scheduled time (max 1 hour wait per check)
4. **LinkedIn API Call**: Posts to LinkedIn via UGC Posts API
5. **Response Handling**:
   - Success (201): Log as success
   - Error: Log error and schedule retry (max 3 attempts)
6. **Logging**: All attempts logged to CSV file

### Error Handling & Retries

The workflow includes robust error handling:

- **Retry Limit**: 3 attempts per post
- **Retry Delay**: 5 minutes between retries
- **Error Logging**: Full error details captured in log file
- **Status Tracking**: 
  - `pending`: Waiting to be processed
  - `waiting`: Scheduled time not yet reached
  - `success`: Posted successfully
  - `retry`: Failed, will retry
  - `failed`: Max retries reached

### Log File Format

The CSV log (`linkedin-posts-log.csv`) contains:

| Column | Description |
|--------|-------------|
| postId | Internal post ID |
| linkedinPostId | LinkedIn's post ID (if successful) |
| platform | Platform (linkedin) |
| content | Post content (truncated, special chars escaped) |
| scheduledTime | When it was scheduled to post |
| postedAt | When it was actually posted |
| failedAt | When it failed (if applicable) |
| status | Current status |
| attempts | Number of attempts |
| errorMessage | Error message (if failed) |
| errorCode | Error code (if failed) |

## 🎨 Customizing for Other Platforms

### Adding Twitter (X)

1. **Create Twitter API Credentials**:
   - Go to [Twitter Developer Portal](https://developer.twitter.com/)
   - Create app and get API keys
   - Set up OAuth 1.0a or OAuth 2.0

2. **Duplicate LinkedIn API Call Node**:
   - Right-click **LinkedIn API Call** → Duplicate
   - Rename to **Twitter API Call**
   - Change URL to: `https://api.twitter.com/2/tweets`
   - Change method to: POST
   - Update body format:
     ```json
     {
       "text": "{{ $json.content }}"
     }
     ```

3. **Add Platform Check**:
   - Add IF node after **Prepare LinkedIn Request**
   - Check `$json.platform`
   - Route to LinkedIn or Twitter nodes accordingly

4. **Update Log Format**:
   - Add platform-specific fields if needed

### Adding Facebook/Meta

1. **Create Meta App**:
   - Go to [Meta for Developers](https://developers.facebook.com/)
   - Create app with Pages API permissions

2. **Add Facebook API Node**:
   - Similar to Twitter, duplicate and modify
   - Use: `https://graph.facebook.com/v18.0/{page-id}/feed`
   - Body:
     ```json
     {
       "message": "{{ $json.content }}",
       "access_token": "YOUR_PAGE_ACCESS_TOKEN"
     }
     ```

### Generic Platform Pattern

```javascript
// In Prepare Request node
const platform = $json.platform;

if (platform === 'linkedin') {
  // LinkedIn format
} else if (platform === 'twitter') {
  // Twitter format
} else if (platform === 'facebook') {
  // Facebook format
}
```

## 🔧 Advanced Configuration

### Change Retry Settings

Edit the **Process Error** node:

```javascript
const maxRetries = 5; // Increase from 3
const retryDelayMinutes = 10; // Increase from 5
```

### Change Schedule Check Interval

Edit the **Schedule Trigger** node:

- Set interval to desired frequency (e.g., every 1 minute)
- Or use cron for specific times

### Use Database Instead of CSV

1. Replace **Write to Log** node with:
   - **MySQL** node
   - **PostgreSQL** node
   - **MongoDB** node
   - or any other database connector

2. Create table schema:
   ```sql
   CREATE TABLE posts (
     id VARCHAR(255) PRIMARY KEY,
     linkedin_post_id VARCHAR(255),
     platform VARCHAR(50),
     content TEXT,
     scheduled_time TIMESTAMP,
     posted_at TIMESTAMP,
     failed_at TIMESTAMP,
     status VARCHAR(50),
     attempts INT,
     error_message TEXT,
     error_code VARCHAR(100),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

### Add Slack/Discord Notifications

Add after **Write to Log** node:

```javascript
// Send notification to Slack
return [{
  json: {
    text: `Post ${$json.status}: ${$json.content.substring(0, 100)}...`,
    channel: "#social-media"
  }
}];
```

Connect to **Slack** or **Discord** node.

## 🔒 Security Best Practices

1. **Store Secrets Securely**:
   - Use n8n's credential manager
   - Never hardcode API keys in workflow
   - Rotate credentials regularly

2. **Validate Input**:
   - Add validation nodes after input
   - Check for required fields
   - Sanitize content to prevent XSS

3. **Rate Limiting**:
   - LinkedIn has API rate limits
   - Consider adding delays between posts
   - Monitor API usage

4. **Environment-Specific Config**:
   - Use environment variables for URLs
   - Separate dev/staging/prod workflows

## 🐛 Troubleshooting

### Issue: "Invalid LinkedIn Person URN"

**Solution**:
- Verify your Person URN format: `urn:li:person:XXXXXXXX`
- Re-fetch your profile ID via API
- Check environment variable is set correctly

### Issue: "401 Unauthorized"

**Solution**:
- Refresh your OAuth token
- Check Client ID and Secret are correct
- Verify OAuth redirect URL matches

### Issue: "403 Forbidden"

**Solution**:
- Check your LinkedIn app has correct permissions
- Ensure you have the `w_member_social` permission
- Verify your account has posting permissions

### Issue: Posts not appearing on schedule

**Solution**:
- Check scheduled time format: `YYYY-MM-DDTHH:mm:ssZ`
- Ensure time zone is correct (use Z for UTC)
- Verify Schedule Trigger is active
- Check n8n timezone settings

### Issue: Workflow not logging to CSV

**Solution**:
- Check n8n has write permissions
- Verify file path is correct
- Check for file system errors in execution logs

## 📊 Monitoring & Analytics

### View Execution Logs

1. Go to **Executions** in n8n
2. Click on workflow executions
3. View step-by-step execution details
4. Check error messages

### CSV Log Analysis

Use tools like:
- **Excel/Google Sheets**: Import CSV
- **Python pandas**: 
  ```python
  import pandas as pd
  df = pd.read_csv('linkedin-posts-log.csv')
  print(df['status'].value_counts())
  ```
- **CLI**: 
  ```bash
  grep "success" linkedin-posts-log.csv | wc -l
  grep "failed" linkedin-posts-log.csv | wc -l
  ```

## 🤝 Integration Examples

### Zapier Integration

1. Create Zapier webhook URL
2. In Zapier, trigger on form submit, spreadsheet update, etc.
3. Send POST to n8n webhook

### Google Sheets Integration

1. **Trigger**: Google Sheets node (watch for new rows)
2. **Format**: Map columns to post content, scheduled time
3. **Send**: POST to webhook

### Airtable Integration

1. **Trigger**: Airtable node (watch for new records)
2. **Format**: Map Airtable fields
3. **Send**: POST to webhook

### WordPress Integration

1. **Trigger**: WordPress post publish webhook
2. **Transform**: WordPress post → LinkedIn post
3. **Send**: POST to n8n webhook

## 📚 API References

- **LinkedIn UGC Posts API**: [Documentation](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/ugc-post-api)
- **LinkedIn OAuth 2.0**: [Documentation](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow)
- **n8n Documentation**: [https://docs.n8n.io](https://docs.n8n.io)

## 🆘 Support

For issues or questions:

1. Check n8n execution logs
2. Review CSV log file for detailed errors
3. Verify LinkedIn API status
4. Check n8n community forums

## 📝 Version History

- **v1.0** (2024-01-15): Initial release
  - Webhook, Manual, Schedule triggers
  - LinkedIn API integration
  - Error handling & retries
  - CSV logging

## 📄 License

This workflow is provided as-is for personal and commercial use.

---

**Happy automating! 🚀**
