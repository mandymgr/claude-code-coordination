"use strict";
// Platform constants
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEPLOYMENT_ENVIRONMENTS = exports.QUALITY_GATES = exports.PERMISSIONS = exports.SYSTEM_ROLES = exports.FILE_TYPES = exports.CACHE_TTL = exports.TOKEN_LIMITS = exports.AI_MODELS = exports.DEFAULT_PAGINATION = exports.HTTP_STATUS = exports.ERROR_CODES = exports.WEBSOCKET_EVENTS = exports.API_ENDPOINTS = void 0;
exports.API_ENDPOINTS = {
    AUTH: '/api/auth',
    USERS: '/api/users',
    TASKS: '/api/tasks',
    PROJECTS: '/api/projects',
    AI: '/api/ai',
    ENTERPRISE: '/api/enterprise',
    ANALYTICS: '/api/analytics',
    HEALTH: '/health'
};
exports.WEBSOCKET_EVENTS = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    TASK_UPDATE: 'task_update',
    AGENT_STATUS: 'agent_status',
    USER_ACTIVITY: 'user_activity',
    SYSTEM_ALERT: 'system_alert',
    COORDINATION_EVENT: 'coordination_event'
};
exports.ERROR_CODES = {
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    RATE_LIMITED: 'RATE_LIMITED',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    TENANT_LIMIT_EXCEEDED: 'TENANT_LIMIT_EXCEEDED',
    AI_PROVIDER_ERROR: 'AI_PROVIDER_ERROR'
};
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
};
exports.DEFAULT_PAGINATION = {
    PAGE: 1,
    LIMIT: 20,
    MAX_LIMIT: 100
};
exports.AI_MODELS = {
    CLAUDE: {
        HAIKU: 'claude-3-haiku-20240307',
        SONNET: 'claude-3-sonnet-20240229',
        OPUS: 'claude-3-opus-20240229'
    },
    GPT: {
        GPT_3_5_TURBO: 'gpt-3.5-turbo',
        GPT_4: 'gpt-4',
        GPT_4_TURBO: 'gpt-4-turbo-preview'
    },
    GEMINI: {
        PRO: 'gemini-pro',
        PRO_VISION: 'gemini-pro-vision'
    }
};
exports.TOKEN_LIMITS = {
    CLAUDE_HAIKU: 200000,
    CLAUDE_SONNET: 200000,
    CLAUDE_OPUS: 200000,
    GPT_3_5_TURBO: 16385,
    GPT_4: 8192,
    GPT_4_TURBO: 128000,
    GEMINI_PRO: 30720
};
exports.CACHE_TTL = {
    SHORT: 60,
    MEDIUM: 300,
    LONG: 3600,
    EXTENDED: 86400 // 24 hours
};
exports.FILE_TYPES = {
    SOURCE_CODE: ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.go', '.rs', '.php'],
    CONFIG: ['.json', '.yaml', '.yml', '.toml', '.ini', '.env'],
    DOCUMENTATION: ['.md', '.txt', '.rst', '.adoc'],
    IMAGES: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'],
    ARCHIVES: ['.zip', '.tar', '.gz', '.7z', '.rar']
};
exports.SYSTEM_ROLES = {
    SUPER_ADMIN: 'super_admin',
    TENANT_ADMIN: 'tenant_admin',
    DEVELOPER: 'developer',
    VIEWER: 'viewer',
    GUEST: 'guest'
};
exports.PERMISSIONS = {
    CREATE_USER: 'create_user',
    UPDATE_USER: 'update_user',
    DELETE_USER: 'delete_user',
    VIEW_USER: 'view_user',
    MANAGE_TENANT: 'manage_tenant',
    CREATE_PROJECT: 'create_project',
    UPDATE_PROJECT: 'update_project',
    DELETE_PROJECT: 'delete_project',
    VIEW_PROJECT: 'view_project',
    ASSIGN_TASK: 'assign_task',
    UPDATE_TASK: 'update_task',
    DELETE_TASK: 'delete_task',
    VIEW_TASK: 'view_task',
    ACCESS_AI: 'access_ai',
    MANAGE_AI: 'manage_ai',
    VIEW_ANALYTICS: 'view_analytics',
    EXPORT_DATA: 'export_data'
};
exports.QUALITY_GATES = {
    SYNTAX_CHECK: 'syntax_check',
    TYPE_CHECK: 'type_check',
    LINT_CHECK: 'lint_check',
    TEST_COVERAGE: 'test_coverage',
    SECURITY_SCAN: 'security_scan',
    PERFORMANCE_CHECK: 'performance_check',
    ACCESSIBILITY_CHECK: 'accessibility_check'
};
exports.DEPLOYMENT_ENVIRONMENTS = {
    DEVELOPMENT: 'development',
    STAGING: 'staging',
    PRODUCTION: 'production'
};
//# sourceMappingURL=constants.js.map