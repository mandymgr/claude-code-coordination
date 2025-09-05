export declare const API_ENDPOINTS: {
    readonly AUTH: "/api/auth";
    readonly USERS: "/api/users";
    readonly TASKS: "/api/tasks";
    readonly PROJECTS: "/api/projects";
    readonly AI: "/api/ai";
    readonly ENTERPRISE: "/api/enterprise";
    readonly ANALYTICS: "/api/analytics";
    readonly HEALTH: "/health";
};
export declare const WEBSOCKET_EVENTS: {
    readonly CONNECTION: "connection";
    readonly DISCONNECT: "disconnect";
    readonly TASK_UPDATE: "task_update";
    readonly AGENT_STATUS: "agent_status";
    readonly USER_ACTIVITY: "user_activity";
    readonly SYSTEM_ALERT: "system_alert";
    readonly COORDINATION_EVENT: "coordination_event";
};
export declare const ERROR_CODES: {
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly FORBIDDEN: "FORBIDDEN";
    readonly NOT_FOUND: "NOT_FOUND";
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly INTERNAL_ERROR: "INTERNAL_ERROR";
    readonly RATE_LIMITED: "RATE_LIMITED";
    readonly SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE";
    readonly TENANT_LIMIT_EXCEEDED: "TENANT_LIMIT_EXCEEDED";
    readonly AI_PROVIDER_ERROR: "AI_PROVIDER_ERROR";
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly TOO_MANY_REQUESTS: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly SERVICE_UNAVAILABLE: 503;
};
export declare const DEFAULT_PAGINATION: {
    readonly PAGE: 1;
    readonly LIMIT: 20;
    readonly MAX_LIMIT: 100;
};
export declare const AI_MODELS: {
    readonly CLAUDE: {
        readonly HAIKU: "claude-3-haiku-20240307";
        readonly SONNET: "claude-3-sonnet-20240229";
        readonly OPUS: "claude-3-opus-20240229";
    };
    readonly GPT: {
        readonly GPT_3_5_TURBO: "gpt-3.5-turbo";
        readonly GPT_4: "gpt-4";
        readonly GPT_4_TURBO: "gpt-4-turbo-preview";
    };
    readonly GEMINI: {
        readonly PRO: "gemini-pro";
        readonly PRO_VISION: "gemini-pro-vision";
    };
};
export declare const TOKEN_LIMITS: {
    readonly CLAUDE_HAIKU: 200000;
    readonly CLAUDE_SONNET: 200000;
    readonly CLAUDE_OPUS: 200000;
    readonly GPT_3_5_TURBO: 16385;
    readonly GPT_4: 8192;
    readonly GPT_4_TURBO: 128000;
    readonly GEMINI_PRO: 30720;
};
export declare const CACHE_TTL: {
    readonly SHORT: 60;
    readonly MEDIUM: 300;
    readonly LONG: 3600;
    readonly EXTENDED: 86400;
};
export declare const FILE_TYPES: {
    readonly SOURCE_CODE: readonly [".js", ".ts", ".jsx", ".tsx", ".py", ".java", ".cpp", ".c", ".cs", ".go", ".rs", ".php"];
    readonly CONFIG: readonly [".json", ".yaml", ".yml", ".toml", ".ini", ".env"];
    readonly DOCUMENTATION: readonly [".md", ".txt", ".rst", ".adoc"];
    readonly IMAGES: readonly [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];
    readonly ARCHIVES: readonly [".zip", ".tar", ".gz", ".7z", ".rar"];
};
export declare const SYSTEM_ROLES: {
    readonly SUPER_ADMIN: "super_admin";
    readonly TENANT_ADMIN: "tenant_admin";
    readonly DEVELOPER: "developer";
    readonly VIEWER: "viewer";
    readonly GUEST: "guest";
};
export declare const PERMISSIONS: {
    readonly CREATE_USER: "create_user";
    readonly UPDATE_USER: "update_user";
    readonly DELETE_USER: "delete_user";
    readonly VIEW_USER: "view_user";
    readonly MANAGE_TENANT: "manage_tenant";
    readonly CREATE_PROJECT: "create_project";
    readonly UPDATE_PROJECT: "update_project";
    readonly DELETE_PROJECT: "delete_project";
    readonly VIEW_PROJECT: "view_project";
    readonly ASSIGN_TASK: "assign_task";
    readonly UPDATE_TASK: "update_task";
    readonly DELETE_TASK: "delete_task";
    readonly VIEW_TASK: "view_task";
    readonly ACCESS_AI: "access_ai";
    readonly MANAGE_AI: "manage_ai";
    readonly VIEW_ANALYTICS: "view_analytics";
    readonly EXPORT_DATA: "export_data";
};
export declare const QUALITY_GATES: {
    readonly SYNTAX_CHECK: "syntax_check";
    readonly TYPE_CHECK: "type_check";
    readonly LINT_CHECK: "lint_check";
    readonly TEST_COVERAGE: "test_coverage";
    readonly SECURITY_SCAN: "security_scan";
    readonly PERFORMANCE_CHECK: "performance_check";
    readonly ACCESSIBILITY_CHECK: "accessibility_check";
};
export declare const DEPLOYMENT_ENVIRONMENTS: {
    readonly DEVELOPMENT: "development";
    readonly STAGING: "staging";
    readonly PRODUCTION: "production";
};
//# sourceMappingURL=constants.d.ts.map