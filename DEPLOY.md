# CargoNode Deployment Guide

## Frontend (Vercel)

### Prerequisites
- GitHub repository with frontend code pushed
- Vercel account (free tier works for testing)
- Backend API deployed and accessible (see Backend section)

### Vercel Project Setup

1. **Link GitHub Repository**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New Project"
   - Import your CargoNode GitHub repository
   - Select the `frontend` directory as the root directory
   - Framework preset will auto-detect Next.js 15

2. **Configure Environment Variables**
   
   Navigate to Project Settings → Environment Variables and add:

   | Variable | Value | Description |
   |----------|-------|-------------|
   | `NEXT_PUBLIC_STELLAR_NETWORK` | `testnet` | Stellar network (testnet/mainnet) |
   | `NEXT_PUBLIC_ESCROW_CONTRACT_ID` | `CAI52UIAHEMT3SNQ2EXOJKHHC2PAGLGURZYNL6HFZJ6LL5KDQFURBQUH` | Soroban escrow contract ID |
   | `NEXT_PUBLIC_API_URL` | `https://your-backend.railway.app/api` | Backend API base URL |
   | `NEXT_PUBLIC_ANALYTICS_URL` | (optional) | Plausible analytics domain |

   **Note**: All frontend environment variables must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application
   - Deployment URL will be available at `https://your-project.vercel.app`

### Vercel Analytics

**Status**: ✅ Enabled

The frontend integrates Vercel Analytics for monitoring:
- Package `@vercel/analytics` v2.0.1 is installed
- Analytics component is included in `src/app/layout.tsx`
- Tracks page views, web vitals, and user interactions
- Access analytics at: Vercel Dashboard → Your Project → Analytics

No additional configuration needed - analytics are automatically enabled for all Vercel deployments.

### CORS Configuration

The backend is configured to accept requests from the Vercel frontend domain:

**Backend Configuration** (`backend/src/index.ts`):
```typescript
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
```

**Required Backend Environment Variable**:
- `FRONTEND_URL=https://your-frontend.vercel.app`

**Important**: After deploying the frontend, update the backend's `FRONTEND_URL` environment variable with the actual Vercel deployment URL to enable CORS.

### Deployment URL

After successful deployment:
- **Production URL**: `https://your-project.vercel.app` (or custom domain)
- **Preview URLs**: Automatically generated for each Git branch/PR
- **Deployment Dashboard**: `https://vercel.com/your-org/your-project`

### Continuous Deployment

Vercel automatically deploys:
- **Production**: When you push to the `main` branch
- **Preview**: When you create a pull request or push to other branches

### Verification Checklist

After deployment, verify:
- ✅ Frontend loads at the Vercel URL
- ✅ API calls to backend succeed (check browser console)
- ✅ No CORS errors in browser console
- ✅ Vercel Analytics tracking page views (check Vercel dashboard)
- ✅ Stellar wallet connection works (Freighter)
- ✅ Smart contract interactions function properly

### Troubleshooting

**CORS Errors**:
- Ensure backend `FRONTEND_URL` matches your Vercel deployment URL exactly
- Check that backend is deployed and accessible
- Verify backend CORS middleware allows your frontend origin

**Environment Variables Not Working**:
- Verify all frontend env vars start with `NEXT_PUBLIC_`
- Redeploy after changing environment variables
- Check Vercel deployment logs for build errors

**Build Failures**:
- Check Vercel deployment logs for specific errors
- Verify all dependencies are in `package.json`
- Ensure Next.js version compatibility (currently 15.2.6)

## Backend (Railway)

### Project Configuration

**Project ID:** `5cc5d4b8-aa32-4e6a-b0c9-d3538b20add0`

### Important: Monorepo Configuration

This is a monorepo with `backend/` and `frontend/` directories. Railway needs to be configured to build and deploy from the `backend/` directory.

**Option 1: Set Root Directory in Railway Dashboard (Recommended)**
1. Go to Railway dashboard → Your service → Settings
2. Set "Root Directory" to `backend`
3. Railway will use the `backend/railway.toml` configuration

**Option 2: Use Root-Level railway.toml**
A `railway.toml` file at the repository root is configured to build from the backend directory:
```toml
[build]
builder = "nixpacks"
buildCommand = "cd backend && npm install && npm run build"

[deploy]
startCommand = "cd backend && node dist/index.js"
```

