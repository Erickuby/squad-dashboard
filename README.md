# Squad Dashboard

A sleek, animated web app for real-time squad tracking and task management.

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

## Getting Started

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

## Integration with Squad State

The dashboard currently uses mock data. To connect it to your real squad state:

1. Create an API route at `app/api/squad-state/route.ts`
2. Read from your `squad-state.json` file
3. Update the frontend to fetch from `/api/squad-state`

Example API route:

```typescript
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const statePath = path.join(process.cwd(), '..', 'squad-state.json');
  const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  return NextResponse.json(state);
}
```

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

## Future Enhancements

- [ ] Connect to real squad-state.json file
- [ ] Add task creation/assignment UI
- [ ] Implement drag-and-drop task reordering
- [ ] Add notifications for important events
- [ ] Mobile app version
- [ ] Export activity log
