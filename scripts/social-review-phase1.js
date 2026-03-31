#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

try {
  // Optional in staging; available in the live squad-dashboard project.
  require('dotenv').config({path: path.resolve(__dirname, '..', '.env.local')});
  require('dotenv').config();
} catch (_error) {
  // Ignore missing dotenv so dry runs still work outside the project root.
}

function parseArgs(argv) {
  const args = {dryRun: false};

  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];

    if (value === '--dry-run') {
      args.dryRun = true;
      continue;
    }

    if (value === '--payload') {
      args.payloadPath = argv[i + 1];
      i += 1;
      continue;
    }
  }

  return args;
}

function readJson(jsonPath) {
  return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}

function slugify(input) {
  return String(input || 'video')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'video';
}

function ensureArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function inferMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.mp4') return 'video/mp4';
  if (ext === '.mov') return 'video/quicktime';
  if (ext === '.m4v') return 'video/x-m4v';
  if (ext === '.webm') return 'video/webm';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';

  return 'application/octet-stream';
}

function joinDescription(parts) {
  return parts
    .map((part) => String(part || '').trim())
    .filter(Boolean)
    .join('\n\n');
}

function normalizePayload(raw, payloadPath) {
  const title = raw.title || raw.youtube?.title || raw.facebook?.title || 'Untitled video';
  const slug = slugify(raw.assetId || title);
  const keywords = ensureArray(raw.keywords);
  const hashtags = ensureArray(raw.hashtags);
  const tags = ensureArray(raw.youtube?.tags || keywords).slice(0, 20);
  const videoPath = raw.videoPath ? path.resolve(raw.videoPath) : null;
  const coverImagePath = raw.coverImagePath ? path.resolve(raw.coverImagePath) : null;
  const summary = raw.summary || raw.description || '';
  const cta = raw.cta || '';
  const youtubeDescription = joinDescription([
    raw.youtube?.description || summary,
    cta,
    hashtags.join(' '),
  ]);
  const facebookDescription = joinDescription([
    raw.facebook?.description || summary,
    cta,
    hashtags.join(' '),
  ]);
  const defaultReportPath = payloadPath
    ? path.resolve(path.dirname(payloadPath), `${path.basename(payloadPath, path.extname(payloadPath))}.report.json`)
    : path.resolve(process.cwd(), `${slug}.report.json`);

  return {
    assetId: raw.assetId || `${slug}-${Date.now()}`,
    title,
    slug,
    summary,
    cta,
    keywords,
    hashtags,
    videoPath,
    videoUrl: raw.videoUrl || null,
    coverImagePath,
    outputReportPath: raw.outputReportPath ? path.resolve(raw.outputReportPath) : defaultReportPath,
    youtube: {
      enabled: raw.youtube?.enabled !== false,
      title: raw.youtube?.title || title,
      description: youtubeDescription,
      tags,
      categoryId: String(raw.youtube?.categoryId || '22'),
      privacyStatus: raw.youtube?.privacyStatus || 'private',
    },
    facebook: {
      enabled: raw.facebook?.enabled !== false,
      title: raw.facebook?.title || title,
      description: facebookDescription,
      pageId: raw.facebook?.pageId || process.env.FACEBOOK_PAGE_ID || null,
      preferRemoteFile: Boolean(raw.videoUrl && raw.facebook?.preferRemoteFile !== false),
    },
    notify: {
      telegram: {
        enabled: raw.notify?.telegram?.enabled !== false,
        chatId: raw.notify?.telegram?.chatId || process.env.SOCIAL_PHASE1_TELEGRAM_CHAT_ID || null,
      },
    },
  };
}

function validatePayload(payload) {
  const errors = [];

  if (!payload.videoPath && !payload.videoUrl) {
    errors.push('Provide either videoPath or videoUrl.');
  }

  if (payload.videoPath && !fs.existsSync(payload.videoPath)) {
    errors.push(`Video file not found: ${payload.videoPath}`);
  }

  if (payload.coverImagePath && !fs.existsSync(payload.coverImagePath)) {
    errors.push(`Cover image not found: ${payload.coverImagePath}`);
  }

  if (payload.youtube.enabled && !payload.videoPath) {
    errors.push('YouTube upload requires a local videoPath for resumable upload.');
  }

  if (payload.facebook.enabled && !payload.facebook.pageId) {
    errors.push('Facebook draft creation requires facebook.pageId or FACEBOOK_PAGE_ID.');
  }

  if (payload.notify.telegram.enabled && !payload.notify.telegram.chatId) {
    errors.push('Telegram notification requires notify.telegram.chatId or SOCIAL_PHASE1_TELEGRAM_CHAT_ID.');
  }

  return errors;
}