### Quick Start

1. Push to GitHub
2. Import repository in Railway
3. **Set root directory to `backend/` in Railway dashboard** (Settings → Root Directory)
4. Configure environment variables (see below)
5. Add PostgreSQL database plugin
6. Deploy

### Environment Variables

**Required Variables:**

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port (auto-set by Railway) | `3001` |
| `FRONTEND_URL` | CORS allowed origin(s), comma-separated | `https://cargonode.vercel.app` |
| `STELLAR_NETWORK` | Stellar network environment | `testnet` or `mainnet` |
| `ESCROW_CONTRACT_ID` | Deployed escrow contract ID | `CAI52...BQUH` |
| `USDC_CONTRACT_ID` | USDC token contract ID | `CAATNN...2FW5` |
| `DATABASE_URL` | PostgreSQL connection string (auto-set by Railway) | `postgresql://user:pass@host:5432/railway` |
| `LOG_LEVEL` | Logging verbosity | `info`, `debug`, `error` |
| `NODE_ENV` | Node environment | `production` |

**Optional Variables:**

| Variable | Description | Default |
|----------|-------------|---------|
| `SOROBAN_RPC_URL` | Custom Soroban RPC endpoint | `https://soroban-testnet.stellar.org` |

### Railway Configuration (`railway.toml`)

```toml
[build]
builder = "dockerfile"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "node dist/index.js"
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3

[deploy.healthcheck]
path = "/api/health"
timeout = 30
interval = 60
```

**Configuration Details:**
- **Build:** Uses Dockerfile for consistent builds
- **Restart Policy:** Automatic restart on failure, max 3 retries
- **Health Check:** `/api/health` endpoint checked every 60 seconds
- **Health Check Timeout:** 30 seconds

### PostgreSQL Database Setup

1. **Add PostgreSQL Plugin:**
   - In Railway dashboard, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway automatically sets `DATABASE_URL` environment variable

2. **Database Migration:**
   - Migrations run automatically on startup via `src/index.ts`
   - Tables created: `users`, `shipments`, `shipments_history`
   - Indexes created for optimal query performance

3. **Connection Details:**
   - The app uses connection pooling via `pg` package
   - Pool configuration is automatic from `DATABASE_URL`

### Health Check Endpoints

The backend provides two monitoring endpoints:

#### `/api/health`
Basic health check endpoint for Railway monitoring.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "network": "testnet"
}
```

#### `/api/metrics`
Comprehensive system metrics and telemetry endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "system": {
    "uptime_seconds": 3600,
    "memory_heap_used_mb": "45.23",
    "memory_rss_mb": "98.45",
    "node_version": "v20.10.0",
    "platform": "linux"
  },
  "telemetry": {
    "total_requests": 1234,
    "total_errors": 5,
    "error_rate_pct": 0.41,
    "avg_latency_ms": 45.67
  },
  "database": {
    "pool_total_connections": 10,
    "pool_idle_connections": 8,
    "pool_waiting_clients": 0,
    "total_shipments_stored": 42
  },
  "network": {
    "stellar_network": "testnet",
    "soroban_rpc_url": "https://soroban-testnet.stellar.org",
    "escrow_contract": "CAI52...BQUH"
  }
}
```

### Deployment Steps

1. **Initial Setup:**
   ```bash
   # Ensure you're in the project root
   cd CargoNode
   
   # Make sure backend builds successfully
   cd backend
   npm install
   npm run build
   ```

2. **Railway Setup:**
   - Connect GitHub repository to Railway
   - Create new project (or use existing: `5cc5d4b8-aa32-4e6a-b0c9-d3538b20add0`)
   - Set root directory to `backend/`
   - Add PostgreSQL database plugin

3. **Configure Environment:**
   - Set all required environment variables in Railway dashboard
   - Verify `DATABASE_URL` is automatically set by PostgreSQL plugin
   - Update `FRONTEND_URL` with your Vercel deployment URL

4. **Deploy:**
   - Push to GitHub triggers automatic deployment
   - Monitor deployment logs in Railway dashboard
   - Verify health check passes: `curl https://your-backend.railway.app/api/health`

5. **Verify Deployment:**
   ```bash
   # Check health
   curl https://your-backend.railway.app/api/health
   
   # Check metrics
   curl https://your-backend.railway.app/api/metrics
   
   # Test CORS
   curl -H "Origin: https://your-frontend.vercel.app" \
        https://your-backend.railway.app/api/health
   ```

