export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;
    isActive: boolean;
    profile?: UserProfile;
    tenantId?: string;
}
export interface UserProfile {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    timezone?: string;
    language?: string;
    preferences: Record<string, any>;
}
export declare enum UserRole {
    ADMIN = "admin",
    DEVELOPER = "developer",
    VIEWER = "viewer",
    GUEST = "guest"
}
export interface Session {
    id: string;
    userId: string;
    token: string;
    refreshToken?: string;
    expiresAt: Date;
    createdAt: Date;
    ipAddress?: string;
    userAgent?: string;
    isActive: boolean;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: Record<string, any>;
    };
    meta?: {
        timestamp: string;
        requestId?: string;
        pagination?: PaginationMeta;
    };
}
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export interface CoordinationTask {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignedTo?: string;
    assignedBy: string;
    projectId?: string;
    createdAt: Date;
    updatedAt: Date;
    dueDate?: Date;
    completedAt?: Date;
    tags: string[];
    metadata: Record<string, any>;
}
export declare enum TaskStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    REVIEW = "review",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    BLOCKED = "blocked"
}
export declare enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export interface WebSocketMessage {
    type: string;
    payload: any;
    timestamp: string;
    id?: string;
    userId?: string;
    sessionId?: string;
}
export interface EditorContext {
    repoRoot: string;
    activeFile?: string;
    selection?: string;
    projectType?: string;
    relatedFiles?: string[];
    workspaceRoot: string;
    selectedText?: string;
    cursorPosition?: {
        line: number;
        column: number;
    };
    openFiles: string[];
    language?: string;
    recentFiles?: string[];
}
//# sourceMappingURL=common.d.ts.map