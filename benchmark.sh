#!/bin/bash

# Performance Benchmark: Original vs Optimized Coordination System

set -e

COORD_DIR="/Users/mandymarigjervikrygg/Desktop/claude-code-coordination"
ORIGINAL_HOOKS="$COORD_DIR/src/hooks.sh"
OPTIMIZED_HOOKS="$COORD_DIR/src/hooks-optimized.sh"
BENCHMARK_DIR="/tmp/claude-coord-benchmark"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}$(echo "$1" | sed 's/./=/g')${NC}"
}

print_result() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_benchmark() {
    local test_name="$1"
    local original_time="$2" 
    local optimized_time="$3"
    
    local improvement=$(echo "scale=2; (($original_time - $optimized_time) / $original_time) * 100" | bc -l 2>/dev/null || echo "0")
    
    echo "📊 $test_name:"
    echo "   Original:  ${original_time}s"
    echo "   Optimized: ${optimized_time}s"
    if (( $(echo "$improvement > 0" | bc -l) )); then
        echo -e "   ${GREEN}Improvement: +${improvement}% faster${NC}"
    else
        local degradation=$(echo "scale=2; (($optimized_time - $original_time) / $original_time) * 100" | bc -l 2>/dev/null || echo "0")
        echo -e "   ${YELLOW}Degradation: -${degradation}% slower${NC}"
    fi
    echo ""
}

