"use strict";
// KRINS Universe Builder - Complete Type System
// Comprehensive TypeScript definitions for AI coordination and development system
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeType = exports.DeliverableType = exports.TaskType = exports.TaskPriority = exports.TaskStatus = exports.AICapability = exports.AgentStatus = exports.AIAgentType = exports.UserRole = exports.ERROR_CODES = exports.WEBSOCKET_EVENTS = exports.API_ENDPOINTS = void 0;
exports.generateId = generateId;
exports.formatDate = formatDate;
exports.formatTime = formatTime;
exports.formatDuration = formatDuration;
exports.validateEmail = validateEmail;
// ============================================================================
// UTILITY FUNCTIONS & HELPERS
// ============================================================================
function generateId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
function formatDate(date) {
    return date.toLocaleDateString();
}
function formatTime(date) {
    return date.toLocaleTimeString();
}
function formatDuration(ms) {
    if (ms < 1000)
        return `${ms}ms`;
    if (ms < 60000)
        return `${Math.round(ms / 1000)}s`;
    if (ms < 3600000)
        return `${Math.round(ms / 60000)}m`;
    return `${Math.round(ms / 3600000)}h`;
}
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
// ============================================================================
// API ENDPOINTS & CONSTANTS
// ============================================================================
exports.API_ENDPOINTS = {
    HEALTH: '/api/health',
    AUTH: '/api/auth',
    USERS: '/api/users',
    TASKS: '/api/tasks',
    AI: '/api/ai',
    COORDINATION: '/api/coordination',
    QUALITY: '/api/quality',
    METRICS: '/api/metrics',
    WEBSOCKET: '/ws'
};
exports.WEBSOCKET_EVENTS = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    TASK_UPDATE: 'task_update',
    AGENT_STATUS: 'agent_status',
    QUALITY_RESULT: 'quality_result',
    SESSION_UPDATE: 'session_update'
};
exports.ERROR_CODES = {
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    AGENT_UNAVAILABLE: 'AGENT_UNAVAILABLE',
    TASK_FAILED: 'TASK_FAILED'
};
// ============================================================================
// CORE USER & AUTHENTICATION TYPES
// ============================================================================
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["DEVELOPER"] = "developer";
    UserRole["VIEWER"] = "viewer";
    UserRole["GUEST"] = "guest";
})(UserRole || (exports.UserRole = UserRole = {}));
// ============================================================================
// AI AGENTS & COORDINATION TYPES
// ============================================================================
var AIAgentType;
(function (AIAgentType) {
    AIAgentType["CLAUDE"] = "claude";
    AIAgentType["GPT4"] = "gpt4";
    AIAgentType["GEMINI"] = "gemini";
    AIAgentType["CUSTOM"] = "custom";
})(AIAgentType || (exports.AIAgentType = AIAgentType = {}));
var AgentStatus;
(function (AgentStatus) {
    AgentStatus["IDLE"] = "idle";
    AgentStatus["BUSY"] = "busy";
    AgentStatus["ERROR"] = "error";
    AgentStatus["MAINTENANCE"] = "maintenance";
    AgentStatus["OFFLINE"] = "offline";
})(AgentStatus || (exports.AgentStatus = AgentStatus = {}));
var AICapability;
(function (AICapability) {
    AICapability["CODE_GENERATION"] = "code_generation";
    AICapability["CODE_REVIEW"] = "code_review";
    AICapability["DOCUMENTATION"] = "documentation";
    AICapability["TESTING"] = "testing";
    AICapability["DEBUGGING"] = "debugging";
    AICapability["REFACTORING"] = "refactoring";
    AICapability["UI_UX"] = "ui_ux";
    AICapability["DEVOPS"] = "devops";
    AICapability["DATABASE"] = "database";
    AICapability["ARCHITECTURE"] = "architecture";
})(AICapability || (exports.AICapability = AICapability = {}));
// ============================================================================
// TASK & COORDINATION TYPES  
// ============================================================================
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "pending";
    TaskStatus["IN_PROGRESS"] = "in_progress";
    TaskStatus["REVIEW"] = "review";
    TaskStatus["COMPLETED"] = "completed";
    TaskStatus["CANCELLED"] = "cancelled";
    TaskStatus["BLOCKED"] = "blocked";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "low";
    TaskPriority["MEDIUM"] = "medium";
    TaskPriority["HIGH"] = "high";
    TaskPriority["CRITICAL"] = "critical";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
var TaskType;
(function (TaskType) {
    TaskType["CODE_GENERATION"] = "code_generation";
    TaskType["CODE_REVIEW"] = "code_review";
    TaskType["BUG_FIX"] = "bug_fix";
    TaskType["FEATURE_IMPLEMENTATION"] = "feature_implementation";
    TaskType["DOCUMENTATION"] = "documentation";
    TaskType["TESTING"] = "testing";
    TaskType["REFACTORING"] = "refactoring";
    TaskType["DEPLOYMENT"] = "deployment";
})(TaskType || (exports.TaskType = TaskType = {}));
var DeliverableType;
(function (DeliverableType) {
    DeliverableType["SOURCE_CODE"] = "source_code";
    DeliverableType["TEST_FILE"] = "test_file";
    DeliverableType["DOCUMENTATION"] = "documentation";
    DeliverableType["CONFIGURATION"] = "configuration";
    DeliverableType["PATCH"] = "patch";
})(DeliverableType || (exports.DeliverableType = DeliverableType = {}));
var ChangeType;
(function (ChangeType) {
    ChangeType["ADD"] = "add";
    ChangeType["MODIFY"] = "modify";
    ChangeType["DELETE"] = "delete";
})(ChangeType || (exports.ChangeType = ChangeType = {}));
//# sourceMappingURL=types.js.map