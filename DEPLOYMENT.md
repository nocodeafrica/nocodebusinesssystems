# Deployment Guide - Horizon Systems

This guide covers deployment strategies for Horizon Systems across different platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Deployment Platforms](#deployment-platforms)
   - [Vercel (Recommended)](#vercel-recommended)
   - [Docker](#docker)
   - [Kubernetes](#kubernetes)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Zero-Downtime Deployment](#zero-downtime-deployment)
6. [Monitoring & Logging](#monitoring--logging)
7. [Rollback Procedures](#rollback-procedures)

## Prerequisites

- Node.js 18+ installed locally
- Git repository set up
- Supabase project configured
- Mapbox account with API token
- Domain name configured (for production)

## Environment Variables

### Required Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://sjbvvrjxsbqrgtpgdxwr.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SECRET_KEY=your_secret_key

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# Application
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### Optional Variables

```bash
# OpenAI (for AI features)
OPENAI_API_KEY=your_openai_key

# Feature Flags
NEXT_PUBLIC_ENABLE_3D_MODELS=true
NEXT_PUBLIC_ENABLE_AI_FEATURES=false
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## Deployment Platforms

### Vercel (Recommended)

Vercel provides the easiest deployment path with automatic CI/CD.

#### Initial Setup

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Link Project**
   ```bash
   vercel link
   ```

4. **Add Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY production
   vercel env add SUPABASE_SECRET_KEY production
   vercel env add NEXT_PUBLIC_MAPBOX_TOKEN production
   ```

#### Deployment

**Production Deployment:**
```bash
vercel --prod
```

**Preview Deployment:**
```bash
vercel
```

#### Automatic Deployments

Push to `main` branch triggers automatic production deployment via GitHub Actions.

```yaml
# .github/workflows/deploy.yml
# Already configured in your project
```

#### Vercel Configuration

The `vercel.json` file includes:
- Build commands
- Environment variable references
- Security headers
- Cache control for assets
- Rewrites and redirects

### Docker

For containerized deployments on any platform.

#### Build Docker Image

```bash
# Build image
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
  --build-arg NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY \
  --build-arg NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN \
  --build-arg NEXT_PUBLIC_APP_URL=https://yourdomain.com \
  -t horizon-systems:latest .
```

#### Run Container Locally

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
  -e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY \
  -e SUPABASE_SECRET_KEY=$SUPABASE_SECRET_KEY \
  -e NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN \
  horizon-systems:latest
```

#### Docker Compose

For full stack with Nginx reverse proxy:

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Push to Registry

```bash
# Tag image
docker tag horizon-systems:latest registry.example.com/horizon-systems:latest

# Push to registry
docker push registry.example.com/horizon-systems:latest
```

### Kubernetes

For scalable, production-grade deployments.

#### Create Kubernetes Manifests

**1. Namespace**
```bash
kubectl create namespace horizon-systems
```

**2. Secrets**
```bash
kubectl create secret generic horizon-secrets \
  --from-literal=NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
  --from-literal=NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY \
  --from-literal=SUPABASE_SECRET_KEY=$SUPABASE_SECRET_KEY \
  --from-literal=NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN \
  --namespace=horizon-systems
```

**3. Deployment**

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: horizon-systems
  namespace: horizon-systems
spec:
  replicas: 3
  selector:
    matchLabels:
      app: horizon-systems
  template:
    metadata:
      labels:
        app: horizon-systems
    spec:
      containers:
      - name: app
        image: registry.example.com/horizon-systems:latest
        ports:
        - containerPort: 3000
        envFrom:
        - secretRef:
            name: horizon-secrets
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

**4. Service**

Create `k8s/service.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: horizon-systems-service
  namespace: horizon-systems
spec:
  selector:
    app: horizon-systems
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

**5. Ingress**

Create `k8s/ingress.yaml`:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: horizon-systems-ingress
  namespace: horizon-systems
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - yourdomain.com
    secretName: horizon-tls
  rules:
  - host: yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: horizon-systems-service
            port:
              number: 80
```

**6. Deploy to Kubernetes**

```bash
kubectl apply -f k8s/
```

**7. Monitor Deployment**

```bash
# Check pods
kubectl get pods -n horizon-systems

# Check logs
kubectl logs -f deployment/horizon-systems -n horizon-systems

# Check service
kubectl get svc -n horizon-systems
```

## CI/CD Pipeline

### GitHub Actions

Two workflows are configured:

#### 1. Continuous Integration (`.github/workflows/ci.yml`)

Runs on every push and PR:
- Linting
- Type checking
- Build verification

#### 2. Deployment (`.github/workflows/deploy.yml`)

Runs on push to `main`:
- Build production artifacts
- Deploy to Vercel

### Required GitHub Secrets

Add these secrets in GitHub repository settings:

```
VERCEL_TOKEN              # Vercel deployment token
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
NEXT_PUBLIC_MAPBOX_TOKEN
OPENAI_API_KEY           # Optional
```

## Zero-Downtime Deployment

### Strategy

1. **Blue-Green Deployment** (Kubernetes)
   - Deploy new version alongside old
   - Switch traffic once health checks pass
   - Keep old version for quick rollback

2. **Rolling Update** (Default)
   - Gradually replace instances
   - Maintain minimum availability
   - Automatic rollback on failure

### Health Checks

Create `/app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check critical dependencies
    const checks = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
    };

    return NextResponse.json(checks, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: 'Health check failed' },
      { status: 503 }
    );
  }
}
```

## Monitoring & Logging

### Vercel Analytics

Enable in Vercel dashboard:
- Real-time traffic monitoring
- Performance metrics
- Error tracking

### Application Monitoring

#### Logs

**Vercel:**
```bash
vercel logs
```

**Docker:**
```bash
docker-compose logs -f app
```

**Kubernetes:**
```bash
kubectl logs -f deployment/horizon-systems -n horizon-systems
```

#### Metrics to Monitor

- Response times
- Error rates
- Traffic patterns
- Resource usage (CPU, Memory)
- API endpoint performance
- 3D model load times
- Map rendering performance

### Alerting

Set up alerts for:
- High error rates (>1%)
- Slow response times (>3s p95)
- High CPU usage (>80%)
- High memory usage (>80%)
- Failed deployments

## Rollback Procedures

### Vercel

```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote [deployment-url]
```

### Docker

```bash
# Deploy previous version
docker-compose down
docker-compose up -d horizon-systems:previous-version
```

### Kubernetes

```bash
# Rollback to previous revision
kubectl rollout undo deployment/horizon-systems -n horizon-systems

# Check rollout status
kubectl rollout status deployment/horizon-systems -n horizon-systems

# View rollout history
kubectl rollout history deployment/horizon-systems -n horizon-systems
```

## Performance Optimization

### Build Optimization

1. **Enable Output File Tracing**

   Update `next.config.ts`:
   ```typescript
   output: 'standalone'
   ```

2. **Analyze Bundle Size**
   ```bash
   npm run build
   npx @next/bundle-analyzer
   ```

3. **Optimize Images**
   - Use Next.js Image component
   - Enable automatic WebP conversion
   - Implement lazy loading

### CDN Configuration

- Static assets cached at edge
- 3D models served from Supabase CDN
- Map tiles cached by Mapbox
- API responses not cached

## Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS configured properly
- [ ] Authentication tokens rotated
- [ ] Dependencies updated
- [ ] Secrets not in source code

## Troubleshooting

### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Rebuild
npm run build
```

### Runtime Errors

1. Check environment variables
2. Verify API endpoints
3. Check logs for errors
4. Test database connectivity
5. Verify external service status

### Performance Issues

1. Check bundle size
2. Analyze Lighthouse scores
3. Profile React components
4. Check database query performance
5. Monitor API response times

## Support

For deployment issues:
1. Check logs first
2. Review documentation
3. Contact DevOps team
4. Create support ticket

---

**Last Updated:** 2025-01-20
**Maintained by:** Horizon Systems DevOps Team
