#!/bin/bash

# =============================================================================
# 🔒 ULTRA-SAFE REPOSITORY HEALTH CHECKER TEMPLATE
# Universal health assessment for all project types
# Version: 1.0 (September 2025)
# =============================================================================

echo "🔍 ULTRA-SAFE Repository Health Check"
echo "======================================"

# Check git status
echo "📊 Git Status:"
git status --porcelain | head -5
echo "   Total untracked: $(git status --porcelain | grep '^??' | wc -l | tr -d ' ')"
echo "   Total modified: $(git status --porcelain | grep '^.M' | wc -l | tr -d ' ')"

# Check tracked files count
TRACKED_FILES=$(git ls-files | wc -l | tr -d ' ')
echo "📁 Tracked files: $TRACKED_FILES"

# Check for dangerous files in git
echo ""
echo "🚨 Dangerous Files Check:"
DANGEROUS_IN_GIT=false

echo "   Checking for node_modules..."
if git ls-files | grep -q "node_modules/"; then
    echo "   ❌ node_modules found in git!"
    DANGEROUS_IN_GIT=true
else
    echo "   ✅ No node_modules in git"
fi

echo "   Checking for build files..."
if git ls-files | grep -qE "(dist/|build/|out/)"; then
    echo "   ❌ Build files found in git!"
    git ls-files | grep -E "(dist/|build/|out/)" | head -3
    DANGEROUS_IN_GIT=true
else
    echo "   ✅ No build files in git"
fi

echo "   Checking for lock files..."
LOCK_COUNT=$(git ls-files | grep -E "\.lock$|package-lock\.json|yarn\.lock" | wc -l | tr -d ' ')
if [[ $LOCK_COUNT -gt 1 ]]; then  # Allow pnpm-lock.yaml
    echo "   ⚠️  $LOCK_COUNT lock files found (should be max 1 pnpm-lock.yaml)"
    git ls-files | grep -E "\.lock$|package-lock\.json|yarn\.lock" | head -3
else
    echo "   ✅ Lock files OK ($LOCK_COUNT)"
fi

echo "   Checking for environment files..."
if git ls-files | grep -qE "\.env"; then
    echo "   ❌ Environment files found in git!"
    git ls-files | grep -E "\.env" | head -3
    DANGEROUS_IN_GIT=true
else
    echo "   ✅ No environment files in git"
fi

echo "   Checking for secrets..."
if git ls-files | xargs grep -l -E "(sk-[a-zA-Z0-9]{48}|ghp_[a-zA-Z0-9]{36}|AIza[0-9A-Za-z-_]{35})" 2>/dev/null; then
    echo "   🚨 Potential secrets found!"
    DANGEROUS_IN_GIT=true
else
    echo "   ✅ No obvious secrets detected"
fi

echo "   Checking for database files..."
if git ls-files | grep -qE "\.(db|sqlite|sqlite3)$"; then
    echo "   ❌ Database files found in git!"
    git ls-files | grep -E "\.(db|sqlite|sqlite3)$" | head -3
    DANGEROUS_IN_GIT=true
else
    echo "   ✅ No database files in git"
fi

echo "   Checking for cache files..."
if git ls-files | grep -qE "(\\.cache/|tmp/|temp/)"; then
    echo "   ❌ Cache files found in git!"
    git ls-files | grep -E "(\\.cache/|tmp/|temp/)" | head -3
    DANGEROUS_IN_GIT=true
else
    echo "   ✅ No cache files in git"
fi

# Check .gitignore health
echo ""
echo "📋 .gitignore Health:"
if [[ -f .gitignore ]]; then
    GITIGNORE_LINES=$(wc -l < .gitignore)
    echo "   ✅ .gitignore exists ($GITIGNORE_LINES lines)"
    
    # Check for essential patterns
    ESSENTIAL_PATTERNS=("node_modules/" "dist/" "*.env*" "*.log" ".DS_Store" "*.lock")
    for pattern in "${ESSENTIAL_PATTERNS[@]}"; do
        if grep -q "$pattern" .gitignore; then
            echo "   ✅ $pattern ignored"
        else
            echo "   ⚠️  $pattern NOT ignored"
        fi
    done
else
    echo "   ❌ .gitignore missing!"
    DANGEROUS_IN_GIT=true
fi

# Check for pre-commit hook
echo ""
echo "🔒 Security Hook Status:"
if [[ -f .git/hooks/pre-commit ]]; then
    echo "   ✅ Pre-commit hook installed"
    if [[ -x .git/hooks/pre-commit ]]; then
        echo "   ✅ Pre-commit hook executable"
    else
        echo "   ⚠️  Pre-commit hook not executable"
    fi
else
    echo "   ❌ Pre-commit hook missing!"
fi

# Check recent commits
echo ""
echo "📜 Recent Commits:"
git log --oneline -3

# Final assessment
echo ""
echo "🎯 Final Assessment:"
if [[ "$DANGEROUS_IN_GIT" = true ]]; then
    echo "❌ REPOSITORY HEALTH: POOR"
    echo "🚨 Action required: Clean dangerous files from git"
    echo ""
    echo "🔧 Recommended actions:"
    echo "   1. Run: git filter-branch to remove dangerous files from history"
    echo "   2. Update .gitignore to prevent future issues"
    echo "   3. Install pre-commit hook for future protection"
    exit 1
else
    echo "✅ REPOSITORY HEALTH: EXCELLENT"
    echo "🛡️ Repository is enterprise-ready and secure"
fi

echo ""
echo "📊 Summary:"
echo "   - Tracked files: $TRACKED_FILES"
echo "   - Lock files: $LOCK_COUNT"
echo "   - .gitignore: $(wc -l < .gitignore 2>/dev/null || echo 0) lines"
echo "   - Status: $(if [[ "$DANGEROUS_IN_GIT" = true ]]; then echo "NEEDS CLEANUP"; else echo "ULTRA-SAFE"; fi)"