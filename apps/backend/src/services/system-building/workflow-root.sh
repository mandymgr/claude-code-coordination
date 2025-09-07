#!/usr/bin/env bash
# 🏗️ SYSTEM BUILDING Workflow Tool
# Quick access to Magic CLI and project generation

set -euo pipefail

show_help() {
  echo "🏗️ SYSTEM BUILDING Workflow"
  echo ""
  echo "Commands:"
  echo "  build [project-name]               Build new project"
  echo "  magic-cli                          Run magic CLI"
  echo "  status                             Show build status"
  echo "  templates                          List available templates"
  echo "  help                              Show this help"
  echo ""
  echo "Examples:"
  echo "  ./workflow.sh build \"social media app\""
  echo "  ./workflow.sh templates"
}

case "${1:-help}" in
  "build")
    echo "🏗️ Building project: ${2:-new project}"
    node ../packages/ai-core/src/enhanced-magic-cli.cjs build "${2:-new project}"
    ;;
  "magic-cli")
    echo "✨ Running Magic CLI..."
    node ../packages/ai-core/src/enhanced-magic-cli.cjs
    ;;
  "status")
    echo "📊 System Building Status:"
    echo "Magic CLI: $(test -f ../packages/ai-core/src/enhanced-magic-cli.cjs && echo '✅' || echo '❌')"
    echo "VS Code Extension: $(test -d ../apps/extension && echo '✅' || echo '❌')"
    echo "AI Coordinator: $(test -f ../packages/ai-core/src/ai-coordinator.cjs && echo '✅' || echo '❌')"
    ;;
  "templates")
    echo "📋 Available Templates:"
    echo "  - React + TypeScript"
    echo "  - Express API"
    echo "  - Full-stack KRINS app"
    echo "  - Microservices architecture"
    ;;
  "help"|*)
    show_help
    ;;
esac