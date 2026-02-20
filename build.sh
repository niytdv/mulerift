#!/bin/bash
set -e

echo "🐍 Installing Python dependencies to project directory..."
mkdir -p .python_packages
python3 -m pip install --upgrade pip
python3 -m pip install --target=.python_packages -r python-engine/requirements.txt

echo "📦 Installing Node dependencies..."
npm ci

echo "🏗️  Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"
