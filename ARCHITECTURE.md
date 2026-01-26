# Gitrekt: GitHub Roaster - System Architecture

## Overview
Gitrekt is a production-grade web application that analyzes public GitHub users' repositories and generates data-driven "roasts" based on measurable code quality and activity metrics.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                   │
├─────────────────────────────────────────────────────────────────┤
│ - SearchForm (input username)                                   │
│ - RoastReveal (terminal-style animation)                        │
│ - RoastCard (shareable, glitch text for severe roasts)          │
│ - FinalVerdict (confirmation screen)                            │
│ - ErrorBoundary (graceful failure)                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │ (HTTP/REST)
┌──────────────────────────▼──────────────────────────────────────┐
│                   API GATEWAY (Express)                          │
├─────────────────────────────────────────────────────────────────┤
│ POST /api/v1/analyze/:username                                  │
│ GET /api/v1/health                                              │
│ GET /api/v1/cache/clear                                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
┌───────▼──────────┐             ┌───────────▼────────┐
│  GitHub API      │             │  Analysis Engine   │
│  Integration     │             │  (Core Logic)      │
├──────────────────┤             ├────────────────────┤
│ - REST Client    │             │ - Metrics Engine   │
│ - GraphQL Client │             │ - Static Analysis  │
│ - Rate Limiter   │             │ - Roast Generator  │
│ - Cache Layer    │             │ - Scoring Logic    │
└──────────────────┘             └────────────────────┘
```

## Module Breakdown

### 1. Backend: `/backend`

```
backend/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── analyze.ts          (Main roast endpoint)
│   │   │   └── health.ts           (Health check)
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts     (Error handling)
│   │   │   ├── rateLimit.ts        (Rate limiting)
│   │   │   └── validation.ts       (Input validation)
│   │   └── server.ts               (Express setup)
│   │
│   ├── github/
│   │   ├── client.ts               (REST + GraphQL client)
│   │   ├── queries.ts              (GraphQL queries)
│   │   └── types.ts                (GitHub API types)
│   │
│   ├── analysis/
│   │   ├── metrics.ts              (Metric calculators)
│   │   ├── static-analysis.ts      (AST parsing, complexity)
│   │   ├── detectors.ts            (Abandonment, duplication)
│   │   └── types.ts                (Analysis types)
│   │
│   ├── roast/
│   │   ├── engine.ts               (Roast rule engine)
│   │   ├── rules.ts                (Roast rules by metric)
│   │   ├── scoring.ts              (Overall scoring)
│   │   └── templates.ts            (Roast templates)
│   │
│   ├── cache/
│   │   └── redis.ts                (Optional Redis cache)
│   │
│   ├── utils/
│   │   ├── logger.ts               (Structured logging)
│   │   ├── env.ts                  (Config validation)
│   │   └── helpers.ts              (Utilities)
│   │
│   └── index.ts                    (Entry point)
│
├── .env.example
├── .env.local                      (Git ignored)
├── tsconfig.json
├── package.json
└── README.md
```

### 2. Frontend: `/frontend`

```
frontend/
├── src/
│   ├── components/
│   │   ├── SearchForm.tsx          (Username input)
│   │   ├── RoastReveal.tsx         (Terminal reveal animation)
│   │   ├── RoastCard.tsx           (Individual roast display)
│   │   ├── FinalVerdict.tsx        (Confirmation screen)
│   │   └── ErrorBoundary.tsx       (Error handling)
│   │
│   ├── hooks/
│   │   ├── useRoast.ts             (Fetch roast data)
│   │   └── useAnimation.ts         (Animation state)
│   │
│   ├── services/
│   │   ├── api.ts                  (API client)
│   │   └── types.ts                (Frontend types)
│   │
│   ├── styles/
│   │   └── globals.css             (Tailwind + custom)
│   │
│   ├── pages/
│   │   ├── Home.tsx                (Main page)
│   │   └── Results.tsx             (Roast results)
│   │
│   ├── App.tsx
│   └── main.tsx                    (Vite entry)
│
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## Data Flow

### Request Flow:
```
1. User enters GitHub username in SearchForm
2. Frontend validates input
3. POST /api/v1/analyze/:username
4. Backend fetches GitHub data (REST + GraphQL)
5. Static analysis on source code
6. Metric calculation
7. Roast rule engine generates roasts
8. Return JSON response
9. Frontend animates roast reveal
10. User can share roast card
```

## Analysis Engine: Metrics

### 1. Commit Activity Gap Detection
- Analyze commit history timestamps
- Detect gaps > 30 days
- Calculate streak consistency
- Detect suspicious "fake" streaks (same time every day)

**Severity**: Warning/Roast

### 2. Repository Abandonment Detection
```
abandoned_score = (now - last_commit) / (now - repo_creation_date)
- If ratio > 0.8: FATAL roast
- If ratio > 0.5: ROAST
- If ratio > 0.3: WARNING
```

**Severity**: Warning/Roast/Fatal

