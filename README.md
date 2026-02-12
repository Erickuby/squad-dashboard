# Squad Dashboard

A sleek, animated web app for real-time squad tracking and task management.

**GitHub:** https://github.com/Erickuby/squad-dashboard

## Features

- 🎨 **Beautiful UI**: Modern dark theme with gradient accents and glass morphism effects
- ✨ **Animated Agent Cards**: Each agent has an animated emoji face that reflects their status
- 📊 **Real-time Stats**: Track working agents, blockers, and last update time
- 🔄 **Auto-refresh**: Toggle auto-refresh to get real-time updates
- 🚨 **Blocker Alerts**: Visual indicators when agents are blocked
- 📝 **Activity Log**: Recent squad activity at a glance
- 💎 **Responsive Design**: Works beautifully on desktop and mobile

## Agent Status & Emojis

- 😊 **Available**: Ready for tasks (green indicator)
- 🧠 **Working**: Actively working on a task (blue indicator, animated)
- 😵 **Blocked**: Task is blocked (red indicator)
- 🤔 **Review**: Task needs review (yellow indicator)

## Squad Members

1. **Researcher** 🧪 - Deep Dives & Viral Hunting
2. **Builder** ⚡ - n8n Workflows & Coding
3. **Copywriter** ✍️ - Sales Copy & Hooks
4. **Marketer** 📈 - Growth Strategy & Distribution

## Deployment

This dashboard is configured for Netlify deployment:

### Deploy to Netlify

**Option 1: Automatic Deploy from GitHub**
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Select `Erickuby/squad-dashboard` from GitHub
4. Build settings are pre-configured in `netlify.toml`
5. Deploy!

**Option 2: Manual Deploy**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build and deploy
npm run build
netlify deploy --prod
```

### Important: Squad State Integration

**Local Development:**
The dashboard reads from `../squad-state.json` (parent directory) when running locally. Just run `npm run dev` and it will automatically sync with your workspace.

**Netlify Deployment:**
Since Netlify runs in the cloud, it cannot access your local `squad-state.json`. For cloud deployment, you have two options:

**Option 1: Use a Cloud Backend (Recommended)**
Set up a cloud API endpoint that serves the squad state:
1. Deploy a simple API endpoint (could be a Vercel function, AWS Lambda, or similar)
2. Update `app/api/squad-state/route.ts` to fetch from that endpoint instead of reading the local file

**Option 2: Use a Database**
Replace the JSON file with a database (Supabase, Firebase, etc.) and update the API route accordingly.

**For now:** The dashboard works perfectly for local development. Cloud deployment requires a backend service to serve the squad state.

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
# Navigate to http://localhost:3000
```

## Building for Production

```bash
npm run build
npm start
```

## How the Dashboard Integrates

The dashboard reads from your workspace's `squad-state.json` file:

```
workspace/
├── squad-dashboard/          # This repo
├── squad-state.json         # State file (shared)
└── scripts/
    └── update-squad-dashboard.js
```

When you update `squad-state.json` in your workspace, the dashboard automatically reflects the changes (with auto-refresh enabled).

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Customization

### Colors
Edit `app/globals.css` to customize the color scheme. Current theme uses a dark slate background with gradient accents.

### Animations
Animations are defined in `tailwind.config.ts` and components can be customized using Framer Motion props.

### Agent Cards
Modify `components/AgentCard.tsx` to change how agents are displayed or add more information.

## License

MIT

---

**Made with ❤️ for the Squad**
