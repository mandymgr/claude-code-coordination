export interface Tenant {
    id: string;
    name: string;
    domain: string;
    plan: TenantPlan;
    settings: TenantSettings;
    limits: TenantLimits;
    status: TenantStatus;
    createdAt: Date;
    updatedAt: Date;
    ownerId: string;
    metadata: Record<string, any>;
}
export declare enum TenantPlan {
    STARTER = "starter",
    PROFESSIONAL = "professional",
    ENTERPRISE = "enterprise",
    ENTERPRISE_PLUS = "enterprise_plus"
}
export declare enum TenantStatus {
    ACTIVE = "active",
    SUSPENDED = "suspended",
    PENDING = "pending",
    CANCELLED = "cancelled"
}
export interface TenantSettings {
    sso: SSOSettings;
    branding: BrandingSettings;
    security: SecuritySettings;
    compliance: ComplianceSettings;
}
export interface SSOSettings {
    enabled: boolean;
    provider?: SSOProvider;
    configuration?: Record<string, any>;
    domains: string[];
    autoProvisioning: boolean;
}
export declare enum SSOProvider {
    SAML = "saml",
    OIDC = "oidc",
    LDAP = "ldap",
    GOOGLE = "google",
    MICROSOFT = "microsoft",
    GITHUB = "github"
}
export interface BrandingSettings {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    customCSS?: string;
    favicon?: string;
    productName?: string;
}
export interface SecuritySettings {
    mfaRequired: boolean;
    passwordPolicy: PasswordPolicy;
    sessionTimeout: number;
    ipWhitelist: string[];
    auditLogging: boolean;
    encryptionAtRest: boolean;
}
export interface PasswordPolicy {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxAge: number;
    preventReuse: number;
}
export interface ComplianceSettings {
    frameworks: ComplianceFramework[];
    dataRetention: number;
    dataLocation: string;
    privacySettings: PrivacySettings;
}
export declare enum ComplianceFramework {
    SOC2 = "soc2",
    GDPR = "gdpr",
    HIPAA = "hipaa",
    ISO27001 = "iso27001",
    FedRAMP = "fedramp"
}
export interface PrivacySettings {
    dataProcessing: boolean;
    cookies: boolean;
    analytics: boolean;
    marketing: boolean;
}
export interface TenantLimits {
    users: number;
    projects: number;
    storage: number;
    apiCalls: number;
    aiTokens: number;
    retention: number;
}
export interface AuditEvent {
    id: string;
    tenantId: string;
    userId: string;
    action: AuditAction;
    resource: string;
    resourceId?: string;
    details: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
    severity: AuditSeverity;
}
export declare enum AuditAction {
    CREATE = "create",
    READ = "read",
    UPDATE = "update",
    DELETE = "delete",
    LOGIN = "login",
    LOGOUT = "logout",
    ACCESS_DENIED = "access_denied",
    EXPORT = "export",
    IMPORT = "import"
}
export declare enum AuditSeverity {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export interface Analytics {
    period: AnalyticsPeriod;
    metrics: AnalyticsMetrics;
    charts: AnalyticsChart[];
    insights: AnalyticsInsight[];
}
export declare enum AnalyticsPeriod {
    HOUR = "hour",
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    QUARTER = "quarter",
    YEAR = "year"
}
export interface AnalyticsMetrics {
    users: UserMetrics;
    tasks: TaskMetrics;
    performance: PerformanceMetrics;
    costs: CostMetrics;
}
export interface UserMetrics {
    total: number;
    active: number;
    new: number;
    retention: number;
}
export interface PerformanceMetrics {
    responseTime: number;
    uptime: number;
    errorRate: number;
    throughput: number;
}
export interface CostMetrics {
    total: number;
    perUser: number;
    aiTokens: number;
    infrastructure: number;
}
export interface AnalyticsChart {
    type: ChartType;
    title: string;
    data: ChartData[];
    config: Record<string, any>;
}
export declare enum ChartType {
    LINE = "line",
    BAR = "bar",
    PIE = "pie",
    AREA = "area",
    SCATTER = "scatter"
}
export interface ChartData {
    label: string;
    value: number;
    timestamp?: Date;
}
export interface AnalyticsInsight {
    type: InsightType;
    title: string;
    description: string;
    impact: InsightImpact;
    recommendation?: string;
}
export declare enum InsightType {
    PERFORMANCE = "performance",
    COST = "cost",
    USAGE = "usage",
    SECURITY = "security",
    GROWTH = "growth"
}
export declare enum InsightImpact {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}
//# sourceMappingURL=enterprise%202.d.ts.map