### Troubleshooting

**Database Connection Issues:**
- Verify `DATABASE_URL` is set correctly
- Check PostgreSQL plugin is active
- Review logs for connection errors

**Health Check Failures:**
- Ensure `/api/health` endpoint is accessible
- Check server is listening on correct PORT
- Verify no startup errors in logs

**CORS Errors:**
- Verify `FRONTEND_URL` matches your frontend domain exactly
- Include protocol (`https://`)
- For multiple origins, use comma separation

**Build Failures:**
- Check Dockerfile exists and is valid
- Verify TypeScript compiles locally: `npm run build`
- Review build logs for dependency issues

### Monitoring & Logs

- **Structured Logging:** All logs are in JSON format (Pino)
- **Request Logging:** Every HTTP request logged with duration
- **Error Tracking:** Errors logged with stack traces
- **Metrics:** Real-time metrics available at `/api/metrics`

**View Logs:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# View logs
railway logs
```

---

## Railway Configuration Verification Checklist

### ✅ Configuration Files

- [x] `backend/railway.toml` exists and contains:
  - Project ID: `5cc5d4b8-aa32-4e6a-b0c9-d3538b20add0`
  - Docker build configuration
  - Restart policy: `on_failure` with max 3 retries
  - Health check endpoint: `/api/health`
  - Health check timeout: 30s, interval: 60s

- [x] `backend/Dockerfile` exists with:
  - Multi-stage build (builder + runtime)
  - Node 20 Alpine base image
  - Production optimizations
  - Port 3001 exposed

- [x] `backend/.env.example` documents all required variables:
  - `PORT`
  - `FRONTEND_URL`
  - `STELLAR_NETWORK`
  - `ESCROW_CONTRACT_ID`
  - `USDC_CONTRACT_ID`
  - `DATABASE_URL`
  - `LOG_LEVEL`
  - `NODE_ENV`

### ✅ Health Check Endpoints

Both endpoints are implemented in `backend/src/index.ts`:

**`GET /api/health`**
- Returns: `{ status, timestamp, version, network }`
- Used by Railway health checks
- Responds with 200 OK when service is running

**`GET /api/metrics`**
- Returns comprehensive system metrics
- Includes: system stats, telemetry, database pool, network config
- Checks database connectivity with shipment count query
- Returns 500 on database connection failure

### ✅ PostgreSQL Database Configuration

**Connection Setup (`backend/src/db/index.ts`):**
- Uses `pg.Pool` for connection pooling
- Reads `DATABASE_URL` from environment
- Production pool size: 10 connections (configurable via `DB_POOL_MAX`)
- Development pool size: 20 connections
- Connection timeout: 5 seconds
- Idle timeout: 30 seconds
- SSL enabled in production with `rejectUnauthorized: false`
- Error handler exits process on unexpected database errors

**Auto-Migration on Startup:**
- Migrations run automatically in `src/index.ts` `start()` function
- Creates tables: `users`, `shipments`, `shipments_history`
- Creates indexes for performance optimization
- Migration errors are logged but don't prevent startup

**Database Schema:**
- `users` table: Stores shipper and driver accounts
- `shipments` table: Main shipment records with status tracking
- `shipments_history` table: Audit log of status changes
- Proper foreign key relationships and constraints
- UUID primary keys with `gen_random_uuid()`

### ✅ Environment Variables Configuration

**Required for Railway:**

| Variable | Status | Description |
|----------|--------|-------------|
| `PORT` | Auto-set by Railway | Server port (defaults to 3001) |
| `DATABASE_URL` | Auto-set by PostgreSQL plugin | Full PostgreSQL connection string |
| `FRONTEND_URL` | Must set manually | CORS allowed origin (Vercel URL) |
| `STELLAR_NETWORK` | Must set manually | `testnet` or `mainnet` |
| `ESCROW_CONTRACT_ID` | Must set manually | Deployed escrow contract ID |
| `USDC_CONTRACT_ID` | Must set manually | USDC token contract ID |
| `LOG_LEVEL` | Optional | Defaults to `info` |
| `NODE_ENV` | Set to `production` | Enables production optimizations |

### ✅ Restart Policy Verification

**Current Configuration:**
```toml
[deploy]
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
```

**Behavior:**
- Service automatically restarts on crashes/failures
- Maximum 3 restart attempts before marking as failed
- Manual restart available in Railway dashboard
- Health check failures trigger restarts

### ✅ CORS Configuration

**Implementation (`backend/src/index.ts`):**
- Reads `FRONTEND_URL` environment variable
- Supports comma-separated multiple origins
- Allows requests with no origin (mobile apps, curl)
- Credentials enabled for cookie-based auth
- Rejects origins not in allowlist

**Example Configuration:**
```bash
# Single origin
FRONTEND_URL=https://cargonode.vercel.app

