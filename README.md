# Synth — AI Agents Platform

Build a team of specialized AI agents tailored to your workflow. Define their expertise, personality, and AI model — then watch them collaborate.

## Features

- **Custom AI Agents** — Create agents with unique domains, personalities, and Claude models (Haiku / Sonnet / Opus)
- **Team Chat** — Orchestrator routes each message to the right agent automatically
- **Task Execution** — Assign tasks to agents and get AI-generated results with follow-up conversations
- **Kanban Board** — Visual task management with automatic agent execution
- **Google OAuth + Credentials** — NextAuth authentication with Prisma adapter
- **PostgreSQL (Supabase)** — Production-ready database with RLS

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + Framer Motion |
| Database | PostgreSQL via Supabase (Prisma 7 ORM) |
| Auth | NextAuth.js v4 |
| AI | Anthropic Claude API (SDK) |
| UI | Lucide React icons, React Markdown |

## Local Setup

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (or local PostgreSQL)
- An [Anthropic API key](https://console.anthropic.com)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/nelu11221/Synth.git
cd Synth

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your actual values

# 4. Push schema to database
npx prisma db push

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (pooler URL for Supabase) |
| `DIRECT_URL` | Direct PostgreSQL URL (for migrations) |
| `NEXTAUTH_SECRET` | Random secret — generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Base URL of your app |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (optional) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret (optional) |

### Add Your Anthropic API Key

After signing up, go to **Dashboard → Settings** and paste your Anthropic API key. Each user stores their own key — encrypted with AES-256-GCM before saving.

## Project Structure

```
src/
├── app/
│   ├── api/           # Route handlers (auth, agents, tasks, team, chat)
│   ├── dashboard/     # Protected dashboard pages
│   ├── login/         # Login page
│   └── register/      # Register page
├── components/
│   ├── dashboard/     # Sidebar, Overview, KanbanBoard, TeamChat, AgentChat…
│   ├── landing/       # Hero, Navbar, Features, Pricing, Testimonials…
│   └── ui/            # Shared UI components
└── lib/
    ├── auth.ts        # NextAuth config
    ├── prisma.ts      # Prisma client (pg adapter)
    └── encryption.ts  # AES-256-GCM API key encryption
```

## License

MIT
