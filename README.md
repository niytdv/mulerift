# MuleRift - AI-Powered Money Mule Detection System

Real-time financial fraud detection using graph-based algorithms and machine learning to identify money laundering networks and suspicious transaction patterns.

## 🚀 Live Demo

**Production URL**: [https://rift-a4wr.onrender.com](https://rift-a4wr.onrender.com)

## 📋 Tech Stack

### Frontend
- **Framework**: Next.js 16.1.6 (React 18.3.1)
- **Visualization**: 
  - react-force-graph-3d (3D network graphs)
  - D3.js (2D visualizations)
  - Three.js (3D rendering)
- **UI/UX**: 
  - TailwindCSS (styling)
  - GSAP (animations)
  - Lucide React (icons)
- **Language**: TypeScript 5.4.5

### Backend
- **Detection Engine**: Python 3.10
- **Graph Analysis**: NetworkX 3.0+
- **Data Processing**: Pandas 2.0+
- **API**: Next.js API Routes (Node.js)
- **AI Chatbot**: Groq API (llama-3.3-70b-versatile)

### Deployment
- **Frontend/Backend**: Render (Node.js environment)
- **CI/CD**: GitHub Actions (automatic deployment)

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface (Next.js)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Upload CSV   │  │ 3D Graph     │  │ AI Chatbot   │     │
│  │ Component    │  │ Visualization│  │ Panel        │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js API Routes                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ /api/analyze │  │ /api/sample  │  │ /api/chat    │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Python Detection Engine (Subprocess)            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  main.py (Entry Point)                               │  │
│  │    ├─ graph_builder.py (Transaction Graph)           │  │
│  │    ├─ detectors.py (Pattern Detection)               │  │
│  │    ├─ ring_grouper.py (Fraud Ring Identification)    │  │
│  │    └─ scoring.py (Risk Score Calculation)            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Analysis Results (JSON)                   │
│  {                                                           │
│    suspicious_accounts: [...],                              │
│    fraud_rings: [...],                                      │
│    summary: {...}                                           │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow
1. **Upload**: User uploads CSV with transaction data
2. **Processing**: Next.js API spawns Python subprocess
3. **Graph Construction**: NetworkX builds directed transaction graph
4. **Pattern Detection**: Algorithms identify cycles, velocity patterns, shell accounts
5. **Ring Grouping**: Connected components form fraud rings
6. **Scoring**: Weighted algorithm calculates suspicion scores
7. **Visualization**: 3D force-directed graph renders results
8. **AI Analysis**: Chatbot provides natural language insights

## 🧮 Algorithm Approach

### 1. Graph Construction
**Complexity**: O(E) where E = number of transactions
- Build directed graph from transaction data
- Nodes: Account IDs
- Edges: Transactions (with amount, timestamp)
- Prune isolated nodes (no connections)

### 2. Cycle Detection (Johnson's Algorithm)
**Complexity**: O((V + E)(C + 1)) where C = number of cycles
- Detects circular money flow patterns
- Identifies layering in money laundering
- Flags accounts participating in cycles

### 3. Temporal Velocity Analysis
**Complexity**: O(E log E) for sorting + O(E) for detection
- Analyzes transaction timing patterns
- Detects rapid pass-through behavior
- Identifies "smurfing" (structuring) patterns
- Threshold: Transactions within 24-hour windows

### 4. Shell Account Detection
**Complexity**: O(V) where V = number of accounts
- Identifies intermediary accounts
- Criteria:
  - High transaction count
  - Balanced in/out flow
  - Short holding periods
  - Multiple counterparties

### 5. Fraud Ring Grouping
**Complexity**: O(V + E) using Union-Find
- Groups accounts into fraud networks
- Uses connected components algorithm
- Assigns unique ring IDs
- Calculates ring-level risk scores

### Overall System Complexity
- **Best Case**: O(V + E) - Linear graph traversal
- **Average Case**: O(E log E + VC) - Dominated by cycle detection
- **Worst Case**: O(V²E) - Dense graph with many cycles
- **Space Complexity**: O(V + E) - Graph storage

## 📊 Suspicion Score Methodology

### Weighted Scoring System

```
Suspicion Score = (W₁ × Cycle_Score) + (W₂ × Velocity_Score) + (W₃ × Shell_Score)
```

### Weights
- **Cycle Participation (W₁)**: 60%
  - Most indicative of money laundering
  - Direct evidence of layering
  
- **Temporal Velocity (W₂)**: 40%
  - Indicates rapid movement (smurfing)
  - Time-based structuring patterns

- **Shell Account Behavior (W₃)**: Modifier
  - Amplifies score for intermediary accounts
  - Adds +20% if shell characteristics detected

### Score Calculation

#### 1. Cycle Score
```python
cycle_score = min(100, cycle_count × 30)
# Each cycle adds 30 points, capped at 100
```

#### 2. Velocity Score
```python
velocity_score = min(100, velocity_events × 25)
# Each rapid pass-through adds 25 points, capped at 100
```

#### 3. Shell Modifier
```python
if is_shell_account:
    final_score = min(100, base_score × 1.2)
```

### Score Ranges
- **0-30**: Low Risk (Normal activity)
- **31-60**: Medium Risk (Suspicious patterns)
- **61-80**: High Risk (Multiple red flags)
- **81-100**: Critical Risk (Confirmed fraud indicators)

### Example Calculation
```
Account: ACC_00456
- Cycle Participation: 2 cycles → 60 points
- Temporal Velocity: 3 events → 75 points
- Shell Account: Yes → +20% modifier

Base Score = (0.6 × 60) + (0.4 × 75) = 36 + 30 = 66
Final Score = 66 × 1.2 = 79.2 → 79% (High Risk)
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 20.x or higher
- Python 3.10.x
- npm or yarn
- Git

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/niytdv/Rift.git
cd Rift
```

2. **Install Node.js dependencies**
```bash
npm install
```

3. **Install Python dependencies**
```bash
pip install -r python-engine/requirements.txt
```

4. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add:
```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your Groq API key from: https://console.groq.com/

5. **Run development server**
```bash
npm run dev
```

6. **Open browser**
```
http://localhost:3000
```

### Production Deployment (Render)

1. **Fork/Clone repository to GitHub**

2. **Create new Web Service on Render**
   - Connect your GitHub repository
   - Environment: Node
   - Build Command: (use render.yaml)
   - Start Command: `npm start`

3. **Set Environment Variables**
   - `NODE_VERSION`: 20
   - `PYTHON_VERSION`: 3.10.0
   - `NODE_ENV`: production
   - `GROQ_API_KEY`: your_groq_api_key

4. **Deploy**
   - Render will automatically build and deploy
   - Python packages installed to `.python_packages`
   - Next.js builds to `.next`

See `docs/RENDER_DEPLOYMENT_GUIDE.md` for detailed instructions.

## 📖 Usage Instructions

### 1. Upload Transaction Data

**CSV Format Required:**
```csv
sender_id,receiver_id,amount,timestamp
ACC_001,ACC_002,5000,2024-01-15T10:30:00
ACC_002,ACC_003,4800,2024-01-15T11:00:00
ACC_003,ACC_001,4600,2024-01-15T11:30:00
```

**Required Columns:**
- `sender_id`: Source account identifier
- `receiver_id`: Destination account identifier
- `amount`: Transaction amount (numeric)
- `timestamp`: ISO 8601 format (YYYY-MM-DDTHH:MM:SS)

### 2. View Analysis Results

**3D Graph Visualization:**
- **Red nodes**: High-risk accounts (suspicion > 70%)
- **Blue nodes**: Normal accounts
- **Cyan edges**: Transaction connections
- **Red edges**: Fraud ring connections
- **Particles**: Transaction flow direction

**Interactive Features:**
- Click nodes to view account details
- Drag nodes to rearrange graph
- Scroll to zoom in/out
- Click fraud rings in table to highlight

### 3. Use AI Chatbot

**Example Queries:**
- "Which accounts are most suspicious?"
- "Explain the fraud ring RING_001"
- "What patterns were detected in ACC_00456?"
- "How many fraud rings were found?"
- "What is the total amount involved in suspicious activity?"

### 4. Export Results

Click "DOWNLOAD JSON EXPORT" to save analysis results:
```json
{
  "suspicious_accounts": [...],
  "fraud_rings": [...],
  "summary": {
    "total_accounts_analyzed": 21,
    "suspicious_accounts_flagged": 9,
    "fraud_rings_detected": 3,
    "processing_time_seconds": 0.6
  }
}
```

## ⚠️ Known Limitations

### Performance
- **Large Datasets**: Processing time increases exponentially with graph size
  - Recommended: < 10,000 transactions
  - Maximum tested: 50,000 transactions (~30 seconds)
- **Memory Usage**: Large graphs require significant RAM
  - Estimated: 1GB per 10,000 transactions

### Algorithm Limitations
- **False Positives**: Legitimate business patterns may trigger alerts
  - High-volume merchants
  - Payroll systems
  - Automated payment processors
- **False Negatives**: Sophisticated laundering may evade detection
  - Long-duration layering (> 72 hours)
  - External mixing services
  - Cross-platform transfers

### Technical Constraints
- **Real-time Processing**: Not suitable for streaming data
  - Batch processing only
  - Requires complete dataset
- **Historical Data**: No time-series analysis
  - Single snapshot analysis
  - No trend detection over time
- **Currency**: No multi-currency support
  - Assumes single currency
  - No exchange rate handling

### Deployment
- **Cold Start**: Render free tier has ~30 second cold start
- **Timeout**: Analysis must complete within 60 seconds
- **Concurrency**: Single-threaded Python processing
- **Storage**: No persistent database (stateless)

### Data Privacy
- **No Encryption**: Data not encrypted at rest
- **Session Storage**: Results stored in browser session
- **No Authentication**: Public access (demo purposes)

## 📚 Documentation

Additional documentation available in `/docs`:
- System Architecture Deep Dive
- Algorithm Implementation Details
- Deployment Guides
- Performance Optimization
- API Reference

## 📄 License

This project is for educational and demonstration purposes.

## 🙏 Acknowledgments

- NetworkX for graph algorithms
- Groq for AI inference
- Render for hosting
- Next.js team for the framework

---

**Built with ❤️ for financial crime prevention**
