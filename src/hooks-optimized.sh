#!/bin/bash

# Claude Code Coordination System - Optimized Version
# Performance optimizations: In-memory caching, batch operations, lazy loading

COORDINATION_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SESSION_DIR="${COORDINATION_DIR}/sessions"
LOG_DIR="${COORDINATION_DIR}/logs"
BROADCAST_DIR="${COORDINATION_DIR}/broadcasts"
LOCK_DIR="${COORDINATION_DIR}/locks"

# Ensure all directories exist
mkdir -p "${SESSION_DIR}" "${LOG_DIR}" "${BROADCAST_DIR}" "${LOCK_DIR}"

# Generate session ID if not set
if [ -z "$CLAUDE_SESSION_ID" ]; then
    export CLAUDE_SESSION_ID=$(uuidgen | tr '[:upper:]' '[:lower:]')
fi

# Session and state files
SESSION_FILE="${SESSION_DIR}/${CLAUDE_SESSION_ID}.json"
GLOBAL_STATE_FILE="${COORDINATION_DIR}/global-state.json"

# ========================================
# PERFORMANCE OPTIMIZATION 1: IN-MEMORY CACHING
# ========================================

# Cache variables - store frequently accessed data in memory
declare -A SESSION_CACHE=()
declare -A LOCK_CACHE=()
declare -A MESSAGE_CACHE=()
GLOBAL_STATE_CACHE=""
CACHE_TIMESTAMP=0
CACHE_TTL=30  # 30 seconds cache TTL

# Cache management functions
is_cache_valid() {
    local current_time=$(date +%s)
    [[ $((current_time - CACHE_TIMESTAMP)) -lt $CACHE_TTL ]]
}

invalidate_cache() {
    SESSION_CACHE=()
    LOCK_CACHE=()
    MESSAGE_CACHE=()
    GLOBAL_STATE_CACHE=""
    CACHE_TIMESTAMP=0
}

