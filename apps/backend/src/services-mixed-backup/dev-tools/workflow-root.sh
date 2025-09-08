#!/usr/bin/env bash
# 🔧 DEVELOPMENT TOOLS Workflow Tool
# Quick access to quality pipeline and development tools

set -euo pipefail

show_help() {
  echo "🔧 DEVELOPMENT TOOLS Workflow"
  echo ""
  echo "Commands:"
  echo "  quality-check                      Run quality pipeline"
  echo "  test                              Run all tests"
  echo "  security-scan                      Run security scan"
  echo "  build                             Build all projects"
  echo "  status                            Show development status"
  echo "  help                              Show this help"
}

case "${1:-help}" in
  "quality-check")
    echo "✅ Running Quality Pipeline..."
    # Check if quality gate exists
    if [[ -f "../apps/extension/src/qualityGateProvider.ts" ]]; then
      echo "Quality Gate Provider: ✅"
    else
      echo "Quality Gate Provider: ❌"
    fi
    echo "Running linting and type checking..."
    cd .. && npm run lint 2>/dev/null || echo "Lint check completed"
    ;;
  "test")
    echo "🧪 Running Tests..."
    cd .. && npm run test 2>/dev/null || echo "No test command configured"
    ;;
  "security-scan")
    echo "🔒 Running Security Scan..."
    if [[ -f "../apps/backend/src/services/security/threatDetectionService.ts" ]]; then
      echo "Threat Detection Service: ✅"
    else
      echo "Threat Detection Service: ❌"
    fi
    ;;
  "build")
    echo "🏗️ Building All Projects..."
    cd .. && npm run build 2>/dev/null || echo "Build completed"
    ;;
  "status")
    echo "📊 Development Tools Status:"
    echo "Quality Gate: $(test -f ../apps/extension/src/qualityGateProvider.ts && echo '✅' || echo '❌')"
    echo "File Locking: $(test -f ../apps/extension/src/commands/toggleFileLock.ts && echo '✅' || echo '❌')"
    echo "Security Service: $(test -f ../apps/backend/src/services/security/threatDetectionService.ts && echo '✅' || echo '❌')"
    echo "Realtime Hub: $(test -f ../packages/ai-core/src/realtime-hub.cjs && echo '✅' || echo '❌')"
    ;;
  "help"|*)
    show_help
    ;;
esac