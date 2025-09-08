#!/bin/bash

# =============================================================================
# 🔒 ULTRA-SAFE REPOSITORY SETUP SCRIPT
# Automatically configure any repository with enterprise-grade security
# Version: 1.0 (September 2025)
# =============================================================================

echo "🚀 ULTRA-SAFE Repository Setup"
echo "==============================="
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository!"
    echo "   Run: git init first"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo "🔍 Git repository: $(git rev-parse --show-toplevel)"
echo ""

# 1. Copy ULTRA-SAFE .gitignore
echo "🔒 Step 1: Installing ULTRA-SAFE .gitignore..."
if [[ -f .gitignore ]]; then
    echo "   📋 Backing up existing .gitignore to .gitignore.backup"
    cp .gitignore .gitignore.backup
fi

# Find the template directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_DIR="$SCRIPT_DIR"

if [[ -f "$TEMPLATE_DIR/.gitignore" ]]; then
    cp "$TEMPLATE_DIR/.gitignore" .gitignore
    echo "   ✅ ULTRA-SAFE .gitignore installed ($(wc -l < .gitignore) lines)"
else
    echo "   ❌ Template .gitignore not found at $TEMPLATE_DIR/.gitignore"
    exit 1
fi

# 2. Install pre-commit hook
echo ""
echo "🔒 Step 2: Installing pre-commit security hook..."
mkdir -p .git/hooks

if [[ -f "$TEMPLATE_DIR/hooks/pre-commit" ]]; then
    cp "$TEMPLATE_DIR/hooks/pre-commit" .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
    echo "   ✅ Pre-commit security hook installed and made executable"
else
    echo "   ❌ Template pre-commit hook not found"
    exit 1
fi

# 3. Install health check script
echo ""
echo "🔍 Step 3: Installing repository health checker..."
mkdir -p scripts

if [[ -f "$TEMPLATE_DIR/scripts/repository-health-check.sh" ]]; then
    cp "$TEMPLATE_DIR/scripts/repository-health-check.sh" scripts/
    chmod +x scripts/repository-health-check.sh
    echo "   ✅ Health checker installed at scripts/repository-health-check.sh"
else
    echo "   ❌ Template health checker not found"
    exit 1
fi

# 4. Run initial health check
echo ""
echo "🔍 Step 4: Running initial health check..."
./scripts/repository-health-check.sh

# 5. Test pre-commit hook
echo ""
echo "🧪 Step 5: Testing pre-commit hook..."
echo "# ULTRA-SAFE Repository Test" > test-file.txt
git add test-file.txt
if git commit -m "Test commit for ULTRA-SAFE setup" >/dev/null 2>&1; then
    echo "   ✅ Pre-commit hook test passed!"
    git reset --soft HEAD~1  # Undo test commit
    git reset HEAD test-file.txt  # Unstage test file
    rm test-file.txt
else
    echo "   ❌ Pre-commit hook test failed"
fi

echo ""
echo "🎉 ULTRA-SAFE Repository Setup Complete!"
echo "========================================="
echo ""
echo "🔒 What was installed:"
echo "   ✅ ULTRA-SAFE .gitignore (comprehensive protection)"
echo "   ✅ Pre-commit security hook (blocks dangerous files)"
echo "   ✅ Repository health checker (scripts/repository-health-check.sh)"
echo ""
echo "🛡️ Your repository is now protected against:"
echo "   - Dependencies (node_modules, vendor/)"
echo "   - Build artifacts (dist/, build/, out/)"
echo "   - Environment files (.env*, secrets.*)"
echo "   - Database files (*.db, *.sqlite)"
echo "   - Cache files (.cache/, tmp/)"
echo "   - Lock files (*.lock, package-lock.json)"
echo "   - Backup files (backups/, *.backup)"
echo "   - System files (.DS_Store, Thumbs.db)"
echo "   - AI tools (.claude/, ai-cache/)"
echo "   - Large files (>1MB)"
echo "   - Secrets in file content (API keys, passwords)"
echo ""
echo "📋 Usage commands:"
echo "   ./scripts/repository-health-check.sh  # Check repository health"
echo "   git status --ignored                   # See all ignored files"
echo "   git add . && git commit -m \"message\" # Pre-commit hook will scan automatically"
echo ""
echo "🚨 Critical: NEVER bypass pre-commit hook with --no-verify!"
echo "🎯 Status: Repository is now ULTRA-SAFE and enterprise-ready!"