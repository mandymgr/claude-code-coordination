#!/bin/bash

# Claude Code Coordination - File Watcher Module
# Real-time file monitoring using fswatch/inotify for instant synchronization

COORDINATION_DIR="${COORDINATION_DIR:-$(pwd)/.claude-coordination}"
SESSION_DIR="${COORDINATION_DIR}/sessions"
BROADCAST_DIR="${COORDINATION_DIR}/broadcasts"
LOCK_DIR="${COORDINATION_DIR}/locks"

# Check available file watching tools
WATCHER=""
if command -v fswatch >/dev/null 2>&1; then
    WATCHER="fswatch"
elif command -v inotifywait >/dev/null 2>&1; then
    WATCHER="inotifywait"
else
    echo "⚠️  No file watcher available. Install fswatch (macOS) or inotify-tools (Linux)"
    exit 1
fi

echo "🔍 Using ${WATCHER} for file monitoring"

# File watcher callbacks
on_session_change() {
    local changed_file="$1"
    local session_id=$(basename "$changed_file" .json)
    
    if [ "$session_id" != "$CLAUDE_SESSION_ID" ]; then
        echo "📱 Session updated: $session_id"
        # Invalidate cache for real-time updates
        if declare -F invalidate_session_cache >/dev/null; then
            invalidate_session_cache "$session_id"
        fi
        
        # Notify user about session changes
        if declare -F check_session_changes >/dev/null; then
            check_session_changes "$session_id"
        fi
    fi
}

on_broadcast_change() {
    local changed_file="$1"
    
    # Skip if it's our own broadcast
    if [[ "$changed_file" =~ $CLAUDE_SESSION_ID ]]; then
        return
    fi
    
    echo "📨 New message detected: $(basename "$changed_file")"
    
    # Immediately process new messages
    if declare -F process_new_message >/dev/null; then
        process_new_message "$changed_file"
    fi
}

on_lock_change() {
    local changed_file="$1"
    local action="$2"  # created, modified, deleted
    
    local lock_key=$(basename "$changed_file" .lock)
    
    case "$action" in
        "created"|"modified")
            echo "🔒 File locked: $lock_key"
            # Update lock cache
            if declare -F update_lock_cache >/dev/null; then
                update_lock_cache "$lock_key" "$changed_file"
            fi
            ;;
        "deleted")
            echo "🔓 File unlocked: $lock_key"
            # Remove from lock cache
            if declare -F remove_lock_cache >/dev/null; then
                remove_lock_cache "$lock_key"
            fi
            ;;
    esac
}

# Enhanced message processing for real-time updates
process_new_message() {
    local message_file="$1"
    
    if [ ! -f "$message_file" ]; then
        return
    fi
    
    local from_session=$(jq -r '.from_session' "$message_file" 2>/dev/null || echo "unknown")
    local target=$(jq -r '.target' "$message_file" 2>/dev/null || echo "all")
    local priority=$(jq -r '.priority' "$message_file" 2>/dev/null || echo "normal")
    local message=$(jq -r '.message' "$message_file" 2>/dev/null || echo "")
    local timestamp=$(jq -r '.timestamp' "$message_file" 2>/dev/null || echo "")
    
    # Only show messages targeted to us or broadcast to all
    if [ "$target" = "all" ] || [ "$target" = "$CLAUDE_SESSION_ID" ]; then
        case "$priority" in
            "urgent")
                echo "🚨 URGENT from ${from_session}: ${message}"
                # macOS notification
                if command -v osascript >/dev/null 2>&1; then
                    osascript -e "display notification \"${message}\" with title \"Urgent Claude Message\" subtitle \"From: ${from_session}\""
                fi
                ;;
            "high")
                echo "⚡ HIGH from ${from_session}: ${message}"
                ;;
            *)
                echo "📨 ${from_session}: ${message}"
                ;;
        esac
        
        # Mark as processed
        mkdir -p "${BROADCAST_DIR}/processed"
        mv "$message_file" "${BROADCAST_DIR}/processed/" 2>/dev/null || true
    fi
}

