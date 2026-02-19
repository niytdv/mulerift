# Money Mule Detector

A fraud detection system that analyzes transaction data to identify money mule networks and fraud rings using graph analysis and pattern detection.

## Live Demo

Upload your CSV file or run the sample data to see fraud rings detected in real-time.

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Visualization**: D3.js force-directed graph
- **Backend**: Python 3.x with NetworkX for graph analysis
- **Data Processing**: Pandas for CSV parsing

## Detection Algorithms

The system identifies fraud patterns through:

1. **Shared IP Detection** - Multiple accounts using the same IP address
2. **Shared Device Detection** - Multiple accounts on the same device
3. **Shared Bank Account** - Multiple accounts linked to one bank account
4. **Rapid Account Creation** - Accounts created within 5 minutes of each other
5. **High Velocity Transactions** - Accounts with >10 transactions

Each pattern contributes to a fraud score (0-100), and accounts are grouped into rings based on shared entities.

## Setup

### Prerequisites

- Node.js 18+
- Python 3.8+

### Installation

```bash
# Install Node dependencies
npm install

# Install Python dependencies
pip install -r python-engine/requirements.txt

# Run development server
npm run dev
```

Visit `http://localhost:3000` to use the application.

## CSV Format

Your CSV should include these columns:
- `account_id` - Unique account identifier
- `ip_address` - IP address used
- `device_id` - Device identifier
- `bank_account` - Bank account number
- `created_at` - Account creation timestamp
- `transaction_count` - Number of transactions

## API Endpoints

- `POST /api/analyze` - Upload CSV for analysis
- `POST /api/sample` - Run analysis on sample data
- `POST /api/download` - Download results as JSON
- `GET /api/health` - Health check

## Project Structure

```
money-mule-detector/
├── app/                    # Next.js App Router
├── components/             # React components
├── lib/                    # TypeScript utilities
├── python-engine/          # Python fraud detection engine
├── public/                 # Static assets
└── README.md
```