# Multiple origins
FRONTEND_URL=https://cargonode.vercel.app,https://staging.cargonode.vercel.app
```

### ✅ Logging & Monitoring

**Request Logging:**
- Every HTTP request logged with: method, URL, status, duration, IP
- Structured JSON format via Pino logger
- Child logger per module for context

**Telemetry Counters:**
- `totalRequests`: Total HTTP requests served
- `totalErrors`: Requests with 4xx/5xx status
- `latencySumMs`: Cumulative request duration
- Error rate and average latency calculated in `/api/metrics`

**System Monitoring:**
- Process uptime tracking
- Memory usage (heap and RSS)
- Node version and platform info
- Database pool statistics

### ✅ Security Configuration

**Production Settings:**
- SSL/TLS enabled for database connections
- CORS origin validation
- Environment-based configuration (no hardcoded secrets)
- Structured error handling (no sensitive data in responses)
- Process exit on critical database errors

### Testing Backend Deployment on Railway

#### Pre-Deployment Local Testing

Before deploying to Railway, test the build locally:

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Build the application
npm run build

# Start the server (ensure PostgreSQL is running and DATABASE_URL is set)
npm start
```

#### Testing Endpoints Locally

```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Expected response:
# {"status":"ok","timestamp":"2024-01-15T10:30:00.000Z","version":"1.0.0","network":"testnet"}

# Test metrics endpoint
curl http://localhost:3001/api/metrics

# Test CORS configuration
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:3001/api/health
```

#### Testing Railway Deployment

After deploying to Railway:

```bash
# Replace YOUR_RAILWAY_URL with your actual Railway deployment URL

# Test health endpoint
curl https://YOUR_RAILWAY_URL/api/health

# Test metrics endpoint
curl https://YOUR_RAILWAY_URL/api/metrics

# Test CORS from your Vercel frontend domain
curl -H "Origin: https://your-frontend.vercel.app" \
     https://YOUR_RAILWAY_URL/api/health

# Test shipments endpoint (requires authentication)
curl https://YOUR_RAILWAY_URL/api/shipments
```

#### Deployment Verification Checklist

After Railway deployment, verify:

- [ ] **Health Check:** `/api/health` returns `{"status":"ok",...}`
- [ ] **Metrics Endpoint:** `/api/metrics` returns system metrics with database connection count
- [ ] **Database Connection:** Metrics show `total_shipments_stored` (indicates DB is connected)
- [ ] **Environment Variables:** All required variables are set in Railway dashboard
- [ ] **PostgreSQL Plugin:** Database plugin is added and `DATABASE_URL` is auto-set
- [ ] **Restart Policy:** Service restarts automatically on failure (check Railway logs after manual crash)
- [ ] **CORS Configuration:** Frontend can make API requests without CORS errors
- [ ] **Build Logs:** No errors in Railway build logs
- [ ] **Runtime Logs:** Application starts successfully and logs show "CargoNode API running on port..."
- [ ] **Health Check Status:** Railway dashboard shows green health status

## Smart Contract (Stellar Testnet)

```bash
cd contracts
stellar contract build
stellar contract deploy \
  --wasm target/wasm32v1-none/release/cargonode_escrow.wasm \
  --source-account deployer \
  --network testnet \
  -- \
  --deployer <DEPLOYER_ADDRESS> \
  --token-address <TOKEN_ADDRESS>
```

## Database Setup

```bash
# Connect to PostgreSQL
psql postgresql://user:pass@host:5432/dbname

# Run migration
cd backend
npm run db:migrate
```

## Monitoring

- Backend logs: Pino structured logging (JSON in production)
- Request logging: All HTTP requests with method, URL, status, duration
- Health check: GET /api/health
