#!/bin/bash

# =============================================================================
# 🔒 KRINS REPOSITORY HEALTH CHECKER
# Verifies repository safety and integrity
# =============================================================================

echo "🔍 KRINS Repository Health Check"
echo "=================================="

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

echo "   Checking for secrets..."
if git ls-files | xargs grep -l -E "(sk-[a-zA-Z0-9]{48}|ghp_[a-zA-Z0-9]{36}|AIza[0-9A-Za-z-_]{35})" 2>/dev/null; then
    echo "   🚨 Potential secrets found!"
    DANGEROUS_IN_GIT=true
else
    echo "   ✅ No obvious secrets detected"
fi

# Check .gitignore health
echo ""
echo "📋 .gitignore Health:"
if [[ -f .gitignore ]]; then
    GITIGNORE_LINES=$(wc -l < .gitignore)
    echo "   ✅ .gitignore exists ($GITIGNORE_LINES lines)"
    
    # Check for essential patterns
    ESSENTIAL_PATTERNS=("node_modules/" "dist/" "*.env*" "*.log" ".DS_Store")
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
    exit 1
else
    echo "✅ REPOSITORY HEALTH: GOOD"
    echo "🛡️ Repository is enterprise-ready"
fi

echo ""
echo "📊 Summary:"
echo "   - Tracked files: $TRACKED_FILES"
echo "   - Lock files: $LOCK_COUNT"
echo "   - .gitignore: $(wc -l < .gitignore) lines"
echo "   - Status: $(if [[ "$DANGEROUS_IN_GIT" = true ]]; then echo "NEEDS CLEANUP"; else echo "CLEAN"; fi)"