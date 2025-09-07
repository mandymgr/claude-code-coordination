export interface ClaudeSession {
    /** Unique session identifier */
    id: string;
    /** ISO timestamp when session was created */
    created: string;
    /** ISO timestamp of last activity */
    last_active: string;
    /** Current working directory */
    current_directory: string;
    /** Session status */
    status: 'active' | 'idle' | 'disconnected';
    /** Current task description (if any) */
    current_task: string | null;
    /** List of files currently locked by this session */
    locked_files: string[];
    /** Session-specific context data */
    shared_context: Record<string, any>;
    /** Capabilities supported by this session */
    capabilities: string[];
    /** Process ID of the session */
    pid: number;
    /** Hostname where session is running */
    hostname: string;
}
export interface CoordinationMessage {
    /** ID of the session that sent the message */
    from_session: string;
    /** ISO timestamp when message was created */
    timestamp: string;
    /** Message priority level */
    priority: 'low' | 'normal' | 'high' | 'urgent';
    /** Target session ID or 'all' for broadcast */
    target: string | 'all';
    /** Message content */
    message: string;
    /** Working directory when message was sent */
    current_directory: string;
    /** Hostname where message originated */
    hostname: string;
}
export interface FileLock {
    /** Session that owns the lock */
    session_id: string;
    /** Full path to the locked file */
    file_path: string;
    /** Type of operation (edit, write, etc.) */
    operation: string;
    /** ISO timestamp when lock was created */
    timestamp: string;
    /** Process ID that created the lock */
    pid: number;
}
export interface GlobalCoordinationState {
    /** All active sessions indexed by session ID */
    sessions: Record<string, ClaudeSession>;
    /** Shared context data */
    shared_contexts: {
        /** Global context shared across all projects */
        global: Record<string, any>;
    };
    /** File locks indexed by file path */
    file_locks: Record<string, FileLock>;
    /** Project-specific state data */
    project_state: Record<string, any>;
}
export interface CoordinationConfig {
    /** Project display name */
    project_name?: string;
    /** Absolute path to project root */
    project_root?: string;
    /** Whether coordination is enabled */
    coordination_enabled: boolean;
    /** Hours before a session is considered inactive */
    session_timeout_hours: number;
    /** Hours to retain messages before cleanup */
    message_retention_hours: number;
    /** Minutes before file locks expire */
    lock_timeout_minutes: number;
    /** Minutes between automatic cleanup runs */
    cleanup_interval_minutes: number;
    /** Feature toggles */
    features: {
        /** Enable file locking system */
        file_locking: boolean;
        /** Enable inter-session messaging */
        inter_session_messaging: boolean;
        /** Enable context sharing */
        context_sharing: boolean;
        /** Enable task coordination */
        task_coordination: boolean;
        /** Enable automatic cleanup */
        automatic_cleanup: boolean;
    };
    /** Repository paths for multi-repo projects */
    repositories?: Record<string, string>;
}
export type CoordinationCommand = 'sessions' | 'status' | 'broadcast' | 'context' | 'task' | 'cleanup';
export interface CoordinationHookResult {
    /** Whether to continue with normal Claude Code processing */
    should_continue: boolean;
    /** Optional message to display to user */
    message?: string;
}
export interface SessionStatistics {
    /** Total number of active sessions */
    active_sessions: number;
    /** Number of pending messages */
    pending_messages: number;
    /** Number of active file locks */
    active_locks: number;
    /** Number of shared context keys */
    shared_contexts: number;
    /** Uptime of coordination system in milliseconds */
    uptime_ms: number;
}
export interface CoordinationEvent {
    /** Event type */
    type: 'session_start' | 'session_end' | 'message_sent' | 'file_locked' | 'file_unlocked' | 'context_shared' | 'task_updated';
    /** Session that triggered the event */
    session_id: string;
    /** ISO timestamp of the event */
    timestamp: string;
    /** Event-specific data */
    data: Record<string, any>;
}
export type PreToolHook = (tool_name: string, ...args: any[]) => void | Promise<void>;
export type PostToolHook = (tool_name: string, result: any, ...args: any[]) => void | Promise<void>;
export type UserPromptHook = (user_input: string) => CoordinationHookResult | Promise<CoordinationHookResult>;
export interface CoordinationHooks {
    /** Hook called before tool execution */
    pre_tool?: PreToolHook;
    /** Hook called after tool execution */
    post_tool?: PostToolHook;
    /** Hook called when user submits a prompt */
    user_prompt_submit?: UserPromptHook;
}
export interface ValidationError {
    field: string;
    message: string;
    value: any;
}
export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}
export interface CoordinationUtils {
    /** Validate configuration object */
    validateConfig(config: Partial<CoordinationConfig>): ValidationResult;
    /** Generate unique session ID */
    generateSessionId(): string;
    /** Check if a session is active */
    isSessionActive(session: ClaudeSession): boolean;
    /** Calculate session uptime */
    getSessionUptime(session: ClaudeSession): number;
    /** Format timestamp for display */
    formatTimestamp(timestamp: string): string;
}
//# sourceMappingURL=types%202.d.ts.map