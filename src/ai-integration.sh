#!/bin/bash

# Claude Code Coordination - AI Integration Module
# Integrates AI-powered features into the coordination hooks system

COORDINATION_DIR="${COORDINATION_DIR:-$(pwd)/.claude-coordination}"
AI_COORDINATOR_PATH="$(dirname "$0")/ai-coordinator.js"

# Check if AI coordinator is available
check_ai_coordinator() {
    if [ ! -f "$AI_COORDINATOR_PATH" ]; then
        return 1
    fi
    return 0
}

# Generate AI task suggestions
ai_suggest_tasks() {
    local session_id="$1"
    local files=("${@:2}")
    
    if ! check_ai_coordinator; then
        return 1
    fi
    
    if [ ${#files[@]} -gt 0 ]; then
        node "$AI_COORDINATOR_PATH" suggest "$session_id" "${files[@]}" 2>/dev/null
    else
        node "$AI_COORDINATOR_PATH" suggest "$session_id" 2>/dev/null
    fi
}

# Predict conflicts for a file
ai_predict_conflicts() {
    local file_path="$1"
    local session_id="$2"
    
    if ! check_ai_coordinator; then
        return 1
    fi
    
    node "$AI_COORDINATOR_PATH" predict "$file_path" "$session_id" 2>/dev/null
}

# Auto-assign task to best session
ai_assign_task() {
    local task_description="$*"
    
    if ! check_ai_coordinator; then
        return 1
    fi
    
    node "$AI_COORDINATOR_PATH" assign "$task_description" 2>/dev/null
}

# Learn from completed task
ai_learn_completion() {
    local session_id="$1"
    local task="$2"
    local success="$3"
    local duration="$4"
    
    if ! check_ai_coordinator; then
        return 1
    fi
    
    node "$AI_COORDINATOR_PATH" learn "$session_id" "$task" "$success" "$duration" 2>/dev/null
}

# Smart conflict warning before file edit
ai_pre_edit_check() {
    local file_path="$1"
    local session_id="$2"
    
    if ! check_ai_coordinator; then
        return 0  # No AI available, proceed without warning
    fi
    
    # Get conflict prediction
    local prediction=$(ai_predict_conflicts "$file_path" "$session_id")
    
    if [ -n "$prediction" ]; then
        # Extract conflict risk percentage
        local risk=$(echo "$prediction" | grep "Conflict Risk:" | sed 's/.*Conflict Risk: \([0-9]*\)%.*/\1/')
        
        if [ "$risk" -gt 70 ]; then
            echo "⚠️  HIGH CONFLICT RISK for $file_path ($risk%)"
            echo "💡 Consider coordinating with other sessions before editing"
            
            # Show specific warnings if any
            local warnings=$(echo "$prediction" | sed -n '/Risk Factors:/,/Recommendations:/p' | grep -v "Risk Factors:" | grep -v "Recommendations:" | grep "•")
            if [ -n "$warnings" ]; then
                echo "$warnings"
            fi
            
            return 1  # Signal high risk
        elif [ "$risk" -gt 40 ]; then
            echo "⚠️  Moderate conflict risk for $file_path ($risk%)"
            return 0
        fi
    fi
    
    return 0  # Low or no risk
}

# Smart task suggestions when session starts
ai_session_startup() {
    local session_id="$1"
    
    if ! check_ai_coordinator; then
        return 0
    fi
    
    echo "🤖 AI-powered coordination active!"
    echo "💡 Getting intelligent task suggestions..."
    
    local suggestions=$(ai_suggest_tasks "$session_id")
    
    if [ -n "$suggestions" ] && [[ "$suggestions" != *"No specific suggestions"* ]]; then
        echo ""
        echo "$suggestions"
        echo ""
        echo "📋 Use /ai-suggest to get more suggestions anytime"
    fi
}

# Post-task learning
ai_post_task_learning() {
    local session_id="$1"
    local task="$2"
    local success="$3"
    local start_time="$4"
    
    if ! check_ai_coordinator; then
        return 0
    fi
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    # Learn from the task completion
    ai_learn_completion "$session_id" "$task" "$success" "$duration" >/dev/null 2>&1
    
    if [ "$success" = "true" ]; then
        echo "🧠 AI learning: Task completion recorded (${duration}s)"
    fi
}

# Enhanced broadcast with AI context
ai_enhanced_broadcast() {
    local session_id="$1"
    local message="$2"
    local priority="$3"
    
    # Add AI context to broadcasts about task completion
    if [[ "$message" =~ "completed"||"finished"||"done" ]]; then
        local context="[AI: Task completion detected]"
        message="$context $message"
    elif [[ "$message" =~ "starting"||"working on"||"implementing" ]]; then
        local context="[AI: New task detected]"
        message="$context $message"
    fi
    
    echo "$message"
}

# Main AI coordination commands
case "${1:-help}" in
    "suggest")
        shift
        ai_suggest_tasks "$CLAUDE_SESSION_ID" "$@"
        ;;
    "predict")
        shift
        ai_predict_conflicts "$@" "$CLAUDE_SESSION_ID"
        ;;
    "assign")
        shift
        ai_assign_task "$@"
        ;;
    "learn")
        shift
        ai_learn_completion "$@"
        ;;
    "pre-edit")
        shift
        ai_pre_edit_check "$@" "$CLAUDE_SESSION_ID"
        ;;
    "startup")
        shift
        ai_session_startup "$@"
        ;;
    "help"|*)
        echo "Claude Code Coordination - AI Integration Commands"
        echo ""
        echo "Usage: source ai-integration.sh && <command>"
        echo ""
        echo "Commands:"
        echo "  suggest [files...]     Get AI task suggestions"
        echo "  predict <file>         Predict conflicts for file"
        echo "  assign <task>          Auto-assign task to best session"
        echo "  learn <args>           Learn from task completion"
        echo "  pre-edit <file>        Check conflicts before editing"
        echo "  startup                Show startup suggestions"
        echo ""
        echo "Functions available after sourcing:"
        echo "  ai_suggest_tasks       - Generate task suggestions"
        echo "  ai_predict_conflicts   - Predict file conflicts"
        echo "  ai_assign_task         - Auto-assign tasks"
        echo "  ai_pre_edit_check      - Pre-edit conflict check"
        echo "  ai_session_startup     - Session startup suggestions"
        echo "  ai_post_task_learning  - Learn from completions"
        ;;
esac