#!/bin/bash

# 🚀 KRINS-Universe-Builder Service Structure Activation Script
# Replaces old flat service structure with new capability-based organization

set -e

echo "🏗️ KRINS-Universe-Builder - Activating New Service Structure"
echo "=================================================="

# Navigate to backend directory
cd "$(dirname "$0")"
BASE_DIR=$(pwd)

echo "📍 Working directory: $BASE_DIR"

# Backup old structure
echo "💾 Creating backup of old service structure..."
if [ -d "src/services" ]; then
    if [ ! -d "src/services-backup" ]; then
        cp -r "src/services" "src/services-backup"
        echo "✅ Old structure backed up to src/services-backup/"
    else
        echo "⚠️  Backup already exists at src/services-backup/"
    fi
else
    echo "⚠️  No existing services directory found"
fi

# Check if new structure exists
if [ ! -d "src/services-new" ]; then
    echo "❌ New service structure not found at src/services-new/"
    echo "Run the reorganization script first!"
    exit 1
fi

echo "🔄 Replacing old structure with new capability-based organization..."

# Remove old services directory
if [ -d "src/services" ]; then
    rm -rf "src/services"
    echo "🗑️  Removed old services directory"
fi

# Move new structure into place
mv "src/services-new" "src/services"
echo "✅ New service structure activated!"

# Show new structure
echo ""
echo "📊 New Service Organization:"
echo "============================"
find src/services -type d -name "*.ts" -prune -o -type d -print | sort | sed 's/src\/services/📁 services/'

echo ""
echo "🎯 Capability Categories:"
echo "========================="
echo "🤖 AI-AUTOMATION:    AI orchestration, AutoML, intelligent automation"
echo "🏗️  SYSTEM-BUILDING: Code generation, DevOps, collaboration tools"  
echo "📊 ENTERPRISE:       Multi-tenant, security, auth, commercial features"
echo "🔬 ADVANCED-TECH:    Quantum, blockchain, voice, edge computing"
echo "📈 MONITORING:       Analytics, performance, reliability tracking"
echo "🔧 DEV-TOOLS:        Integrations and development utilities"

echo ""
echo "⚠️  IMPORTANT: Update import paths in your codebase!"
echo "Example:"
echo "  OLD: import { AIService } from '../services/ai/aiService';"
echo "  NEW: import { AIService } from '../services/ai-automation/ai/aiService';"

echo ""
echo "✅ Service structure activation complete!"
echo "🚀 KRINS-Universe-Builder now uses capability-based organization!"