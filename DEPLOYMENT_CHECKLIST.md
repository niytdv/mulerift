# Railway Deployment Checklist

## Pre-Deployment Verification ✅

### Backend Status
- [x] Python engine tested and working
- [x] Python dependencies installed (networkx, pandas, python-dateutil)
- [x] Sample API endpoint functional
- [x] Health check endpoint available

### Frontend Status
- [x] Next.js build successful
- [x] All TypeScript files compile without errors
- [x] Dependencies installed (312 packages)
- [x] No critical diagnostics

### Configuration Files
- [x] `nixpacks.toml` - Python + Node.js setup
- [x] `railway.json` - Railway deployment config
- [x] `python-engine/requirements.txt` - Python dependencies
- [x] `.env.local.example` - Environment variable template

### Cleanup
- [x] Removed 30+ unnecessary documentation files
- [x] Removed test JSON files
- [x] Removed test pages
- [x] Updated .gitignore

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 2. Deploy via Railway Dashboard
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will auto-detect `nixpacks.toml`
6. Wait for build to complete

### 3. Set Environment Variables
In Railway dashboard, add:
- `GROQ_API_KEY` - Get from https://console.groq.com/

### 4. Verify Deployment
Test these endpoints:
- `https://your-app.railway.app/` - Home page
- `https://your-app.railway.app/api/health` - Health check
- `https://your-app.railway.app/api/sample` - Sample analysis (POST)

## Alternative: Railway CLI Deployment

```bash
# Install CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Set environment variables
railway variables set GROQ_API_KEY=your_key_here

# View logs
railway logs
```

## Post-Deployment Testing

1. Visit home page and verify UI loads
2. Click "Run Sample Data" button
3. Verify dashboard loads with 3D graph
4. Test AI chat (requires GROQ_API_KEY)
5. Test CSV upload functionality

## Troubleshooting

### Build Fails
- Check Railway logs for Python/Node.js errors
- Verify `nixpacks.toml` is in root directory
- Ensure Python 3.11 is specified

### Runtime Errors
- Check environment variables are set
- Verify Python dependencies installed
- Check logs: `railway logs`

### Python Not Found
- Nixpacks should auto-install Python 3.11
- Check build logs for pip install errors

## Notes

- Build time: ~2-3 minutes
- Python engine processes CSV in <1 second
- Frontend is fully static after build
- Backend APIs are serverless functions