load_session_cache() {
    if ! is_cache_valid; then
        echo "🔄 Refreshing session cache..."
        
        # Load all sessions into cache
        for session_file in "${SESSION_DIR}"/*.json; do
            if [ -f "$session_file" ]; then
                local session_id=$(basename "$session_file" .json)
                SESSION_CACHE[$session_id]=$(cat "$session_file")
            fi
        done
        
        # Update cache timestamp
        CACHE_TIMESTAMP=$(date +%s)
        echo "✅ Cache refreshed with ${#SESSION_CACHE[@]} sessions"
    fi
}

get_session_from_cache() {
    local session_id="$1"
    load_session_cache
    echo "${SESSION_CACHE[$session_id]}"
}

update_session_cache() {
    local session_id="$1"
    local session_data="$2"
    SESSION_CACHE[$session_id]="$session_data"
}

# ========================================
# PERFORMANCE OPTIMIZATION 2: BATCH OPERATIONS
# ========================================

# Batch broadcast queue
BROADCAST_QUEUE=()
BROADCAST_BATCH_SIZE=10
LAST_BATCH_FLUSH=0
BATCH_FLUSH_INTERVAL=5  # 5 seconds

queue_broadcast() {
    local message="$1"
    local priority="${2:-normal}"
    local target="${3:-all}"
    
    local broadcast_entry=$(cat <<EOF
{
  "from_session": "${CLAUDE_SESSION_ID}",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "priority": "${priority}",
  "target": "${target}",
  "message": "${message}",
  "current_directory": "$(pwd)",
  "hostname": "$(hostname)"
}
EOF
    )
    
    BROADCAST_QUEUE+=("$broadcast_entry")
    echo "📤 Queued broadcast: ${message} (queue size: ${#BROADCAST_QUEUE[@]})"
    
    # Auto-flush if queue is full or time interval passed
    local current_time=$(date +%s)
    if [[ ${#BROADCAST_QUEUE[@]} -ge $BROADCAST_BATCH_SIZE ]] || [[ $((current_time - LAST_BATCH_FLUSH)) -ge $BATCH_FLUSH_INTERVAL ]]; then
        flush_broadcast_queue
    fi
}

flush_broadcast_queue() {
    if [[ ${#BROADCAST_QUEUE[@]} -eq 0 ]]; then
        return 0
    fi
    
    local batch_file="${BROADCAST_DIR}/batch-$(date +%s%N)-${CLAUDE_SESSION_ID}.json"
    
    # Create JSON array from queue
    printf '%s\n' "${BROADCAST_QUEUE[@]}" | jq -s '.' > "$batch_file"
    
    echo "📦 Flushed ${#BROADCAST_QUEUE[@]} broadcasts to batch file"
    
    # Clear queue
    BROADCAST_QUEUE=()
    LAST_BATCH_FLUSH=$(date +%s)
}

# Enhanced message checking with batch processing
check_messages_optimized() {
    local unread_count=0
    local processed_messages=()
    
    # Process batch files first
    for batch_file in "${BROADCAST_DIR}"/batch-*.json; do
        if [ -f "$batch_file" ]; then
            local messages=$(cat "$batch_file")
            local message_count=$(echo "$messages" | jq length)
            
            for ((i=0; i<message_count; i++)); do
                local message=$(echo "$messages" | jq ".[$i]")
                local from_session=$(echo "$message" | jq -r '.from_session')
                local target=$(echo "$message" | jq -r '.target')
                
                if [ "$from_session" != "${CLAUDE_SESSION_ID}" ] && ([ "$target" = "all" ] || [ "$target" = "${CLAUDE_SESSION_ID}" ]); then
                    local msg_text=$(echo "$message" | jq -r '.message')
                    local priority=$(echo "$message" | jq -r '.priority')
                    local timestamp=$(echo "$message" | jq -r '.timestamp')
                    
                    case "$priority" in
                        "high"|"urgent")
                            echo "🚨 URGENT from ${from_session}: ${msg_text} (${timestamp})"
                            ;;
                        *)
                            echo "📨 ${from_session}: ${msg_text} (${timestamp})"
                            ;;
                    esac
                    ((unread_count++))
                fi
            done
            
            # Mark batch as processed
            mkdir -p "${BROADCAST_DIR}/processed"
            mv "$batch_file" "${BROADCAST_DIR}/processed/"
        fi
    done
    
    # Process individual message files (legacy support)
    for broadcast_file in "${BROADCAST_DIR}"/*.json; do
        if [ -f "$broadcast_file" ] && [[ ! "$broadcast_file" =~ batch- ]]; then
            local from_session=$(jq -r '.from_session' "$broadcast_file" 2>/dev/null)
            local target=$(jq -r '.target' "$broadcast_file" 2>/dev/null)
            
            if [ "$from_session" != "${CLAUDE_SESSION_ID}" ] && ([ "$target" = "all" ] || [ "$target" = "${CLAUDE_SESSION_ID}" ]); then
                local message=$(jq -r '.message' "$broadcast_file" 2>/dev/null)
                local priority=$(jq -r '.priority' "$broadcast_file" 2>/dev/null)
                local timestamp=$(jq -r '.timestamp' "$broadcast_file" 2>/dev/null)
                
                if [ -n "$message" ]; then
                    case "$priority" in
                        "high"|"urgent")
                            echo "🚨 URGENT from ${from_session}: ${message} (${timestamp})"
                            ;;
                        *)
                            echo "📨 ${from_session}: ${message} (${timestamp})"
                            ;;
                    esac
                    ((unread_count++))
                fi
                
                # Mark as processed
                mkdir -p "${BROADCAST_DIR}/processed"
                mv "$broadcast_file" "${BROADCAST_DIR}/processed/"
            fi
        fi
    done
    
    if [ $unread_count -gt 0 ]; then
        echo "📬 $unread_count new messages processed"
    fi
}

# ========================================
# PERFORMANCE OPTIMIZATION 3: LAZY LOADING
# ========================================

# Lazy loading flags
SESSION_DATA_LOADED=false
GLOBAL_STATE_LOADED=false
LOCKS_DATA_LOADED=false

# Lazy load session data only when needed
load_session_data_lazy() {
    if [[ "$SESSION_DATA_LOADED" == false ]]; then
        echo "🔍 Lazy loading session data..."
        load_session_cache
        SESSION_DATA_LOADED=true
    fi
}

# Lazy load global state only when needed
load_global_state_lazy() {
    if [[ "$GLOBAL_STATE_LOADED" == false ]] && [ -f "${GLOBAL_STATE_FILE}" ]; then
        echo "🔍 Lazy loading global state..."
        GLOBAL_STATE_CACHE=$(cat "${GLOBAL_STATE_FILE}")
        GLOBAL_STATE_LOADED=true
    fi
}

# Lazy load lock data only when needed
load_locks_data_lazy() {
    if [[ "$LOCKS_DATA_LOADED" == false ]]; then
        echo "🔍 Lazy loading file locks..."
        for lock_file in "${LOCK_DIR}"/*.lock; do
            if [ -f "$lock_file" ]; then
                local file_key=$(basename "$lock_file" .lock)
                LOCK_CACHE[$file_key]=$(cat "$lock_file")
            fi
        done
        LOCKS_DATA_LOADED=true
    fi
}

# ========================================
# OPTIMIZED CORE FUNCTIONS
# ========================================

# Initialize session with lazy loading
init_session_optimized() {
    local session_data=$(cat <<EOF
{
  "id": "${CLAUDE_SESSION_ID}",
  "created": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "last_active": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "current_directory": "$(pwd)",
  "status": "active",
  "current_task": null,
  "locked_files": [],
  "shared_context": {},
  "capabilities": ["edit", "read", "write", "git", "npm", "build"],
  "pid": $$,
  "hostname": "$(hostname)"
}
EOF
    )
    
    # Write to file and cache immediately
    echo "$session_data" > "${SESSION_FILE}"
    update_session_cache "${CLAUDE_SESSION_ID}" "$session_data"
    
    # Initialize global state if it doesn't exist (lazy)
    if [ ! -f "${GLOBAL_STATE_FILE}" ]; then
        echo '{"sessions": {}, "shared_contexts": {}, "file_locks": {}, "project_state": {}}' > "${GLOBAL_STATE_FILE}"
    fi
    
    echo "✅ Claude coordination initialized (optimized): ${CLAUDE_SESSION_ID}"
}

# Optimized session update with caching
update_session_optimized() {
    if [ -f "${SESSION_FILE}" ]; then
        local cached_session=$(get_session_from_cache "${CLAUDE_SESSION_ID}")
        
        if [ -n "$cached_session" ]; then
            # Update cache first (faster)
            local updated_session=$(echo "$cached_session" | jq ".last_active = \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\" | .current_directory = \"$(pwd)\"")
            update_session_cache "${CLAUDE_SESSION_ID}" "$updated_session"
            
            # Write to disk (async in background)
            echo "$updated_session" > "${SESSION_FILE}" &
        else
            # Fallback to traditional method
            local temp_file=$(mktemp)
            jq ".last_active = \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\" | .current_directory = \"$(pwd)\"" "${SESSION_FILE}" > "${temp_file}"
            mv "${temp_file}" "${SESSION_FILE}"
        fi
    fi
}

# Optimized file lock with caching
acquire_file_lock_optimized() {
    local file_path="$1"
    local operation="${2:-edit}"
    local lock_key=$(echo "$file_path" | sed 's|/|_|g')
    local lock_file="${LOCK_DIR}/${lock_key}.lock"
    
    # Check cache first
    load_locks_data_lazy
    if [[ -n "${LOCK_CACHE[$lock_key]}" ]]; then
        local lock_owner=$(echo "${LOCK_CACHE[$lock_key]}" | jq -r '.session_id')
        if [ "$lock_owner" != "${CLAUDE_SESSION_ID}" ]; then
            local lock_time=$(echo "${LOCK_CACHE[$lock_key]}" | jq -r '.timestamp')
            echo "❌ File locked by session ${lock_owner} at ${lock_time} (from cache)"
            return 1
        fi
    fi
    
    # Create lock data
    local lock_data=$(cat <<EOF
{
  "session_id": "${CLAUDE_SESSION_ID}",
  "file_path": "${file_path}",
  "operation": "${operation}",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "pid": $$
}
EOF
    )
    
    # Update cache and file
    LOCK_CACHE[$lock_key]="$lock_data"
    echo "$lock_data" > "$lock_file"
    
    echo "🔒 File lock acquired (cached): ${file_path}"
    return 0
}

# Optimized session listing with cache
list_sessions_optimized() {
    load_session_data_lazy
    
    echo "🔍 Active Claude Code Sessions (Cached):"
    echo "========================================"
    
    local session_count=0
    for session_id in "${!SESSION_CACHE[@]}"; do
        local session_data="${SESSION_CACHE[$session_id]}"
        local status=$(echo "$session_data" | jq -r '.status')
        local last_active=$(echo "$session_data" | jq -r '.last_active')
        local current_dir=$(echo "$session_data" | jq -r '.current_directory')
        local current_task=$(echo "$session_data" | jq -r '.current_task // "none"')
        local hostname=$(echo "$session_data" | jq -r '.hostname // "unknown"')
        local pid=$(echo "$session_data" | jq -r '.pid // 0')
        
        if [ "$session_id" = "${CLAUDE_SESSION_ID}" ]; then
            echo "  ⭐ ${session_id} (CURRENT)"
        else
            echo "  📱 ${session_id}"
        fi
        
        echo "     Status: ${status} | Host: ${hostname} | PID: ${pid}"
        echo "     Directory: ${current_dir}"
        echo "     Task: ${current_task}"
        echo "     Last Active: ${last_active}"
        echo ""
        
        ((session_count++))
    done
    
    echo "💡 Showing ${session_count} sessions from cache"
}

# Background cache refresh process
start_cache_refresh_daemon() {
    (
        while true; do
            sleep "$CACHE_TTL"
            if is_cache_valid; then
                continue  # Skip if cache is still valid
            fi
            
            # Refresh cache in background
            invalidate_cache
            load_session_cache >/dev/null 2>&1
        done
    ) &
    
    echo "🔄 Cache refresh daemon started (TTL: ${CACHE_TTL}s)"
}

# Enhanced cleanup with batch processing
cleanup_coordination_optimized() {
    echo "🧹 Starting optimized cleanup..."
    
    local cleaned=0
    
    # Flush any pending broadcasts first
    flush_broadcast_queue
    
    # Clean old broadcasts and batch files
    if [ -d "${BROADCAST_DIR}" ]; then
        find "${BROADCAST_DIR}" -name "*.json" -mmin +60 -delete 2>/dev/null && ((cleaned++))
        find "${BROADCAST_DIR}/processed" -name "*.json" -mmin +1440 -delete 2>/dev/null # 24h for processed
    fi
    
    # Clean old file locks
    if [ -d "${LOCK_DIR}" ]; then
        local old_locks=$(find "${LOCK_DIR}" -name "*.lock" -mmin +30)
        if [ -n "$old_locks" ]; then
            echo "$old_locks" | while read -r lock_file; do
                if [ -f "$lock_file" ]; then
                    local lock_key=$(basename "$lock_file" .lock)
                    unset LOCK_CACHE[$lock_key]  # Remove from cache
                    rm "$lock_file"
                    ((cleaned++))
                fi
            done
        fi
    fi
    
    # Clean inactive sessions from cache and disk
    for session_file in "${SESSION_DIR}"/*.json; do
        if [ -f "$session_file" ]; then
            local session_id=$(basename "$session_file" .json)
            if [ "$session_id" != "${CLAUDE_SESSION_ID}" ]; then
                local file_age=$(( $(date +%s) - $(stat -c %Y "$session_file" 2>/dev/null || stat -f %m "$session_file" 2>/dev/null || echo 0) ))
                if [ $file_age -gt 7200 ]; then  # 2 hours
                    unset SESSION_CACHE[$session_id]  # Remove from cache
                    rm "$session_file"
                    echo "🧹 Cleaned inactive session: $session_id"
                    ((cleaned++))
                fi
            fi
        fi
    done
    
    # Invalidate cache after cleanup
    invalidate_cache
    
    if [ $cleaned -gt 0 ]; then
        echo "🧹 Optimized cleanup complete: $cleaned items removed"
    else
        echo "🧹 No cleanup needed"
    fi
}

# ========================================
# REPLACE ORIGINAL FUNCTIONS WITH OPTIMIZED VERSIONS
# ========================================

# Alias optimized functions to original names
alias init_session=init_session_optimized
alias update_session=update_session_optimized
alias acquire_file_lock=acquire_file_lock_optimized
alias list_sessions=list_sessions_optimized
alias check_messages=check_messages_optimized
alias cleanup_coordination=cleanup_coordination_optimized

# Use batch broadcasts instead of immediate
broadcast_message() {
    queue_broadcast "$@"
}

# ========================================
# HOOK FUNCTIONS WITH OPTIMIZATIONS
# ========================================

claude_pre_tool_hook_optimized() {
    update_session_optimized
    check_messages_optimized
    
    # Handle specific tool preparations with caching
    local tool_name="$1"
    case "$tool_name" in
        "Write"|"Edit"|"MultiEdit")
            local file_path="$2"
            if [ -n "$file_path" ]; then
                acquire_file_lock_optimized "$file_path" "$tool_name"
            fi
            ;;
    esac
}

claude_post_tool_hook_optimized() {
    local tool_name="$1"
    local tool_result="$2"
    
    # Handle tool cleanup and notifications
    case "$tool_name" in
        "Write"|"Edit"|"MultiEdit")
            local file_path="$2"
            if [ -n "$file_path" ]; then
                release_file_lock "$file_path"
                share_context "last_edited_file" "$file_path" "project"
                queue_broadcast "Modified file: $(basename "$file_path")" "normal"
            fi
            ;;
        "git commit")
            share_context "last_commit" "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" "project"
            queue_broadcast "Git commit completed" "normal"
            ;;
        "npm run build"|"npm run dev")
            share_context "last_${tool_name// /_}" "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" "project"
            queue_broadcast "Executed: ${tool_name}" "normal"
            ;;
    esac
    
    update_session_optimized
}

# Replace original hooks
export -f claude_pre_tool_hook_optimized claude_post_tool_hook_optimized
export CLAUDE_PRE_TOOL_HOOK="claude_pre_tool_hook_optimized"
export CLAUDE_POST_TOOL_HOOK="claude_post_tool_hook_optimized"

# Initialize optimized coordination system
init_session_optimized

# Start background processes
start_cache_refresh_daemon

# Enhanced cleanup on exit
trap 'flush_broadcast_queue; cleanup_coordination_optimized; rm -f "${SESSION_FILE}"; echo "🔌 Optimized Claude coordination disconnected"' EXIT

# Start background batch flush process
(
    while true; do
        sleep "$BATCH_FLUSH_INTERVAL"
        flush_broadcast_queue >/dev/null 2>&1
    done
) &

echo ""
echo "🚀 Claude Code Coordination System ACTIVATED (OPTIMIZED)!"
echo "=========================================================="
echo "📡 Session ID: ${CLAUDE_SESSION_ID}"
echo "💻 Hostname: $(hostname)"
echo "📁 Directory: $(pwd)"
echo ""
echo "⚡ Performance Optimizations Active:"
echo "  🧠 In-memory caching (TTL: ${CACHE_TTL}s)"
echo "  📦 Batch operations (size: ${BROADCAST_BATCH_SIZE})"
echo "  🔍 Lazy loading"
echo "  🔄 Background cache refresh"
echo "  🚀 Async disk writes"
echo ""
echo "🎯 Available Commands:"
echo "  /sessions     - List all active Claude sessions"
echo "  /status       - Show project coordination status"
echo "  /broadcast    - Send message to all sessions"
echo "  /context k=v  - Set project context"
echo "  /context key  - Get project context"
echo "  /task desc    - Set current task"
echo "  /task         - Clear current task"
echo "  /cleanup      - Clean old data"