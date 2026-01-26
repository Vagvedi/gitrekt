# GITREKT - GitHub Roaster

**Get brutally roasted based on your actual GitHub activity and code metrics.**

A production-grade web application that analyzes public GitHub user profiles and generates data-driven, deterministic roasts based on real code quality metrics and contribution patterns.

> Every roast is backed by measurable signals. No hallucinations. No BS. Just facts.

## 🔥 What This Is

Not a demo. Not a joke generator. A serious analysis tool that evaluates your GitHub presence across:

- **Repository Health**: Abandonment detection, activity gaps, commit consistency
- **Code Quality**: Cyclomatic complexity, duplication, god-file detection
- **Contribution Patterns**: Fork ratio, language spread, collaboration level
- **Engagement**: PR activity, issue resolution, community interaction

## 🚀 Live Demo

Visit [gitrekt.dev](https://gitrekt.dev) to get roasted.

## 📦 Project Structure

```
gitrekt/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── api/         # Express routes & middleware
│   │   ├── github/      # GitHub API integration
│   │   ├── analysis/    # Metrics & static analysis
│   │   ├── roast/       # Roast generation engine
│   │   └── utils/       # Helpers, logging, config
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/            # React + Vite frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API client
│   │   ├── store/       # Zustand state
│   │   ├── styles/      # Tailwind + animations
│   │   └── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
│
├── ARCHITECTURE.md      # System design & data flow
├── package.json         # Root workspace config
└── README.md            # This file
```

## 🏗️ Tech Stack

### Backend
- **Framework**: Express.js + Node.js
- **Language**: TypeScript
- **GitHub API**: Octokit REST + GraphQL
- **Analysis**: Babel/Parser for AST
- **Logging**: Pino (structured)
- **Validation**: Zod
- **Data**: In-memory cache (Redis-ready)

### Frontend
- **UI**: React 18
- **Build**: Vite
- **Styling**: TailwindCSS (dark mode)
- **Animations**: Framer Motion
- **State**: Zustand
- **HTTP**: Axios

## 🎯 Key Features

### 1. Real Metrics, Not Vibes
Every roast points to specific, measurable data:
```
"You maintain 47 repositories but 8 are collecting dust for 3y 2m"
Evidence: abandoned_count=8, days_inactive=1155
```

### 2. Deterministic Roasts
Same user → Same roasts (reproducible)
- No LLM randomness
- Rule-based generation
- Severity levels: info, warning, critical

### 3. Terminal Aesthetics
- Dark mode only
- Neon accents (purple, cyan, green, red)
- Glitch effects for critical findings
- Smooth animations with Framer Motion

### 4. Comprehensive Analysis
- 8+ roast categories
- 10+ metrics calculated
- Pagination for large repos
- Rate limit handling

## 📊 Metrics Explained

### Abandonment Score
```
abandoned_score = (now - last_commit) / (now - creation_date)
  0.0 = recently active
  1.0 = never touched again
```

### Fork Ratio
```
fork_ratio = forked_repos / total_repos
  >0.8 = mostly collector
  >0.5 = more forks than original
  <0.2 = mostly original work
```

### Language Spread
```
Count unique languages used
  >10 = too scattered
  5-10 = reasonable diversity
  <3 = specialized focus
```

### Code Quality
```
Estimated from:
- Cyclomatic complexity (functions, conditionals)
- File lengths (god-file detection)
- Duplication percentage
- README quality
```

## 🚦 Roast Categories

| Category | Severity | Trigger |
|----------|----------|---------|
| `abandoned_repos` | warning/critical | Repos untouched >6 months |
| `activity_gaps` | warning/critical | Gaps between commits >60 days |
| `fork_heavy` | warning/roast | >60% of repos are forks |
| `language_spread` | warning | >8 languages, <2 repos/lang |
| `low_engagement` | info/warning | Minimal PRs/issues |
| `no_documentation` | warning/critical | >30% without README |
| `cyclomatic_complexity` | warning/critical | Avg complexity >12 |
| `slow_repo` | warning | Avg commit gap >90 days |

## 💻 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- GitHub Personal Access Token ([create here](https://github.com/settings/tokens))

### Local Development

1. **Clone repo**
```bash
git clone https://github.com/Vagvedi/gitrekt.git
cd gitrekt
```

2. **Setup Backend**
```bash
cd backend
cp .env.example .env.local
# Edit .env.local and add your GITHUB_TOKEN
npm install
npm run dev
```

Backend runs on `http://localhost:3000`

3. **Setup Frontend** (new terminal)
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`
API proxy: `http://localhost:3000/api`

4. **Test the app**
Open `http://localhost:5173` and enter a GitHub username

### Production Build

```bash
# Build both
npm run build

# Start backend
cd backend && npm start

# Serve frontend from dist/
# Use Vercel, Netlify, or any static host
```

## 📡 API Endpoints

### POST `/api/v1/analyze/:username`
Analyze a GitHub user and generate roasts.

**Parameters:**
```
:username  (string) - GitHub username
?force=true (boolean) - Bypass cache
```

**Response:**
```json
{
  "username": "torvalds",
  "overall_score": 42,
  "metrics": {
    "total_repos": 47,
    "total_commits": 500000,
    "fork_ratio": 0.15,
    "code_quality_score": 85,
    "engagement_score": 70
  },
  "roasts": [
    {
      "severity": "roast",
      "title": "Repository Graveyard",
      "message": "You maintain 47 repositories but 8 are collecting dust...",
      "evidence": {
        "abandoned_count": 8,
        "oldest_inactive_repo": "linux/kernel/old"
      }
    }
  ],
  "final_verdict": "Production-ready but spread too thin...",
  "generated_at": "2026-01-26T10:30:00Z",
  "cache_hit": false
}
```

### GET `/api/v1/health`
Check API and GitHub connectivity.

## 🔐 Security

✅ Rate limiting (10 req/min per IP)
✅ GitHub token in environment (never committed)
✅ Input validation (Zod)
✅ Sanitized logging
✅ CORS configuration
✅ No PII collection
✅ Error messages don't leak internals

## 📈 Performance

**Median response time:** <10 seconds
- GitHub API: ~2s
- Static analysis: ~3s
- Roast generation: ~1s
- Cache hit: <100ms

**Bundle sizes (gzip):**
- Backend: ~50KB
- Frontend: ~104KB total
  - React vendor: 43KB
  - Framer Motion: 37KB
  - App code: 20KB
  - CSS: 4KB

## 🎨 UI/UX Highlights

- **Dark Mode Only**: Reduces eye strain, feels modern
- **Neon Accents**: Purple, cyan, green, red for status
- **Terminal Aesthetic**: Monospace fonts, grid layouts
- **Smooth Animations**: Framer Motion for reveals
- **Glitch Effects**: Critical roasts shimmer
- **Responsive Design**: Mobile to desktop
- **Accessibility**: ARIA labels, keyboard nav

## 🧪 Testing

### Manual Testing
```bash
# Test backend directly
curl -X POST http://localhost:3000/api/v1/analyze/torvalds

# Test frontend
# Visit http://localhost:5173
# Enter username: 'torvalds' (or any public GitHub user)
# Click "GET ROASTED"
```

### Health Checks
```bash
# Backend health
curl http://localhost:3000/api/v1/health

# Frontend loads
curl http://localhost:5173
```

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design, data flow, metrics
- [backend/README.md](./backend/README.md) - Backend setup, API docs, dev tips
- [frontend/README.md](./frontend/README.md) - Frontend setup, component docs, styling

## 🚀 Deployment

### Recommended Setup
- **Backend**: Railway.app, Render, or Heroku
- **Frontend**: Vercel or Netlify (static)
- **Cache**: Redis Cloud (optional)
- **Monitoring**: Sentry for errors

### Environment Variables

**Backend** (.env)
```env
GITHUB_TOKEN=ghp_...
PORT=3000
NODE_ENV=production
LOG_LEVEL=info
RATE_LIMIT_REQUESTS=10
ANALYSIS_TIMEOUT_MS=30000
```

**Frontend** (no env needed, uses `/api` endpoint)

### Docker

```bash
# Build
docker build -f backend/Dockerfile -t gitrekt-backend .
docker build -f frontend/Dockerfile -t gitrekt-frontend .

# Run
docker run -e GITHUB_TOKEN=xxx -p 3000:3000 gitrekt-backend
docker run -p 80:80 gitrekt-frontend
```

## 📝 Roast Examples

```
🔥 CRITICAL (Score: 85)
"Your GitHub profile is a cautionary tale. 47 repos, minimal activity, 
and scattered focus. Time for a Git purge and a coding renaissance."

Evidence: abandoned_repos=8, language_count=12, fork_ratio=0.75

---

⚠️ ROAST (Score: 60)
"You've got the basics down. Some cleanup and better documentation 
would go a long way."

Evidence: abandoned_repos=2, max_activity_gap=45

---

✓ OKAY (Score: 20)
"Solid contributor. Keep up the momentum and consider 
mentoring newcomers."

Evidence: code_quality=90, engagement_score=85
```

## 🤝 Contributing

This is a finished project showcase, but PRs are welcome for:
- Additional metrics/detectors
- Improved UI animations
- Performance optimizations
- Deployment guides
- Bug fixes

## 📄 License

MIT License - See LICENSE file

## 🙋 FAQ

**Q: Will this roast my private repos?**
A: No, we only analyze public repositories (GitHub API limitation).

**Q: Does this collect my data?**
A: We don't store user data. No database. No tracking. Analysis is ephemeral.

**Q: Can I self-host?**
A: Yes, see Deployment section above.

**Q: How often is the cache refreshed?**
A: 1 hour TTL by default. Use `?force=true` to skip cache.

**Q: What if I get rate limited by GitHub?**
A: The app returns helpful error messages. GitHub allows 5000 requests/hour with auth token.

**Q: Can the roasts be wrong?**
A: They're deterministic and based on real metrics. But interpretation is subjective. A high fork ratio might be legitimate if you contribute significantly to each fork.

## 📞 Support

- GitHub Issues: [gitrekt/issues](https://github.com/Vagvedi/gitrekt/issues)
- Email: support@gitrekt.dev
- Discord: [Join our server](https://discord.gg/gitrekt)

## 🙌 Acknowledgments

- **Octokit**: GitHub REST & GraphQL client
- **Framer Motion**: Beautiful animations
- **TailwindCSS**: Rapid UI development
- **Vite**: Lightning-fast frontend build tool
- **Express**: Simple & powerful HTTP server

---

**Built with ❤️ by developers who believe in brutal honesty.**

**Get roasted at [gitrekt.dev](https://gitrekt.dev)**
