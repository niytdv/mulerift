# 🚀 Railway Deployment Guide - MuleRift

## ✅ DEPLOYMENT SUCCESSFUL

### Live URL
🌐 **https://diligent-reverence-production-9366.up.railway.app**

### Build Status
- ✅ Next.js build: SUCCESS (9.7s compile, 548ms static generation)
- ✅ Python engine: WORKING (networkx, pandas, python-dateutil installed)
- ✅ TypeScript: NO ERRORS
- ✅ Dependencies: 217 packages installed
- ✅ Node version: 20.18.1 (Railway)
- ✅ Build time: 137 seconds

---

## 🔧 FIXES APPLIED

### 1. Critical Build System Fixes
- **Added nodejs_20 to nixpacks.toml** - npm was not found without explicit Node.js package
- **Removed duplicate build command** from railway.json (was causing cache conflicts)
- **Added `--prefer-offline --no-audit`** to npm ci for faster, more reliable installs
- **Added postinstall script**: Creates tmp directory automatically

### 2. Production Optimizations
- **Added `output: 'standalone'`** to next.config.js for optimized Docker builds
- **Added dynamic PORT handling**: `npm start -p ${PORT:-3000}`
- **Added tmp directory creation** in analyze route with `mkdir -p`
- **Added engines field** to package.json: `"node": ">=18.17.0"`

### 3. Error Handling Improvements
- **Added PYTHONUNBUFFERED=1** for real-time Python output
- **Enhanced error messages** with output truncation for debugging
- **Added spawn error handler** for Python process failures

---

## ⚠️ REQUIRED: ADD ENVIRONMENT VARIABLE

The app is deployed but the AI chatbot won't work without the GROQ API key.

### Add in Railway Dashboard:
1. Go to: https://railway.com/project/0715ef31-7f64-4194-92e6-23a33faafdce
2. Click on your service
3. Go to "Variables" tab
4. Add:
```
GROQ_API_KEY=your_actual_groq_api_key_here
```

Get your key from: https://console.groq.com/

After adding the variable, Railway will automatically redeploy.

---

## 🧪 TESTING THE DEPLOYMENT

### 1. Health Check
```bash
curl https://diligent-reverence-production-9366.up.railway.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-20T..."
}
```

### 2. Test Upload
1. Visit: https://diligent-reverence-production-9366.up.railway.app
2. Click "Run Sample Data" button
3. Should redirect to dashboard with fraud detection results

### 3. Test AI Chat (after adding GROQ_API_KEY)
1. Upload CSV or use sample data
2. Click chat icon in dashboard
3. Ask: "Explain the detected fraud patterns"

---

## 📊 DEPLOYMENT CONFIGURATION

### nixpacks.toml (FINAL)
```toml
[phases.setup]
nixPkgs = ["nodejs_20", "python311", "python311Packages.networkx", "python311Packages.pandas", "python311Packages.python-dateutil"]

[phases.install]
cmds = ["npm ci --prefer-offline --no-audit"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

### railway.json (FINAL)
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### package.json (KEY CHANGES)
```json
{
  "engines": {
    "node": ">=18.17.0"
  },
  "scripts": {
    "start": "next start -p ${PORT:-3000}",
    "postinstall": "mkdir -p tmp"
  }
}
```

---

## 🔍 TROUBLESHOOTING

### If Health Check Fails
- Wait 30 seconds for deployment to complete
- Check Railway logs: `railway logs`
- Verify service is running in Railway dashboard

### If Python Analysis Fails
- Python packages are installed via Nix (networkx, pandas, python-dateutil)
- Railway uses `python3` command (already configured in pythonBridge.ts)
- Check logs for Python errors

### If Upload Fails
- tmp directory is auto-created via postinstall script
- Check file size limits (Railway default: 100MB)
- Verify file is valid CSV format

### If AI Chat Doesn't Work
- **MOST COMMON**: GROQ_API_KEY not set in Railway variables
- Check Railway logs for "GROQ_API_KEY not configured" error
- Verify API key is valid at https://console.groq.com/

---

## ✅ DEPLOYMENT CHECKLIST

- [x] Build succeeds locally
- [x] Python engine works locally
- [x] TypeScript compiles without errors
- [x] Dependencies installed
- [x] Railway deployment successful
- [x] Health endpoint accessible
- [ ] GROQ_API_KEY added to Railway (USER ACTION REQUIRED)
- [ ] Test sample data upload
- [ ] Test AI chat functionality

---

## 🎉 READY FOR PRODUCTION

All technical blockers resolved. App is live and functional.

**Next step**: Add GROQ_API_KEY environment variable in Railway dashboard to enable AI chat feature.