async function getGoogleAccessToken() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Google OAuth env vars: GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google token refresh failed: ${response.status} ${body}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function uploadYouTubePrivate(payload, dryRun) {
  const buffer = fs.readFileSync(payload.videoPath);
  const mimeType = inferMimeType(payload.videoPath);

  if (dryRun) {
    return {
      status: 'dry_run',
      request: {
        title: payload.youtube.title,
        privacyStatus: payload.youtube.privacyStatus,
        categoryId: payload.youtube.categoryId,
        bytes: buffer.length,
      },
    };
  }

  const accessToken = await getGoogleAccessToken();
  const metadata = {
    snippet: {
      title: payload.youtube.title,
      description: payload.youtube.description,
      tags: payload.youtube.tags,
      categoryId: payload.youtube.categoryId,
    },
    status: {
      privacyStatus: payload.youtube.privacyStatus,
      selfDeclaredMadeForKids: false,
    },
  };

  const initResponse = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status&uploadType=resumable', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Length': String(buffer.length),
      'X-Upload-Content-Type': mimeType,
    },
    body: JSON.stringify(metadata),
  });

  if (!initResponse.ok) {
    const body = await initResponse.text();
    throw new Error(`YouTube upload init failed: ${initResponse.status} ${body}`);
  }

  const uploadUrl = initResponse.headers.get('location');

  if (!uploadUrl) {
    throw new Error('YouTube upload init did not return a resumable upload URL.');
  }

  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Length': String(buffer.length),
      'Content-Type': mimeType,
    },
    body: buffer,
  });

  if (!uploadResponse.ok) {
    const body = await uploadResponse.text();
    throw new Error(`YouTube upload failed: ${uploadResponse.status} ${body}`);
  }

  const data = await uploadResponse.json();
  const videoId = data.id;

  return {
    status: 'uploaded_private',
    videoId,
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    studioUrl: `https://studio.youtube.com/video/${videoId}/edit`,
  };
}

async function createFacebookDraft(payload, dryRun) {
  if (dryRun) {
    return {
      status: 'dry_run',
      request: {
        pageId: payload.facebook.pageId,
        title: payload.facebook.title,
        usesRemoteFile: payload.facebook.preferRemoteFile,
      },
    };
  }

  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('Missing FACEBOOK_PAGE_ACCESS_TOKEN.');
  }

  const endpoint = `https://graph-video.facebook.com/v23.0/${payload.facebook.pageId}/videos`;
  const form = new FormData();

  form.set('access_token', accessToken);
  form.set('title', payload.facebook.title);
  form.set('description', payload.facebook.description);
  form.set('published', 'false');

  if (payload.facebook.preferRemoteFile && payload.videoUrl) {
    form.set('file_url', payload.videoUrl);
  } else {
    const buffer = fs.readFileSync(payload.videoPath);
    const blob = new Blob([buffer], {type: inferMimeType(payload.videoPath)});
    form.set('source', blob, path.basename(payload.videoPath));
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    body: form,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Facebook draft creation failed: ${response.status} ${body}`);
  }

  const data = await response.json();

  return {
    status: 'draft_created',
    videoId: data.id || null,
    reviewNote: `Review in Meta Business Suite > Content using Page ${payload.facebook.pageId}.`,
  };
}

async function sendTelegramSummary(payload, results, dryRun) {
  const chatId = payload.notify.telegram.chatId;

  const lines = [
    'Chris Phase 1 review package is ready.',
    '',
    `Title: ${payload.title}`,
    `Asset ID: ${payload.assetId}`,
    payload.videoPath ? `Local video: ${payload.videoPath}` : null,
    payload.videoUrl ? `Source URL: ${payload.videoUrl}` : null,
    '',
    results.youtube?.videoId ? `YouTube private: ${results.youtube.studioUrl}` : null,
    results.youtube?.watchUrl ? `YouTube watch: ${results.youtube.watchUrl}` : null,
    results.facebook?.videoId ? `Facebook draft ID: ${results.facebook.videoId}` : null,
    results.facebook?.reviewNote || null,
    '',
    'Instagram stays pending until Phase 2.',
  ].filter(Boolean);

  if (dryRun) {
    return {
      status: 'dry_run',
      message: lines.join('\n'),
    };
  }

  const botToken = process.env.SOCIAL_PHASE1_TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    throw new Error('Missing SOCIAL_PHASE1_TELEGRAM_BOT_TOKEN.');
  }

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      chat_id: chatId,
      text: lines.join('\n'),
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Telegram notification failed: ${response.status} ${body}`);
  }

  const data = await response.json();

  return {
    status: 'sent',
    messageId: data.result?.message_id || null,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.payloadPath) {
    console.error('Usage: node scripts/social-review-phase1.js --payload path\\to\\payload.json [--dry-run]');
    process.exit(1);
  }

  const payloadPath = path.resolve(args.payloadPath);
  const raw = readJson(payloadPath);
  const payload = normalizePayload(raw, payloadPath);
  const errors = validatePayload(payload);

  if (errors.length > 0) {
    console.error('Payload validation failed:');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  const results = {
    assetId: payload.assetId,
    title: payload.title,
    createdAt: new Date().toISOString(),
    dryRun: args.dryRun,
  };

  try {
    if (payload.youtube.enabled) {
      console.log('Uploading private YouTube review copy...');
      results.youtube = await uploadYouTubePrivate(payload, args.dryRun);
    }

    if (payload.facebook.enabled) {
      console.log('Creating Facebook Page draft...');
      results.facebook = await createFacebookDraft(payload, args.dryRun);
    }

    if (payload.notify.telegram.enabled) {
      console.log('Sending Telegram notification...');
      results.telegram = await sendTelegramSummary(payload, results, args.dryRun);
    }

    fs.writeFileSync(payload.outputReportPath, JSON.stringify(results, null, 2));
    console.log(`Phase 1 report written to ${payload.outputReportPath}`);
  } catch (error) {
    results.error = {
      message: error.message,
      stack: error.stack,
    };
    fs.writeFileSync(payload.outputReportPath, JSON.stringify(results, null, 2));
    console.error(error.message);
    process.exit(1);
  }
}

main();
