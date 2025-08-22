#!/bin/bash

# Claude Code Coordination System - Complete Implementation
# Enables full communication and coordination between multiple Claude Code terminal instances

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

# Initialize session with full state tracking
init_session() {
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
    echo "$session_data" > "${SESSION_FILE}"
    
    # Initialize global state if it doesn't exist
    if [ ! -f "${GLOBAL_STATE_FILE}" ]; then
        echo '{"sessions": {}, "shared_contexts": {}, "file_locks": {}, "project_state": {}}' > "${GLOBAL_STATE_FILE}"
    fi
    
    echo "✅ Claude coordination initialized: ${CLAUDE_SESSION_ID}"
}

# Update session activity and sync with global state
update_session() {
    if [ -f "${SESSION_FILE}" ]; then
        local temp_file=$(mktemp)
        jq ".last_active = \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\" | .current_directory = \"$(pwd)\"" "${SESSION_FILE}" > "${temp_file}"
        mv "${temp_file}" "${SESSION_FILE}"
        
        # Sync to global state
        sync_to_global_state
    fi
}

# Sync session data to global state
sync_to_global_state() {
    if [ -f "${SESSION_FILE}" ] && [ -f "${GLOBAL_STATE_FILE}" ]; then
        local session_data=$(cat "${SESSION_FILE}")
        local temp_global=$(mktemp)
        
        jq ".sessions[\"${CLAUDE_SESSION_ID}\"] = ${session_data}" "${GLOBAL_STATE_FILE}" > "${temp_global}"
        mv "${temp_global}" "${GLOBAL_STATE_FILE}"
    fi
}

# File locking system
acquire_file_lock() {
    local file_path="$1"
    local operation="${2:-edit}"
    local lock_file="${LOCK_DIR}/$(echo "$file_path" | sed 's|/|_|g').lock"
    
    if [ -f "$lock_file" ]; then
        local lock_owner=$(cat "$lock_file" | jq -r '.session_id')
        if [ "$lock_owner" != "${CLAUDE_SESSION_ID}" ]; then
            local lock_time=$(cat "$lock_file" | jq -r '.timestamp')
            echo "❌ File locked by session ${lock_owner} at ${lock_time}"
            return 1
        fi
    fi
    
    # Create lock
    cat <<EOF > "$lock_file"
{
  "session_id": "${CLAUDE_SESSION_ID}",
  "file_path": "${file_path}",
  "operation": "${operation}",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "pid": $$
}
EOF
    
    echo "🔒 File lock acquired: ${file_path}"
    return 0
}

# Release file lock
release_file_lock() {
    local file_path="$1"
    local lock_file="${LOCK_DIR}/$(echo "$file_path" | sed 's|/|_|g').lock"
    
    if [ -f "$lock_file" ]; then
        local lock_owner=$(cat "$lock_file" | jq -r '.session_id')
        if [ "$lock_owner" = "${CLAUDE_SESSION_ID}" ]; then
            rm "$lock_file"
            echo "🔓 File lock released: ${file_path}"
        fi
    fi
}

# Broadcast system for inter-session communication
broadcast_message() {
    local message="$1"
    local priority="${2:-normal}"
    local target="${3:-all}"
    local broadcast_file="${BROADCAST_DIR}/$(date +%s%N)-${CLAUDE_SESSION_ID}.json"
    
    cat <<EOF > "${broadcast_file}"
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
    
    echo "📢 Broadcast: ${message} (priority: ${priority})"
}

