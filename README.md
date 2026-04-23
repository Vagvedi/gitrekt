# 🔥 GITREKT — GitHub Roaster

**Get brutally roasted based on your actual GitHub activity and code metrics.**

GITREKT is a production-grade web application that analyzes **public GitHub profiles** and generates **data-driven, deterministic roasts** based on real contribution patterns and code quality metrics.

> Every roast is backed by measurable signals.  
> No hallucinations. No BS. Just facts.

---


## 🧠 What This Is

Not a demo. Not a joke generator.

GITREKT is a **serious GitHub analysis engine** that evaluates your profile across:

- **Repository Health** — inactivity, abandonment, consistency  
- **Code Quality** — complexity, duplication, god-file detection  
- **Contribution Patterns** — forks vs originals, language spread  
- **Engagement** — PRs, issues, collaboration signals  

---

## 📁 Project Structure

```
gitrekt/
├── backend/                         # Node.js + Express API
│   ├── src/
│   │   ├── api/                     # Routes & middleware
│   │   ├── github/                  # GitHub API integration
│   │   ├── analysis/                # Metrics & static analysis
│   │   ├── roast/                   # Roast generation engine
│   │   └── utils/                   # Helpers & config
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/                        # React + Vite UI
│   ├── src/
│   │   ├── components/              # UI components
│   │   ├── services/                # API client
│   │   ├── store/                   # Zustand state
│   │   ├── styles/                  # Tailwind & animations
│   │   └── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
│
├── ARCHITECTURE.md                  # System design & data flow
├── package.json                     # Workspace config
└── README.md                        # This file
 
```


## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js  
- **Framework**: Express.js  
- **Language**: TypeScript  
- **GitHub API**: Octokit (REST + GraphQL)  
- **Static Analysis**: Babel Parser (AST)  
- **Validation**: Zod  
- **Logging**: Pino  
- **Cache**: In-memory (Redis-ready)  

### Frontend
- **UI**: React 18  
- **Build Tool**: Vite  
- **Styling**: TailwindCSS (dark mode)  
- **Animations**: Framer Motion  
- **State Management**: Zustand  
- **HTTP Client**: Axios  

---

## 🎯 Key Features

### 1️⃣ Real Metrics, Not Vibes

Every roast cites exact data:

"You maintain 47 repositories but 8 are collecting dust for 3y 2m"
Evidence: abandoned_count=8, days_inactive=1155


---

### 2️⃣ Deterministic Roasts

- Same user → same output  
- Rule-based generation  
- No LLM randomness  
- Severity levels: `info`, `warning`, `critical`  

---

### 3️⃣ Terminal-Inspired UI

- Dark mode only  
- Neon accents (purple, cyan, green, red)  
- Glitch effects for critical findings  
- Smooth Framer Motion animations  

---

### 4️⃣ Comprehensive Analysis

- 8+ roast categories  
- 10+ calculated metrics  
- Pagination for large profiles  
- GitHub rate-limit handling  

---

## 📊 Metrics Explained

### Abandonment Score

abandoned_score = (now - last_commit) / (now - creation_date)

0.0 → recently active
1.0 → never touched again


---

### Fork Ratio

fork_ratio = forked_repos / total_repos

0.8 → mostly collector
0.5 → more forks than originals
< 0.2 → mostly original work


---

### Language Spread

Unique languages used

10 → too scattered
5–10 → healthy diversity
< 3 → focused specialization


---

### Code Quality Signals

Derived from:
- Cyclomatic complexity  
- File length (god-files)  
- Duplication percentage  
- README / documentation quality  

---

## 🚦 Roast Categories

| Category | Severity | Trigger |
|--------|---------|--------|
| abandoned_repos | warning / critical | >6 months inactive |
| activity_gaps | warning / critical | >60 days between commits |
| fork_heavy | warning / roast | >60% forks |
| language_spread | warning | >8 languages |
| low_engagement | info / warning | Few PRs/issues |
| no_documentation | warning / critical | >30% repos w/o README |
| cyclomatic_complexity | warning / critical | Avg >12 |
| slow_repo | warning | Avg commit gap >90 days |

---

## 💻 Getting Started

### Prerequisites
- Node.js **18+**
- npm or yarn
- GitHub Personal Access Token  
  👉 https://github.com/settings/tokens

---
🔐 Security

Rate limiting (10 req/min/IP)

Environment-only secrets

Zod input validation

Sanitized logging

CORS configured

No PII stored

No database

📈 Performance

Median response time: < 10s

Cache hit: < 100ms

🤝 Contributing

This is a finished showcase project, but PRs are welcome for:

New metrics & detectors

UI / animation improvements

Performance optimizations

Deployment guides

Bug fixes