setup_benchmark() {
    print_header "Setting up benchmark environment"
    
    # Create clean benchmark directory
    rm -rf "$BENCHMARK_DIR"
    mkdir -p "$BENCHMARK_DIR"
    cd "$BENCHMARK_DIR"
    
    # Create test coordination setup
    mkdir -p .claude-coordination/{sessions,broadcasts,locks}
    
    # Create some dummy session files
    for i in {1..10}; do
        cat <<EOF > ".claude-coordination/sessions/test-session-$i.json"
{
  "id": "test-session-$i",
  "created": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "last_active": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "status": "active",
  "current_task": "Benchmark test task $i",
  "hostname": "benchmark-host"
}
EOF
    done
    
    # Create some broadcast messages
    for i in {1..20}; do
        cat <<EOF > ".claude-coordination/broadcasts/msg-$i.json"
{
  "from_session": "test-session-$((i % 10))",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "message": "Test message $i",
  "priority": "normal"
}
EOF
    done
    
    # Create some file locks
    for i in {1..5}; do
        cat <<EOF > ".claude-coordination/locks/test-file-$i.lock"
{
  "session_id": "test-session-$i",
  "file_path": "test-file-$i.js",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF
    done
    
    print_result "Benchmark environment created with 10 sessions, 20 messages, 5 locks"
}

benchmark_session_loading() {
    print_header "Benchmarking Session Loading"
    
    # Test original implementation
    export CLAUDE_SESSION_ID="benchmark-original"
    local start_time=$(date +%s.%N)
    
    # Simulate session loading operations
    for i in {1..50}; do
        source "$ORIGINAL_HOOKS" >/dev/null 2>&1
        # Simulate some session operations
        list_sessions >/dev/null 2>&1 || true
    done
    
    local original_time=$(echo "$(date +%s.%N) - $start_time" | bc)
    
    # Clean up
    rm -f .claude-coordination/sessions/benchmark-original.json
    
    # Test optimized implementation
    export CLAUDE_SESSION_ID="benchmark-optimized"
    local start_time=$(date +%s.%N)
    
    # Simulate session loading operations
    for i in {1..50}; do
        source "$OPTIMIZED_HOOKS" >/dev/null 2>&1
        # Simulate some session operations
        list_sessions >/dev/null 2>&1 || true
    done
    
    local optimized_time=$(echo "$(date +%s.%N) - $start_time" | bc)
    
    print_benchmark "Session Loading (50 iterations)" "$original_time" "$optimized_time"
}

benchmark_message_processing() {
    print_header "Benchmarking Message Processing"
    
    # Create more messages for this test
    for i in {21..100}; do
        cat <<EOF > ".claude-coordination/broadcasts/msg-$i.json"
{
  "from_session": "test-session-$((i % 10))",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "message": "Test message $i",
  "priority": "normal"
}
EOF
    done
    
    # Test original implementation
    export CLAUDE_SESSION_ID="benchmark-msg-original"
    source "$ORIGINAL_HOOKS" >/dev/null 2>&1
    
    local start_time=$(date +%s.%N)
    for i in {1..20}; do
        check_messages >/dev/null 2>&1 || true
    done
    local original_time=$(echo "$(date +%s.%N) - $start_time" | bc)
    
    # Reset messages
    rm -f .claude-coordination/broadcasts/processed/*.json
    mv .claude-coordination/broadcasts/processed/* .claude-coordination/broadcasts/ 2>/dev/null || true
    
    # Test optimized implementation  
    export CLAUDE_SESSION_ID="benchmark-msg-optimized"
    source "$OPTIMIZED_HOOKS" >/dev/null 2>&1
    
    local start_time=$(date +%s.%N)
    for i in {1..20}; do
        check_messages_optimized >/dev/null 2>&1 || true
    done
    local optimized_time=$(echo "$(date +%s.%N) - $start_time" | bc)
    
    print_benchmark "Message Processing (20 iterations, 100 messages)" "$original_time" "$optimized_time"
}

benchmark_file_locking() {
    print_header "Benchmarking File Lock Operations"
    
    # Test original implementation
    export CLAUDE_SESSION_ID="benchmark-lock-original"
    source "$ORIGINAL_HOOKS" >/dev/null 2>&1
    
    local start_time=$(date +%s.%N)
    for i in {1..30}; do
        acquire_file_lock "test-file-lock-$i.js" "edit" >/dev/null 2>&1 || true
        release_file_lock "test-file-lock-$i.js" >/dev/null 2>&1 || true
    done
    local original_time=$(echo "$(date +%s.%N) - $start_time" | bc)
    
    # Clean up locks
    rm -f .claude-coordination/locks/test-file-lock-*.lock
    
    # Test optimized implementation
    export CLAUDE_SESSION_ID="benchmark-lock-optimized"  
    source "$OPTIMIZED_HOOKS" >/dev/null 2>&1
    
    local start_time=$(date +%s.%N)
    for i in {1..30}; do
        acquire_file_lock_optimized "test-file-lock-$i.js" "edit" >/dev/null 2>&1 || true
        release_file_lock "test-file-lock-$i.js" >/dev/null 2>&1 || true
    done
    local optimized_time=$(echo "$(date +%s.%N) - $start_time" | bc)
    
    print_benchmark "File Lock Operations (30 lock/unlock cycles)" "$original_time" "$optimized_time"
}

benchmark_broadcast_operations() {
    print_header "Benchmarking Broadcast Operations"
    
    # Test original implementation (immediate writes)
    export CLAUDE_SESSION_ID="benchmark-broadcast-original"
    source "$ORIGINAL_HOOKS" >/dev/null 2>&1
    
    local start_time=$(date +%s.%N)
    for i in {1..50}; do
        broadcast_message "Benchmark test message $i" "normal" >/dev/null 2>&1 || true
    done
    local original_time=$(echo "$(date +%s.%N) - $start_time" | bc)
    
    # Clean up
    rm -f .claude-coordination/broadcasts/benchmark-*.json
    
    # Test optimized implementation (batched)
    export CLAUDE_SESSION_ID="benchmark-broadcast-optimized"
    source "$OPTIMIZED_HOOKS" >/dev/null 2>&1
    
    local start_time=$(date +%s.%N)
    for i in {1..50}; do
        queue_broadcast "Benchmark test message $i" "normal" >/dev/null 2>&1 || true
    done
    flush_broadcast_queue >/dev/null 2>&1 || true
    local optimized_time=$(echo "$(date +%s.%N) - $start_time" | bc)
    
    print_benchmark "Broadcast Operations (50 messages)" "$original_time" "$optimized_time"
}

benchmark_memory_usage() {
    print_header "Memory Usage Comparison"
    
    # Test original implementation
    export CLAUDE_SESSION_ID="benchmark-memory-original"
    local original_start_mem=$(ps -o rss= -p $$ | tr -d ' ')
    source "$ORIGINAL_HOOKS" >/dev/null 2>&1
    
    # Simulate some operations
    for i in {1..10}; do
        list_sessions >/dev/null 2>&1 || true
        check_messages >/dev/null 2>&1 || true
    done
    
    local original_end_mem=$(ps -o rss= -p $$ | tr -d ' ')
    local original_mem_diff=$((original_end_mem - original_start_mem))
    
    # Test optimized implementation
    export CLAUDE_SESSION_ID="benchmark-memory-optimized"
    local optimized_start_mem=$(ps -o rss= -p $$ | tr -d ' ')
    source "$OPTIMIZED_HOOKS" >/dev/null 2>&1
    
    # Simulate some operations
    for i in {1..10}; do
        list_sessions_optimized >/dev/null 2>&1 || true
        check_messages_optimized >/dev/null 2>&1 || true
    done
    
    local optimized_end_mem=$(ps -o rss= -p $$ | tr -d ' ')
    local optimized_mem_diff=$((optimized_end_mem - optimized_start_mem))
    
    echo "📊 Memory Usage:"
    echo "   Original:  ${original_mem_diff}KB additional"
    echo "   Optimized: ${optimized_mem_diff}KB additional"
    
    if [ "$optimized_mem_diff" -lt "$original_mem_diff" ]; then
        local savings=$((original_mem_diff - optimized_mem_diff))
        echo -e "   ${GREEN}Memory savings: ${savings}KB${NC}"
    else
        local overhead=$((optimized_mem_diff - original_mem_diff))
        echo -e "   ${YELLOW}Memory overhead: ${overhead}KB${NC}"
    fi
    echo ""
}

cleanup_benchmark() {
    print_header "Cleaning up benchmark environment"
    cd /
    rm -rf "$BENCHMARK_DIR"
    print_result "Cleanup complete"
}

# Main benchmark execution
main() {
    print_header "Claude Code Coordination Performance Benchmark"
    echo "Testing performance improvements in optimized version"
    echo ""
    
    # Check dependencies
    if ! command -v bc &> /dev/null; then
        echo -e "${RED}❌ bc (calculator) is required for benchmarking${NC}"
        exit 1
    fi
    
    setup_benchmark
    
    benchmark_session_loading
    benchmark_message_processing
    benchmark_file_locking
    benchmark_broadcast_operations
    benchmark_memory_usage
    
    cleanup_benchmark
    
    print_header "Benchmark Complete!"
    echo ""
    echo "🎯 Key Optimizations Tested:"
    echo "   🧠 In-memory caching for session data"
    echo "   📦 Batch operations for broadcasts"
    echo "   🔍 Lazy loading of coordination data"
    echo "   ⚡ Async file operations"
    echo ""
    echo "📋 Use the optimized version by sourcing:"
    echo "   source $OPTIMIZED_HOOKS"
}

# Run benchmark
main "$@"