# Render Python + Node.js Setup - MuleRift

## Current Configuration

### ✅ Requirements File
- **Location**: `python-engine/requirements.txt`
- **Packages**:
  - `networkx>=3.0`
  - `pandas>=2.0.0`
  - `python-dateutil>=2.8.0`

### ✅ Build Command (render.yaml)
```bash
# Create a local directory for Python packages
mkdir -p /opt/render/project/src/.python_packages
# Install Python dependencies to project directory
python3 -m pip install --upgrade pip
python3 -m pip install --target=/opt/render/project/src/.python_packages -r python-engine/requirements.txt
# Install Node dependencies and build Next.js
npm ci
npm run build
```

### ✅ Environment Variables (render.yaml)
- `NODE_VERSION`: 20
- `PYTHON_VERSION`: 3.10.0
- `NODE_ENV`: production
- `GROQ_API_KEY`: (sync: false - set in Render dashboard)
- `PYTHONPATH`: /opt/render/project/src/.python_packages:/opt/render/project/src/python-engine

### ✅ Python Path Validation (lib/pythonBridge.ts)
```typescript
const pythonCommand = process.env.NODE_ENV === 'production' ? 'python3' : 'python';
```
- Uses `python3` in production (Render)
- Uses `python` in development (local)

## How It Works

1. **Build Phase**:
   - Creates `.python_packages` directory in project
   - Installs Python packages using `--target` flag to this directory
   - Packages become part of the deployed project files
   - Installs Node.js dependencies
   - Builds Next.js application

2. **Runtime Phase**:
   - `PYTHONPATH` environment variable tells Python where to find packages
   - Points to both `.python_packages` (dependencies) and `python-engine` (your code)
   - Node.js spawns Python processes using `python3` command
   - Python can import pandas, networkx, etc. from `.python_packages`

## Fraud Detection Logic

**NO CHANGES MADE** - All fraud detection logic remains intact:
- ✅ `python-engine/main.py` - Entry point (unchanged)
- ✅ `python-engine/detectors.py` - Detection algorithms (unchanged)
- ✅ `python-engine/graph_builder.py` - Graph construction (unchanged)
- ✅ `python-engine/ring_grouper.py` - Ring grouping (unchanged)

## Verification Steps

After deployment completes:

1. **Check Build Logs**:
   - Look for "🐍 Installing Python dependencies to project directory..."
   - Verify no errors during pip install

2. **Test API Endpoint**:
   ```bash
   curl https://rift-a4wr.onrender.com/api/health
   ```
   Should return: `{"status": "ok"}`

3. **Test Sample Data**:
   ```bash
   curl -X POST https://rift-a4wr.onrender.com/api/sample
   ```
   Should return analysis results with suspicious accounts and fraud rings

4. **Check Runtime Logs**:
   - No "ModuleNotFoundError: No module named 'pandas'"
   - Successful Python process execution

## Troubleshooting

If pandas error persists:

1. **Verify PYTHONPATH**:
   - Check Render dashboard → Environment Variables
   - Should be: `/opt/render/project/src/.python_packages:/opt/render/project/src/python-engine`

2. **Check Build Logs**:
   - Ensure `.python_packages` directory is created
   - Verify pip install completes successfully
   - Look for "Successfully installed pandas-X.X.X"

3. **Verify Python Version**:
   - Render should use Python 3.10.0
   - Check logs for Python version output

## Why This Solution Works

- **--target flag**: Installs packages to a specific directory in your project
- **Project directory**: Packages are part of deployed files, not system-wide
- **PYTHONPATH**: Tells Python where to find the packages at runtime
- **No system dependencies**: Doesn't rely on Render's system Python packages
- **Persistent**: Packages persist between build and runtime phases

## Alternative Solutions (if needed)

If this still doesn't work, consider:

1. **Separate Python Service**: Deploy Python backend separately on Render as a Python web service
2. **Docker**: Use Docker deployment with both Node and Python in the same container
3. **Serverless Functions**: Move Python logic to AWS Lambda or similar

## Summary

✅ Requirements file exists with all dependencies
✅ Build command installs Python packages to project directory
✅ PYTHONPATH configured to find packages at runtime
✅ Python command uses `python3` in production
✅ Environment variables set (NODE_VERSION, PYTHON_VERSION, NODE_ENV)
✅ No fraud detection logic changed

**Deployment should now work!**
