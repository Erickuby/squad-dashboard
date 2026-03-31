# Chris Social Review Phase 1

Phase 1 is the first working review loop for Chris after a finished Remotion render.

It does three things:

1. Uploads the finished MP4 to YouTube as `private`
2. Creates a Facebook Page review copy with `published=false`
3. Sends Eric a Telegram message with the review links and IDs

Instagram is intentionally not posted in this phase. Chris keeps the Instagram asset pack ready, but the actual Instagram publish flow stays for Phase 2 because Instagram does not support a true remote draft the same way.

## Files

- `scripts/social-review-phase1.js`
- `workflows/social-review-phase1-payload.example.json`

## Environment Variables

Add these to `squad-dashboard/.env.local` before using the script:

```env
GOOGLE_OAUTH_CLIENT_ID=...
GOOGLE_OAUTH_CLIENT_SECRET=...
GOOGLE_OAUTH_REFRESH_TOKEN=...

FACEBOOK_PAGE_ID=...
FACEBOOK_PAGE_ACCESS_TOKEN=...

SOCIAL_PHASE1_TELEGRAM_BOT_TOKEN=...
SOCIAL_PHASE1_TELEGRAM_CHAT_ID=...
```

Notes:

- The Google refresh token must belong to the YouTube channel that should receive the private upload.
- The Facebook token must be a Page-capable token that can create unpublished Page video content.
- Telegram is optional in principle, but this Phase 1 package assumes you want the notification step.

## Usage

Dry run:

```bash
node scripts/social-review-phase1.js --payload workflows/social-review-phase1-payload.example.json --dry-run
```

Real run:

```bash
node scripts/social-review-phase1.js --payload workflows/social-review-phase1-payload.example.json
```

The script writes a `.report.json` file next to the payload file so Chris can keep a record of:

- YouTube video ID
- YouTube studio URL
- Facebook draft ID
- Telegram message ID
- Any upload error

## Payload Contract

Required:

- `title`
- `videoPath` or `videoUrl`

Strongly recommended:

- `summary`
- `cta`
- `keywords`
- `hashtags`
- `youtube.title`
- `facebook.title`

Chris should generate the platform SEO first, then hand off the finished asset pack.

## Chris Handoff Pattern

After the Remotion render is final:

1. Write a payload JSON file beside the render or in `squad-dashboard/workflows/`
2. Fill in:
   - final MP4 path
   - YouTube title/description/tags
   - Facebook draft title/description
   - hashtags and CTA
3. Run the script
4. Send Eric the resulting Telegram notification and keep the report JSON

## Current Limits

- This package expects the MP4 to exist locally for the YouTube upload.
- Facebook uses the Graph video upload endpoint with `published=false`; exact Business Suite review placement depends on Meta's current Page tooling.
- No Instagram publish is attempted in Phase 1.
- No TikTok draft is attempted in Phase 1.

## Why This First

This path keeps Remotion untouched. Chris still renders the strongest possible video first, then performs review-distribution as a separate step instead of weakening the animation system to fit a posting tool.
