# MuleRift - Fraud Detection Platform

A Next.js application for fraud detection and analysis with 3D graph visualization.

## Prerequisites

- Node.js 18+ 
- Python 3.11+
- npm or yarn

## Local Development

1. Install dependencies:
```bash
npm install
pip install -r python-engine/requirements.txt
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local and add your GROQ_API_KEY
```

3. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Railway

### Option 1: Using Railway CLI

1. Install Railway CLI:
```bash
npm i -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Initialize and deploy:
```bash
railway init
railway up
```

4. Set environment variables:
```bash
railway variables set GROQ_API_KEY=your_api_key_here
```

### Option 2: Using Railway Dashboard

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect the configuration from `nixpacks.toml`
5. Add environment variable: `GROQ_API_KEY`
6. Deploy!

## Environment Variables

Required:
- `GROQ_API_KEY` - Get from [console.groq.com](https://console.groq.com/)

Optional:
- `NODE_ENV` - Set to `production` for production builds

## Tech Stack

- Next.js 16
- React 18
- TypeScript
- Python 3.11 (NetworkX, Pandas)
- Three.js & react-force-graph-3d
- D3.js
- Tailwind CSS
- GSAP

## Features

- CSV transaction upload and analysis
- 3D graph visualization of fraud rings
- AI-powered chat assistant (Groq/Llama)
- Real-time fraud detection
- Explainable risk scoring