### 3. Fork-to-Original Ratio
```
fork_ratio = total_forks / total_original_repos
- If ratio > 0.8: User mostly forks, doesn't create
```

**Severity**: Roast

### 4. Cyclomatic Complexity (AST Parsing)
- Parse JavaScript/TypeScript files
- Calculate nested conditionals/loops
- Flag functions with complexity > 20 as "god-functions"
- Count files with >10 functions in same file = "god-files"

**Severity**: Roast/Fatal

### 5. File Length Detection
```
long_file_ratio = files_with_>500_lines / total_files
- If > 0.3: Warning
- If > 0.6: Roast
```

**Severity**: Warning/Roast

### 6. Copy-Paste / Duplication Detection
- Simple token-based similarity matching
- Flag similar code blocks across files
- Calculate duplication percentage

**Severity**: Warning/Roast

### 7. Language Spread vs Depth
```
language_depth_score = (avg_files_per_language - min_acceptable) / spread_count
- If spread > 10 languages: Warning "Jack of all trades..."
- If depth_score < threshold: Roast "...master of none"
```

**Severity**: Warning/Roast

### 8. README-to-Code Mismatch
- Extract promises from README
- Check if repo contains actual code
- Check if main branches exist vs archived state

**Severity**: Roast

### 9. Pull Request Activity
```
pr_to_commit_ratio = total_prs / total_commits
- Low ratio = likely solo work, no collaboration
```

**Severity**: Warning

### 10. Issue Closure Rate
```
closure_rate = closed_issues / total_issues
- If < 0.3: Roast about ignoring users
```

**Severity**: Warning/Roast

## Roast Scoring

Each roast has a **severity level**:
- **WARNING**: Minor code smell, highlighted but not critical
- **ROAST**: Legitimate issue, user should care
- **FATAL**: Critical flaw that defines the profile

**Overall Score** (0-100):
- Sum of all metric violations
- Weighted by severity
- Capped at 100

## Response Format

```json
{
  "username": "torvalds",
  "overall_score": 42,
  "metrics": {
    "commit_activity_gaps": 3,
    "abandoned_repos": 2,
    "fork_ratio": 0.15,
    "avg_cyclomatic_complexity": 8.3,
    "files_over_500_lines": 12,
    "duplication_percentage": 8.2,
    "language_count": 7,
    "readme_mismatch": false,
    "pr_to_commit_ratio": 0.04,
    "issue_closure_rate": 0.92
  },
  "roasts": [
    {
      "severity": "roast",
      "message": "You maintain 47 repositories but only touch 3 of them in the last year",
      "evidence": "Last commit on 8 repos was >1 year ago despite active commits elsewhere",
      "metric": "abandoned_repos"
    },
    {
      "severity": "warning",
      "message": "Your average function has 8.3 cyclomatic complexity",
      "evidence": "12 functions in linux/kernel/sched.c exceed complexity threshold of 15",
      "metric": "cyclomatic_complexity"
    }
  ],
  "final_verdict": "Production-ready but spread too thin. Focus on fewer projects.",
  "generated_at": "2026-01-26T10:30:00Z",
  "cache_hit": false
}
```

## Tech Stack Details

### Backend
- **Express.js**: HTTP API
- **TypeScript**: Type safety
- **Octokit**: Official GitHub REST client
- **graphql-request**: GraphQL client
- **@babel/parser**: JavaScript AST parsing
- **typescript-eslint**: TS/JS analysis
- **zod**: Input validation
- **pino**: Structured logging
- **redis** (optional): Caching layer
- **dotenv**: Config management

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool
- **TailwindCSS**: Dark mode styling
- **Framer Motion**: Animations
- **Zustand**: State management
- **Axios**: HTTP client
- **clsx**: Conditional classes

## Error Handling

### User Not Found
```
404: User not found or profile is private
→ Clear message to user
```

### Rate Limit Hit
```
429: GitHub API rate limit
→ Cache response, suggest retry later
```

### Invalid Username
```
400: Username doesn't meet GitHub naming rules
→ Validation error
```

### Analysis Timeout
```
504: Deep analysis took too long (>30s)
→ Return partial results
```

## Caching Strategy

- **Redis** (optional): 1-hour TTL per username
- **In-memory**: 15-minute TTL if Redis unavailable
- **Cache invalidation**: On /api/v1/cache/clear

## Performance Targets

- Roast generation: < 10 seconds (median)
- GitHub API calls: < 2 seconds
- Static analysis: < 3 seconds
- Frontend load: < 2 seconds

## Security

- ✅ Rate limiting: 10 requests/minute per IP
- ✅ Input validation: Only valid GitHub usernames
- ✅ GitHub token in .env (never committed)
- ✅ No PII collection
- ✅ CORS configured for frontend domain only
- ✅ Logging sanitizes sensitive data

## Deployment

- **Backend**: Node.js on Railway/Render (or Docker)
- **Frontend**: Vercel/Netlify (static SPA)
- **Cache**: Redis Cloud (if needed)
- **Monitoring**: Sentry (error tracking)

---

Next step: Implement backend first, then frontend.
