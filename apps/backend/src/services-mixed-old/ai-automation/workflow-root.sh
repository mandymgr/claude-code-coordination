#!/usr/bin/env bash
# 🤖 AI AUTOMATION Workflow Tool  
# Quick access to multi-AI coordination and automation

set -euo pipefail

show_help() {
  echo "🤖 AI AUTOMATION Workflow"
  echo ""
  echo "Commands:"
  echo "  ai-assistant                       Start AI assistant"
  echo "  team-optimizer                     Run team optimization"
  echo "  dashboard                          Start dashboard server"
  echo "  realtime-hub                       Start WebSocket hub"
  echo "  status                            Show AI system status"
  echo "  help                              Show this help"
}

case "${1:-help}" in
  "ai-assistant")
    echo "🤖 Starting AI Assistant..."
    node ../packages/ai-core/src/adaptive-ai-assistant.cjs
    ;;
  "team-optimizer")
    echo "⚡ Running Team Optimization..."
    node ../packages/ai-core/src/team-optimization-ai.cjs
    ;;
  "dashboard")
    echo "📊 Starting Dashboard Server..."
    node ../packages/ai-core/src/dashboard-server.cjs
    ;;
  "realtime-hub")
    echo "🔄 Starting Realtime Hub..."
    node ../packages/ai-core/src/realtime-hub.cjs
    ;;
  "status")
    echo "📊 AI Automation Status:"
    echo "AI Assistant: $(test -f ../packages/ai-core/src/adaptive-ai-assistant.cjs && echo '✅' || echo '❌')"
    echo "Team Optimizer: $(test -f ../packages/ai-core/src/team-optimization-ai.cjs && echo '✅' || echo '❌')"
    echo "Dashboard: $(test -f ../packages/ai-core/src/dashboard-server.cjs && echo '✅' || echo '❌')"
    echo "Realtime Hub: $(test -f ../packages/ai-core/src/realtime-hub.cjs && echo '✅' || echo '❌')"
    echo "ADR Context Reader: $(test -f ../packages/ai-core/src/adr-context-reader.ts && echo '✅' || echo '❌')"
    ;;
  "help"|*)
    show_help
    ;;
esac