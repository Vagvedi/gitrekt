# Deployment Guide

Complete instructions for deploying Gitrekt to production.

## Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] GitHub token created (has public_repo scope)
- [ ] Backend builds without errors
- [ ] Frontend builds without errors
- [ ] API tested locally
- [ ] Frontend tested against local API
- [ ] README updated with your domain
- [ ] Error tracking (Sentry) configured
- [ ] Monitoring/logging set up

## Option 1: Railway.app (Recommended)

### Setup Backend

1. **Create Railway Account**
   - Visit [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**
   - Click "Create"
   - Select "GitHub Repo"
   - Connect your gitrekt repo

3. **Add Node.js Service**
   - Railway auto-detects Node.js in `/backend`
   - Add environment variables:
     ```
     GITHUB_TOKEN=ghp_...
     NODE_ENV=production
     PORT=3000
     ```

4. **Deploy**
   - Push to main branch
   - Railway auto-deploys
   - Get production URL (e.g., `gitrekt-api.railway.app`)

### Setup Frontend (Vercel)

1. **Create Vercel Account**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "New Project"
   - Select your gitrekt repo
   - Change root to `frontend/`

3. **Configure**
   - Build command: `npm run build`
   - Output: `dist`
   - Environment variables:
     ```
     VITE_API_URL=https://gitrekt-api.railway.app
     ```

4. **Deploy**
   - Click Deploy
   - Vercel handles HTTPS, CDN, etc.

## Option 2: Heroku (Legacy)

### Backend

```bash
# Create app
heroku create gitrekt-api

# Set environment variables
heroku config:set GITHUB_TOKEN=ghp_...
heroku config:set NODE_ENV=production

# Deploy
git push heroku main:main

# Check logs
heroku logs --tail
```

### Frontend

Deploy to Vercel (same as above) or GitHub Pages.

## Option 3: Self-Hosted (VPS)

### Requirements
- Ubuntu 20.04+ server
- 2GB RAM, 1 vCPU minimum
- Domain name (optional, but recommended)
- SSL certificate (Let's Encrypt)

### Backend Setup

```bash
# SSH into server
ssh user@your-server.com

# Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt-get install -y nodejs

# Clone repo
git clone https://github.com/YOUR-USERNAME/gitrekt.git
cd gitrekt

# Install dependencies
npm install

# Create .env
cd backend
cat > .env << EOF
GITHUB_TOKEN=ghp_...
PORT=3000
NODE_ENV=production
LOG_LEVEL=info
EOF

# Build
npm run build

# Start with PM2
npm install -g pm2
pm2 start dist/index.js --name gitrekt-api
pm2 save
pm2 startup

# Verify running
pm2 status
curl http://localhost:3000/api/v1/health
```

### Frontend Setup

```bash
# Build frontend
cd ../frontend
npm run build

# Install nginx
sudo apt-get install -y nginx

# Copy build to nginx
sudo cp -r dist /var/www/html/gitrekt

# Configure nginx
sudo tee /etc/nginx/sites-available/gitrekt > /dev/null << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/html/gitrekt;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/gitrekt /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup HTTPS (Let's Encrypt)
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Monitoring

```bash
# Setup log rotation
sudo tee /etc/logrotate.d/gitrekt > /dev/null << 'EOF'
/home/user/gitrekt/backend/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 user user
    sharedscripts
}
EOF

# Check system resources
htop
```

## Option 4: Docker Deployment

### Build Images

```bash
# Backend
docker build -f backend/Dockerfile -t gitrekt-backend:latest .
docker run -e GITHUB_TOKEN=ghp_... -p 3000:3000 gitrekt-backend

# Frontend
docker build -f frontend/Dockerfile -t gitrekt-frontend:latest .
docker run -p 80:80 gitrekt-frontend
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    environment:
      GITHUB_TOKEN: ${GITHUB_TOKEN}
      NODE_ENV: production
      PORT: 3000
    ports:
      - "3000:3000"
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile
    ports:
      - "80:80"
    restart: unless-stopped
    depends_on:
      - backend
```

Deploy with:
```bash
docker-compose up -d
```

## Option 5: AWS (ECS + S3)

### Backend (ECS)

1. Create ECR repository
2. Build and push Docker image
3. Create ECS cluster
4. Create task definition with environment variables
5. Create service with load balancer

### Frontend (S3 + CloudFront)

1. Upload `dist/` to S3
2. Create CloudFront distribution
3. Set S3 origin
4. Add behavior for `/api` → backend ALB
5. Point domain via Route53

## Environment Variables Checklist

### Backend

```env
# Required
GITHUB_TOKEN=ghp_xxxxxxxxxxxx

# Recommended
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW_MS=60000
ANALYSIS_TIMEOUT_MS=30000
GITHUB_GRAPHQL_TIMEOUT=10000

# Optional
REDIS_URL=redis://hostname:port
SENTRY_DSN=https://xxx@sentry.io/123
```

### Frontend

```env
# Optional (defaults to /api)
VITE_API_URL=https://api.gitrekt.dev
```

## DNS Configuration

### Domain Setup

```
Type    Name           Value
A       gitrekt.dev    1.2.3.4 (server IP or LB IP)
CNAME   www            gitrekt.dev
CNAME   api            gitrekt-api.railway.app (if separate)
```

### SSL/TLS

- **Let's Encrypt** (self-hosted): Automatic renewal with certbot
- **AWS ACM** (AWS): Free, automatic
- **Cloudflare** (free tier): Proxied SSL

## Monitoring & Logging

### Error Tracking (Sentry)

```bash
# Backend
npm install @sentry/node

# Set environment variable
SENTRY_DSN=https://xxx@sentry.io/123
```

### Application Performance Monitoring

- **Backend**: Use PM2 monitoring
- **Frontend**: Web Vitals tracking
- **Database**: Monitor if using Redis

### Log Aggregation

- **Self-hosted**: ELK stack
- **Managed**: Loggly, Datadog, Splunk
- **Simple**: tail logs from PM2

## Health Checks

### Automated Monitoring

```bash
# Uptime monitoring
# Use Uptime Robot or similar

GET https://api.gitrekt.dev/api/v1/health
# Should return 200 with { status: "ok" }

GET https://gitrekt.dev
# Should return 200 with frontend HTML
```

### Manual Testing

```bash
# Test API
curl -X POST https://api.gitrekt.dev/api/v1/analyze/torvalds \
  -H "Content-Type: application/json"

# Check response time
time curl https://gitrekt.dev
```

## Performance Optimization

### Backend

- ✅ Enable gzip compression
- ✅ Use HTTP/2
- ✅ Cache GitHub API responses
- ✅ Implement rate limiting
- ✅ Use connection pooling

### Frontend

- ✅ Enable Gzip compression (nginx/CDN)
- ✅ Use CDN for assets
- ✅ Enable HTTP/2
- ✅ Cache busting with hashes
- ✅ Minify JS/CSS

### Database (if using Redis)

- ✅ TTL for cache entries
- ✅ Memory limits
- ✅ Persistence (AOF)
- ✅ Replication for HA

## Disaster Recovery

### Backups

- **Code**: Git repository (GitHub)
- **Configuration**: Version control `.env` template
- **Cache**: Can be regenerated from GitHub API
- **Logs**: Stored in separate service

### Failover

- **Backend**: Multi-region deployment with RTO < 5 minutes
- **Frontend**: CDN handles static files
- **Database**: Redis replication across regions

## Scaling

### Vertical Scaling (Upgrade Server)
- Increase RAM for Node.js heap
- Increase CPU cores for parallel processing

### Horizontal Scaling (Multiple Instances)
```nginx
# Load balancing
upstream backend {
    server backend1:3000;
    server backend2:3000;
    server backend3:3000;
}

server {
    location /api {
        proxy_pass http://backend;
    }
}
```

## Security Hardening

- [ ] Enable HTTPS only (redirect HTTP)
- [ ] Set security headers
- [ ] Enable CORS properly
- [ ] Rate limit by IP
- [ ] Sanitize logs (no tokens)
- [ ] Use managed secrets (GitHub Secrets, AWS Secrets Manager)
- [ ] Enable 2FA on GitHub account
- [ ] Regular dependency updates
- [ ] WAF rules if behind Cloudflare/AWS

## Post-Deployment

1. **Test Everything**
   - Submit test username to frontend
   - Check email notifications (if configured)
   - Monitor error logs

2. **Setup Monitoring**
   - Configure error tracking
   - Setup performance monitoring
   - Create uptime alerts

3. **Document**
   - Write runbook for deployments
   - Document incident procedures
   - Create troubleshooting guide

4. **Continuous Deployment**
   ```bash
   # GitHub Actions workflow
   git push origin main
   # → Automatically tests
   # → Builds Docker images
   # → Deploys to production
   ```

## Troubleshooting

### Backend won't start
```bash
# Check logs
pm2 logs gitrekt-api

# Verify environment
echo $GITHUB_TOKEN

# Test locally
npm run dev
```

### Frontend loads but API calls fail
```bash
# Check CORS headers
curl -H "Origin: https://gitrekt.dev" http://localhost:3000/api/v1/health -v

# Verify proxy configuration (nginx/Railway)
# Check API URL in environment variables
```

### High memory usage
```bash
# Monitor heap size
node --max-old-space-size=1024 dist/index.js

# Check for memory leaks
pm2 monit
```

## Costs

### Typical Monthly Costs

- **Railway**: $5-50 depending on usage
- **Vercel**: Free tier or $20+ if needed
- **Heroku**: Discontinued (use Railway instead)
- **Self-hosted VPS**: $5-50/month
- **AWS**: $10-100 depending on load
- **Redis Cloud**: $15+ if using Redis
- **Domain**: $10-15/year

## Support

- Documentation: See ARCHITECTURE.md, backend/README.md, frontend/README.md
- Issues: GitHub Issues
- Email: support@gitrekt.dev

---

**Congratulations! Your Gitrekt deployment is live! 🎉**
