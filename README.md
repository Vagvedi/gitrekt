


# 🔥 GITREKT — GitHub Roaster



**Get brutally roasted based on your actual GitHub activity and code metrics.**

A production-grade web application that analyzes **public GitHub profiles** and generates **data-driven, deterministic roasts** based on real contribution patterns and code quality metrics.

> Every roast is backed by measurable signals.  
> No hallucinations. No BS. Just facts.

---

## 🚀 Tech Stack

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zustand&logoColor=white)](https://zustand-demo.pmnd.rs/)
[![Octokit](https://img.shields.io/badge/Octokit-2088FF?style=for-the-badge&logo=github&logoColor=white)](https://octokit.github.io/rest.js/)
[![Babel](https://img.shields.io/badge/Babel-F9DC3E?style=for-the-badge&logo=babel&logoColor=black)](https://babeljs.io/)
[![Zod](https://img.shields.io/badge/Zod-3E82B7?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Pino](https://img.shields.io/badge/Pino-E67E22?style=for-the-badge&logo=pino&logoColor=white)](https://getpino.io/)

</div>

---

## 🎯 Key Features

### 🔍 Real Metrics, Not Vibes
Every roast cites exact data with evidence:
- `"You maintain 47 repositories but 8 are collecting dust for 3y 2m"`
- Evidence: `abandoned_count=8, days_inactive=1155`

### 🎲 Deterministic Roasts
- **Same user → same output**
- Rule-based generation
- No LLM randomness
- Severity levels: `info`, `warning`, `critical`

### 🎨 Terminal-Inspired UI
- Dark mode only
- Neon accents (purple, cyan, green, red)
- Glitch effects for critical findings
- Smooth Framer Motion animations

### 📊 Comprehensive Analysis
- 8+ roast categories
- 10+ calculated metrics
- Pagination for large profiles
- GitHub rate-limit handling

---

## 🏗️ Project Structure

```
gitrekt/
├── 📁 backend/                 # Node.js + Express API
│   ├── 📁 src/
│   │   ├── 📁 api/            # Routes & middleware
│   │   ├── 📁 github/         # GitHub API integration
│   │   ├── 📁 analysis/       # Metrics & static analysis
│   │   ├── 📁 roast/          # Roast generation engine
│   │   └── 📁 utils/          # Helpers & config
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   └── 📄 README.md
│
├── 📁 frontend/               # React + Vite UI
│   ├── 📁 src/
│   │   ├── 📁 components/     # UI components
│   │   ├── 📁 services/       # API client
│   │   ├── 📁 store/          # Zustand state
│   │   ├── 📁 styles/         # Tailwind & animations
│   │   └── 📄 App.tsx
│   ├── 📄 package.json
│   ├── 📄 vite.config.ts
│   └── 📄 README.md
│
├── 📄 ARCHITECTURE.md         # System design & data flow
├── 📄 package.json            # Workspace config
└── 📄 README.md               # This file
```

---

## 📈 Metrics Explained

### 🗑️ Abandonment Score
```
abandoned_score = (now - last_commit) / (now - creation_date)
```
- **0.0** → recently active
- **1.0** → never touched again

### 🍴 Fork Ratio
```
fork_ratio = forked_repos / total_repos
```
- **0.8** → mostly collector
- **0.5** → more forks than originals
- **< 0.2** → mostly original work

### 🌐 Language Spread
Unique languages used:
- **10+** → too scattered
- **5–10** → healthy diversity
- **< 3** → focused specialization

### 🔍 Code Quality Signals
Derived from:
- Cyclomatic complexity
- File length (god-files)
- Duplication percentage
- README / documentation quality

---

## 🚦 Roast Categories

| Category | Severity | Trigger |
|----------|----------|---------|
| `abandoned_repos` | warning / critical | >6 months inactive |
| `activity_gaps` | warning / critical | >60 days between commits |
| `fork_heavy` | warning / roast | >60% forks |
| `language_spread` | warning | >8 languages |
| `low_engagement` | info / warning | Few PRs/issues |
| `no_documentation` | warning / critical | >30% repos w/o README |
| `cyclomatic_complexity` | warning / critical | Avg >12 |
| `slow_repo` | warning | Avg commit gap >90 days |

---

## 💻 Installation

### 📋 Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- **GitHub Personal Access Token**  
  👉 [Generate Token](https://github.com/settings/tokens)

### 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Vagvedi/gitrekt.git
cd gitrekt

# Install dependencies
npm install

# Set up environment variables
cp backend/.env.example backend/.env
# Add your GitHub token to backend/.env

# Start development servers
npm run dev
```

### 🌐 Access
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

---

## 🛠️ Usage

### 1. **Enter GitHub Username**
Simply type any GitHub username in the search bar.

### 2. **Get Roasted**
The system analyzes:
- Repository health and activity
- Code quality metrics
- Contribution patterns
- Engagement levels

### 3. **View Results**
Get a detailed roast with:
- Exact metrics and evidence
- Severity indicators
- Actionable insights
- Beautiful terminal-style UI

---

## 🔧 Configuration

### Environment Variables

```env
# backend/.env
GITHUB_TOKEN=your_github_token_here
PORT=3000
NODE_ENV=development
REDIS_URL=redis://localhost:6379  # Optional
```

### Rate Limiting
- **10 requests per minute per IP**
- **GitHub API limits respected**
- **In-memory caching** (Redis ready)

---

## 🔒 Security Features

- ✅ Rate limiting (10 req/min/IP)
- ✅ Environment-only secrets
- ✅ Zod input validation
- ✅ Sanitized logging
- ✅ CORS configured
- ✅ No PII stored
- ✅ No database required

---

## 📊 Performance

- 🚀 **Median response time**: < 10s
- ⚡ **Cache hit**: < 100ms
- 🔄 **GitHub rate-limit aware**
- 📱 **Responsive design**

---

## 🤝 Contributing

This is a finished showcase project, but PRs are welcome for:

- 🆕 **New metrics & detectors**
- 🎨 **UI / animation improvements**
- ⚡ **Performance optimizations**
- 📚 **Deployment guides**
- 🐛 **Bug fixes**

### Development Workflow

```bash
# Lint code
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [GitHub API](https://docs.github.com/en/rest) for providing comprehensive data
- [Octokit](https://github.com/octokit/octokit.js) for excellent GitHub SDK
- [Framer Motion](https://www.framer.com/motion/) for beautiful animations
- [TailwindCSS](https://tailwindcss.com/) for utility-first styling

---


**Made with 🔥 and lots of ☕**



