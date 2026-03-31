# Phase 1 Quick Start

## What You Get

- YouTube private upload
- Facebook Page review copy
- Telegram notification

## 5-Minute Setup

1. Put the required credentials into `squad-dashboard/.env.local`
2. Copy `social-review-phase1-payload.example.json`
3. Replace the placeholder IDs and file path
4. Run a dry run:

```bash
node scripts/social-review-phase1.js --payload workflows/social-review-phase1-payload.example.json --dry-run
```

5. Run the real submission:

```bash
node scripts/social-review-phase1.js --payload workflows/social-review-phase1-payload.example.json
```

## What Chris Should Do

After a final Remotion render and voiceover generation:

1. Keep the MP4 path
2. Generate the SEO pack
3. Build the payload JSON
4. Run the Phase 1 submission script
5. Wait for the report JSON and Telegram confirmation

## Expected Output

- `*.report.json` beside the payload file
- A private YouTube review copy
- A Facebook draft/review item
- Telegram message sent to Eric
