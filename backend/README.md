# Gitrekt Backend

GitHub Roaster backend service that analyzes public GitHub user profiles and generates production-grade roasts backed by real metrics.

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- GitHub Personal Access Token (create one [here](https://github.com/settings/tokens))

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env.local

# Add your GitHub token to .env.local
GITHUB_TOKEN=ghp_your_token_here
```

### Development

```bash
# Start dev server with hot reload
npm run dev

# Server runs on http://localhost:3000
```

### Production Build

```bash
# Build
npm run build

# Start
npm run start
```

## API Endpoints

### POST `/api/v1/analyze/:username`
Analyze a GitHub user and generate roasts.

**Parameters:**
- `username` (string, required) - GitHub username
- `force` (boolean, optional) - Bypass cache
- `include_analysis` (boolean, optional) - Include detailed analysis

**Response:**
```json
{
  "username": "torvalds",
  "overall_score": 42,
  "metrics": {
    "total_repos": 47,
    "total_stars": 150000,
    "total_commits": 500000,
    "primary_languages": ["C", "Shell"],
    "fork_ratio": 0.15,
    "abandonment_score": 0.2,
    "code_quality_score": 85,
    "engagement_score": 70
  },
  "roasts": [
    {
      "severity": "roast",
      "title": "Repository Graveyard",
      "message": "You maintain 47 repositories but 8 are collecting dust for 3y 2m",
      "evidence": {
        "total_repos": 47,
        "abandoned_count": 8,
        "oldest_inactive_repo": "linux/kernel/old-subsystem",
        "days_inactive": 1155
      }
    }
  ],
  "final_verdict": "Production-ready but spread too thin. Focus on fewer projects.",
  "generated_at": "2026-01-26T10:30:00Z",
  "cache_hit": false
}
```

### GET `/api/v1/health`
Health check and GitHub API status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-26T10:30:00Z",
  "github_api": {
    "status": "connected",
    "rate_limit": {
      "remaining": 4500,
      "limit": 5000
    }
  }
}
```

## Architecture

### Modules

#### `github/`
- **client.ts** - GitHub REST & GraphQL API client with rate limiting
- **types.ts** - Type definitions for GitHub API responses
- **queries.ts** - GraphQL query definitions

#### `analysis/`
- **metrics.ts** - Calculate repository and user metrics
- **detectors.ts** - Detection logic for code smells and anti-patterns
- **types.ts** - Analysis type definitions

#### `roast/`
- **engine.ts** - Roast rule engine and scoring logic

#### `api/`
- **server.ts** - Express server setup
- **routes/** - API endpoint handlers
- **middleware/** - Express middleware (error handling, validation, CORS)

#### `utils/`
- **env.ts** - Environment variable validation
- **logger.ts** - Structured logging (Pino)
- **helpers.ts** - Utility functions

### Analysis Metrics

1. **Repository Abandonment**
   - Ratio of inactivity days to repository age
   - Threshold: >70% = abandoned

2. **Activity Gaps**
   - Time between commits
   - Detects ghosting patterns

3. **Fork Ratio**
   - Percentage of forked vs original repos
   - Threshold: >70% = fork-heavy

4. **Language Spread**
   - Number of languages used
   - Avg files per language
   - Threshold: >8 languages, <2 files/language = too spread

5. **Code Quality**
   - Cyclomatic complexity estimation
   - Duplication percentage
   - README quality

6. **Engagement**
   - PR-to-commit ratio
   - Issue resolution rate
   - Community interaction

### Roast Rules

Each roast is tied to specific metrics:

- **abandoned_repos** - Repos inactive >2 years
- **activity_gaps** - Long periods without commits
- **fork_heavy** - >70% forked repositories
- **language_spread** - Too many languages, shallow usage
- **low_engagement** - Minimal PR/issue activity
- **no_documentation** - >30% repos without README
- **cyclomatic_complexity** - Complex code
- **slow_repo** - Average commit gap >90 days

### Scoring

**Overall Score** (0-100):
- Critical issues: 1.5x weight
- Warning issues: 1x weight
- Info issues: 0.5x weight
- Capped at 100

## Caching

- **TTL**: 1 hour per username
- **Invalidation**: Clear with `force=true` parameter
- **Storage**: In-memory (can be upgraded to Redis)

## Error Handling

- **404**: User not found or private profile
- **429**: GitHub API rate limit
- **400**: Invalid username format
- **504**: Analysis timeout (>30s)
- **500**: Internal server error

## Rate Limiting

- 10 requests per minute per IP
- GitHub API rate limit: 5000 requests/hour

## Logging

- **Format**: JSON structured logs (Pino)
- **Levels**: trace, debug, info, warn, error, fatal
- **Dev Mode**: Pretty-printed console output
- **Prod Mode**: JSON to stdout

## Environment Variables

```env
GITHUB_TOKEN=ghp_...                    # Required: GitHub Personal Access Token
PORT=3000                               # Server port
NODE_ENV=development|production|test    # Environment
LOG_LEVEL=info                          # Logging level
REDIS_URL=redis://localhost:6379        # Optional: Redis for caching
RATE_LIMIT_REQUESTS=10                  # Requests per window
RATE_LIMIT_WINDOW_MS=60000              # Rate limit window in ms
ANALYSIS_TIMEOUT_MS=30000               # Max analysis duration
GITHUB_GRAPHQL_TIMEOUT=10000            # GraphQL timeout
```

## Development Tips

### Debug Analysis
```bash
# Enable debug logging
DEBUG=* npm run dev
```

### Test User Analysis
```bash
curl -X POST http://localhost:3000/api/v1/analyze/torvalds
```

### Check Rate Limits
```bash
curl http://localhost:3000/api/v1/health
```

## Performance

- Median roast generation: <10 seconds
- GitHub API calls: <2 seconds
- Static analysis: <3 seconds
- Cache hit: <100ms

## Security

✅ Rate limiting
✅ Input validation
✅ GitHub token in environment variables (never committed)
✅ CORS configuration
✅ Sanitized logging (no sensitive data)
✅ Error messages don't leak internals (dev mode only)

## Future Enhancements

- [ ] Redis caching layer
- [ ] Deep AST parsing for complexity analysis
- [ ] Machine learning for predictive metrics
- [ ] GitHub webhook integration
- [ ] Multi-language support for code analysis
- [ ] Historical trend analysis
- [ ] Batch user analysis
- [ ] Webhook notifications
- [ ] Database persistence

## License

MIT
