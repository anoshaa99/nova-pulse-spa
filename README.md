# NovaPulse AI

A Next.js single-page AI chatbot with a warm, light UI — powered by ChatGPT (OpenAI). Separate from **MindForge AI** (`spa-project/`), with its own branding and layout.

## Stack

- **Next.js 15** (App Router)
- **React 19**
- **OpenAI Chat Completions API**

## Requirements checklist

| Requirement | Implementation |
|-------------|----------------|
| React SPA | Next.js App Router |
| Backend API | Next.js Route Handlers (`/api/chat`) |
| AI feature | AI Chatbot (ChatGPT) |
| Secure API keys | `OPENAI_API_KEY` in `.env.local` only |
| Loading spinner | `LoadingSpinner` component |
| Error handling | Client + API structured errors |
| Input validation | Message length limits |
| Deployment | Vercel (single deploy) |

## Local development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
cd nova-pulse-spa
npm install
cp .env.example .env.local
# Add your OPENAI_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) (port 3001 so it can run alongside `spa-project` on 3000).

### Environment variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI / ChatGPT API key (required) |
| `OPENAI_MODEL` | Model name (default `gpt-4o-mini`) |

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/chat` | Chat — body: `{ "messages": [{ "role": "user", "content": "..." }] }` |

## Project structure

```
nova-pulse-spa/
├── app/
│   ├── api/chat/route.js
│   ├── api/health/route.js
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── components/
│   ├── Chatbot.jsx
│   ├── ErrorMessage.jsx
│   └── LoadingSpinner.jsx
├── lib/
│   ├── chat.js
│   └── validation.js
└── package.json
```

## License

ISC