# Check for incoming messages
check_messages() {
    local unread_count=0
    for broadcast_file in "${BROADCAST_DIR}"/*.json; do
        if [ -f "$broadcast_file" ]; then
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
                
                # Mark as read by moving to processed
                mkdir -p "${BROADCAST_DIR}/processed"
                mv "$broadcast_file" "${BROADCAST_DIR}/processed/"
            fi
        fi
    done
    
    if [ $unread_count -gt 0 ]; then
        echo "📬 $unread_count new messages processed"
    fi
}

# Context sharing system
share_context() {
    local key="$1"
    local value="$2"
    local scope="${3:-session}"  # session, project, or global
    
    case "$scope" in
        "project")
            if [ -f "${GLOBAL_STATE_FILE}" ]; then
                local temp_file=$(mktemp)
                jq ".project_state[\"${key}\"] = \"${value}\"" "${GLOBAL_STATE_FILE}" > "${temp_file}"
                mv "${temp_file}" "${GLOBAL_STATE_FILE}"
                broadcast_message "Context updated: ${key} = ${value}" "low"
            fi
            ;;
        "global")
            if [ -f "${GLOBAL_STATE_FILE}" ]; then
                local temp_file=$(mktemp)
                jq ".shared_contexts.global[\"${key}\"] = \"${value}\"" "${GLOBAL_STATE_FILE}" > "${temp_file}"
                mv "${temp_file}" "${GLOBAL_STATE_FILE}"
                broadcast_message "Global context: ${key} = ${value}" "normal"
            fi
            ;;
        *)
            # Session scope
            if [ -f "${SESSION_FILE}" ]; then
                local temp_file=$(mktemp)
                jq ".shared_context[\"${key}\"] = \"${value}\"" "${SESSION_FILE}" > "${temp_file}"
                mv "${temp_file}" "${SESSION_FILE}"
                sync_to_global_state
            fi
            ;;
    esac
    
    echo "🔄 Context shared (${scope}): ${key} = ${value}"
}

# Get context from any scope
get_context() {
    local key="$1"
    local scope="${2:-session}"
    local session_id="${3:-${CLAUDE_SESSION_ID}}"
    
    if [ -f "${GLOBAL_STATE_FILE}" ]; then
        case "$scope" in
            "project")
                jq -r ".project_state[\"${key}\"] // empty" "${GLOBAL_STATE_FILE}" 2>/dev/null
                ;;
            "global")
                jq -r ".shared_contexts.global[\"${key}\"] // empty" "${GLOBAL_STATE_FILE}" 2>/dev/null
                ;;
            *)
                jq -r ".sessions[\"${session_id}\"].shared_context[\"${key}\"] // empty" "${GLOBAL_STATE_FILE}" 2>/dev/null
                ;;
        esac
    fi
}

# Task coordination
set_current_task() {
    local task="$1"
    
    if [ -f "${SESSION_FILE}" ]; then
        local temp_file=$(mktemp)
        if [ -n "$task" ]; then
            jq ".current_task = \"${task}\"" "${SESSION_FILE}" > "${temp_file}"
            echo "📋 Current task: ${task}"
            broadcast_message "Started task: ${task}" "low"
        else
            jq ".current_task = null" "${SESSION_FILE}" > "${temp_file}"
            echo "✅ Task completed"
            broadcast_message "Task completed" "low"
        fi
        mv "${temp_file}" "${SESSION_FILE}"
        sync_to_global_state
    fi
}

# List all sessions with detailed info
list_sessions() {
    echo "🔍 Active Claude Code Sessions:"
    echo "================================"
    
    for session_file in "${SESSION_DIR}"/*.json; do
        if [ -f "$session_file" ]; then
            local session_id=$(basename "$session_file" .json)
            local session_data=$(cat "$session_file")
            local status=$(echo "$session_data" | jq -r '.status')
            local last_active=$(echo "$session_data" | jq -r '.last_active')
            local current_dir=$(echo "$session_data" | jq -r '.current_directory')
            local current_task=$(echo "$session_data" | jq -r '.current_task // "none"')
            local hostname=$(echo "$session_data" | jq -r '.hostname // "unknown"')
            local pid=$(echo "$session_data" | jq -r '.pid // 0')
            
            if [ "$session_id" = "${CLAUDE_SESSION_ID}" ]; then
                echo "  ⭐ ${session_id} (CURRENT)"
                echo "     Status: ${status} | Host: ${hostname} | PID: ${pid}"
                echo "     Directory: ${current_dir}"
                echo "     Task: ${current_task}"
                echo "     Last Active: ${last_active}"
            else
                echo "  📱 ${session_id}"
                echo "     Status: ${status} | Host: ${hostname} | PID: ${pid}"
                echo "     Directory: ${current_dir}"
                echo "     Task: ${current_task}"
                echo "     Last Active: ${last_active}"
            fi
            echo ""
        fi
    done
}

# Comprehensive cleanup
cleanup_coordination() {
    local cleaned=0
    
    # Clean old broadcasts (older than 1 hour)
    if [ -d "${BROADCAST_DIR}" ]; then
        find "${BROADCAST_DIR}" -name "*.json" -mmin +60 -delete 2>/dev/null && ((cleaned++))
        find "${BROADCAST_DIR}/processed" -name "*.json" -mmin +1440 -delete 2>/dev/null # 24h for processed
    fi
    
    # Clean old file locks (older than 30 minutes)
    if [ -d "${LOCK_DIR}" ]; then
        find "${LOCK_DIR}" -name "*.lock" -mmin +30 -delete 2>/dev/null && ((cleaned++))
    fi
    
    # Clean inactive sessions (older than 2 hours)
    for session_file in "${SESSION_DIR}"/*.json; do
        if [ -f "$session_file" ]; then
            local session_id=$(basename "$session_file" .json)
            if [ "$session_id" != "${CLAUDE_SESSION_ID}" ]; then
                # Check file age
                local file_age=$(( $(date +%s) - $(stat -c %Y "$session_file" 2>/dev/null || stat -f %m "$session_file" 2>/dev/null || echo 0) ))
                if [ $file_age -gt 7200 ]; then  # 2 hours
                    rm "$session_file"
                    echo "🧹 Cleaned inactive session: $session_id"
                    ((cleaned++))
                fi
            fi
        fi
    done
    
    if [ $cleaned -gt 0 ]; then
        echo "🧹 Cleanup complete: $cleaned items removed"
    else
        echo "🧹 No cleanup needed"
    fi
}

# Project state management
get_project_status() {
    echo "📊 Project Coordination Status:"
    echo "==============================="
    
    local active_sessions=$(ls -1 "${SESSION_DIR}"/*.json 2>/dev/null | wc -l)
    local pending_messages=$(ls -1 "${BROADCAST_DIR}"/*.json 2>/dev/null | wc -l)
    local active_locks=$(ls -1 "${LOCK_DIR}"/*.lock 2>/dev/null | wc -l)
    
    echo "Active Sessions: $active_sessions"
    echo "Pending Messages: $pending_messages"
    echo "Active File Locks: $active_locks"
    echo ""
    
    if [ -f "${GLOBAL_STATE_FILE}" ]; then
        echo "📋 Project Context:"
        jq -r '.project_state | to_entries[] | "  \(.key): \(.value)"' "${GLOBAL_STATE_FILE}" 2>/dev/null || echo "  (none)"
    fi
}

# Hook functions for Claude Code integration
claude_pre_tool_hook() {
    update_session
    check_messages
    
    # Handle specific tool preparations
    local tool_name="$1"
    case "$tool_name" in
        "Write"|"Edit"|"MultiEdit")
            local file_path="$2"
            if [ -n "$file_path" ]; then
                acquire_file_lock "$file_path" "$tool_name"
            fi
            ;;
    esac
}

claude_post_tool_hook() {
    local tool_name="$1"
    local tool_result="$2"
    
    # Handle tool cleanup and notifications
    case "$tool_name" in
        "Write"|"Edit"|"MultiEdit")
            local file_path="$2"
            if [ -n "$file_path" ]; then
                release_file_lock "$file_path"
                share_context "last_edited_file" "$file_path" "project"
                broadcast_message "Modified file: $(basename "$file_path")" "normal"
            fi
            ;;
        "git commit")
            share_context "last_commit" "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" "project"
            broadcast_message "Git commit completed" "normal"
            ;;
        "npm run build"|"npm run dev")
            share_context "last_${tool_name// /_}" "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" "project"
            broadcast_message "Executed: ${tool_name}" "normal"
            ;;
    esac
    
    update_session
}

# User command processing
claude_user_prompt_submit_hook() {
    local user_input="$1"
    
    # Process coordination commands
    case "$user_input" in
        "/sessions")
            list_sessions
            return 1  # Block normal processing
            ;;
        "/status")
            get_project_status
            return 1
            ;;
        "/broadcast "*)
            local message="${user_input#/broadcast }"
            broadcast_message "$message" "high"
            return 1
            ;;
        "/cleanup")
            cleanup_coordination
            return 1
            ;;
        "/context "*)
            local context_cmd="${user_input#/context }"
            if [[ "$context_cmd" == *"="* ]]; then
                local key="${context_cmd%%=*}"
                local value="${context_cmd#*=}"
                share_context "$key" "$value" "project"
            else
                local result=$(get_context "$context_cmd" "project")
                if [ -n "$result" ]; then
                    echo "📋 ${context_cmd}: $result"
                else
                    echo "❌ Context not found: $context_cmd"
                fi
            fi
            return 1
            ;;
        "/task "*)
            local task="${user_input#/task }"
            set_current_task "$task"
            return 1
            ;;
        "/task")
            set_current_task ""
            return 1
            ;;
    esac
    
    return 0  # Continue normal processing
}

# Export all functions
export -f claude_pre_tool_hook claude_post_tool_hook claude_user_prompt_submit_hook
export -f init_session update_session acquire_file_lock release_file_lock
export -f broadcast_message check_messages share_context get_context set_current_task
export -f list_sessions cleanup_coordination get_project_status

# Set up Claude Code hooks
export CLAUDE_PRE_TOOL_HOOK="claude_pre_tool_hook"
export CLAUDE_POST_TOOL_HOOK="claude_post_tool_hook"
export CLAUDE_USER_PROMPT_SUBMIT_HOOK="claude_user_prompt_submit_hook"

# Initialize coordination system
init_session

# Set up cleanup on exit
trap 'cleanup_coordination; rm -f "${SESSION_FILE}"; echo "🔌 Claude coordination disconnected"' EXIT

# Start background maintenance (every 5 minutes)
(
    while true; do
        sleep 300
        cleanup_coordination >/dev/null 2>&1
    done
) &

echo ""
echo "🚀 Claude Code Coordination System ACTIVATED!"
echo "================================================"
echo "📡 Session ID: ${CLAUDE_SESSION_ID}"
echo "💻 Hostname: $(hostname)"
echo "📁 Directory: $(pwd)"
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
echo ""
echo "✨ Features Active:"
echo "  📝 File locking system"
echo "  💬 Inter-session messaging"
echo "  🔄 Context sharing"
echo "  📋 Task coordination"
echo "  🧹 Automatic cleanup"