# Check for session changes and notify about important events
check_session_changes() {
    local session_id="$1"
    local session_file="${SESSION_DIR}/${session_id}.json"
    
    if [ -f "$session_file" ]; then
        local session_data=$(cat "$session_file")
        local status=$(echo "$session_data" | jq -r '.status')
        local task=$(echo "$session_data" | jq -r '.current_task // "none"')
        local directory=$(echo "$session_data" | jq -r '.current_directory')
        
        # Notify about status changes
        case "$status" in
            "active")
                echo "✅ Session $session_id is now active"
                ;;
            "idle")
                echo "😴 Session $session_id is now idle"
                ;;
            "disconnected")
                echo "📴 Session $session_id disconnected"
                ;;
        esac
        
        # Notify about task changes
        if [ "$task" != "none" ]; then
            echo "📋 Session $session_id task: $task"
        fi
    fi
}

# Start fswatch monitoring
start_fswatch() {
    echo "🚀 Starting fswatch file monitoring..."
    
    # Monitor sessions directory
    fswatch -o "$SESSION_DIR" | while read num_changes; do
        for session_file in "$SESSION_DIR"/*.json; do
            if [ -f "$session_file" ]; then
                on_session_change "$session_file"
            fi
        done
    done &
    
    # Monitor broadcasts directory  
    fswatch -o "$BROADCAST_DIR" | while read num_changes; do
        for broadcast_file in "$BROADCAST_DIR"/*.json; do
            if [ -f "$broadcast_file" ] && [[ ! "$broadcast_file" =~ processed ]]; then
                on_broadcast_change "$broadcast_file"
            fi
        done
    done &
    
    # Monitor locks directory
    fswatch --event Created --event Updated --event Removed "$LOCK_DIR" | while read event_path event_flags; do
        local action=""
        if [[ "$event_flags" =~ "Created" ]]; then
            action="created"
        elif [[ "$event_flags" =~ "Updated" ]]; then
            action="modified"  
        elif [[ "$event_flags" =~ "Removed" ]]; then
            action="deleted"
        fi
        
        if [ -n "$action" ]; then
            on_lock_change "$event_path" "$action"
        fi
    done &
    
    echo "✅ fswatch monitoring started for sessions, broadcasts, and locks"
}

# Start inotifywait monitoring (Linux)
start_inotifywait() {
    echo "🚀 Starting inotifywait file monitoring..."
    
    # Monitor all coordination directories
    inotifywait -m -r --format '%w%f %e' \
        -e create,modify,delete,move \
        "$SESSION_DIR" "$BROADCAST_DIR" "$LOCK_DIR" | \
    while read file event; do
        case "$file" in
            "$SESSION_DIR"/*.json)
                if [[ "$event" =~ (CREATE|MODIFY) ]]; then
                    on_session_change "$file"
                fi
                ;;
            "$BROADCAST_DIR"/*.json)
                if [[ "$event" =~ (CREATE|MODIFY) ]] && [[ ! "$file" =~ processed ]]; then
                    on_broadcast_change "$file"
                fi
                ;;
            "$LOCK_DIR"/*.lock)
                local action=""
                if [[ "$event" =~ CREATE ]]; then
                    action="created"
                elif [[ "$event" =~ MODIFY ]]; then
                    action="modified"
                elif [[ "$event" =~ DELETE ]]; then
                    action="deleted"
                fi
                
                if [ -n "$action" ]; then
                    on_lock_change "$file" "$action"
                fi
                ;;
        esac
    done &
    
    echo "✅ inotifywait monitoring started for coordination directories"
}

# Start appropriate file watcher
start_file_watcher() {
    case "$WATCHER" in
        "fswatch")
            start_fswatch
            ;;
        "inotifywait")
            start_inotifywait
            ;;
        *)
            echo "❌ No supported file watcher available"
            return 1
            ;;
    esac
    
    # Store watcher PID for cleanup
    echo $! > "$COORDINATION_DIR/watcher.pid"
    
    echo "🎯 Real-time file monitoring active!"
    echo "   📁 Sessions: $SESSION_DIR"
    echo "   📨 Messages: $BROADCAST_DIR" 
    echo "   🔒 Locks: $LOCK_DIR"
}

# Stop file watcher
stop_file_watcher() {
    if [ -f "$COORDINATION_DIR/watcher.pid" ]; then
        local watcher_pid=$(cat "$COORDINATION_DIR/watcher.pid")
        if kill -0 "$watcher_pid" 2>/dev/null; then
            kill "$watcher_pid"
            echo "🛑 File watcher stopped"
        fi
        rm -f "$COORDINATION_DIR/watcher.pid"
    fi
}

# Install file watcher if missing
install_file_watcher() {
    echo "📦 Installing file watcher..."
    
    case "$(uname)" in
        "Darwin")
            if command -v brew >/dev/null 2>&1; then
                echo "Installing fswatch with Homebrew..."
                brew install fswatch
            else
                echo "Please install Homebrew first: https://brew.sh"
                exit 1
            fi
            ;;
        "Linux")
            if command -v apt-get >/dev/null 2>&1; then
                echo "Installing inotify-tools with apt..."
                sudo apt-get update && sudo apt-get install -y inotify-tools
            elif command -v yum >/dev/null 2>&1; then
                echo "Installing inotify-tools with yum..."
                sudo yum install -y inotify-tools
            elif command -v pacman >/dev/null 2>&1; then
                echo "Installing inotify-tools with pacman..."
                sudo pacman -S inotify-tools
            else
                echo "Please install inotify-tools manually"
                exit 1
            fi
            ;;
        *)
            echo "Unsupported platform for automatic installation"
            exit 1
            ;;
    esac
    
    echo "✅ File watcher installed successfully"
}

# Enhanced cache functions for real-time updates
invalidate_session_cache() {
    local session_id="$1"
    if [ -n "$session_id" ] && declare -A SESSION_CACHE >/dev/null 2>&1; then
        unset SESSION_CACHE["$session_id"]
        echo "🔄 Cache invalidated for session: $session_id"
    fi
}

update_lock_cache() {
    local lock_key="$1" 
    local lock_file="$2"
    
    if [ -f "$lock_file" ] && declare -A LOCK_CACHE >/dev/null 2>&1; then
        LOCK_CACHE["$lock_key"]=$(cat "$lock_file")
        echo "🔄 Lock cache updated: $lock_key"
    fi
}

remove_lock_cache() {
    local lock_key="$1"
    if declare -A LOCK_CACHE >/dev/null 2>&1; then
        unset LOCK_CACHE["$lock_key"]
        echo "🔄 Lock cache cleared: $lock_key"
    fi
}

# Main function
main() {
    case "$1" in
        "start")
            start_file_watcher
            ;;
        "stop")
            stop_file_watcher
            ;;
        "install")
            install_file_watcher
            ;;
        "status")
            if [ -f "$COORDINATION_DIR/watcher.pid" ]; then
                local watcher_pid=$(cat "$COORDINATION_DIR/watcher.pid")
                if kill -0 "$watcher_pid" 2>/dev/null; then
                    echo "✅ File watcher running (PID: $watcher_pid)"
                else
                    echo "❌ File watcher not running"
                fi
            else
                echo "❌ File watcher not started"
            fi
            ;;
        *)
            echo "Usage: $0 {start|stop|install|status}"
            echo ""
            echo "Commands:"
            echo "  start   - Start real-time file monitoring"
            echo "  stop    - Stop file monitoring"
            echo "  install - Install file watcher (fswatch/inotify-tools)"
            echo "  status  - Show watcher status"
            ;;
    esac
}

# Auto-start if sourced with coordination system
if [ -n "$CLAUDE_SESSION_ID" ] && [ "$1" != "install" ]; then
    if [ -z "$WATCHER" ]; then
        echo "⚠️  File watcher not available. Real-time monitoring disabled."
        echo "💡 Install with: $0 install"
    else
        # Auto-start file watcher when coordination is active
        start_file_watcher >/dev/null 2>&1 &
        
        # Set up cleanup on exit
        trap 'stop_file_watcher >/dev/null 2>&1' EXIT
    fi
fi

# Run main function if called directly
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
fi