"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightImpact = exports.InsightType = exports.ChartType = exports.AnalyticsPeriod = exports.AuditSeverity = exports.AuditAction = exports.ComplianceFramework = exports.SSOProvider = exports.TenantStatus = exports.TenantPlan = void 0;
var TenantPlan;
(function (TenantPlan) {
    TenantPlan["STARTER"] = "starter";
    TenantPlan["PROFESSIONAL"] = "professional";
    TenantPlan["ENTERPRISE"] = "enterprise";
    TenantPlan["ENTERPRISE_PLUS"] = "enterprise_plus";
})(TenantPlan = exports.TenantPlan || (exports.TenantPlan = {}));
var TenantStatus;
(function (TenantStatus) {
    TenantStatus["ACTIVE"] = "active";
    TenantStatus["SUSPENDED"] = "suspended";
    TenantStatus["PENDING"] = "pending";
    TenantStatus["CANCELLED"] = "cancelled";
})(TenantStatus = exports.TenantStatus || (exports.TenantStatus = {}));
var SSOProvider;
(function (SSOProvider) {
    SSOProvider["SAML"] = "saml";
    SSOProvider["OIDC"] = "oidc";
    SSOProvider["LDAP"] = "ldap";
    SSOProvider["GOOGLE"] = "google";
    SSOProvider["MICROSOFT"] = "microsoft";
    SSOProvider["GITHUB"] = "github";
})(SSOProvider = exports.SSOProvider || (exports.SSOProvider = {}));
var ComplianceFramework;
(function (ComplianceFramework) {
    ComplianceFramework["SOC2"] = "soc2";
    ComplianceFramework["GDPR"] = "gdpr";
    ComplianceFramework["HIPAA"] = "hipaa";
    ComplianceFramework["ISO27001"] = "iso27001";
    ComplianceFramework["FedRAMP"] = "fedramp";
})(ComplianceFramework = exports.ComplianceFramework || (exports.ComplianceFramework = {}));
var AuditAction;
(function (AuditAction) {
    AuditAction["CREATE"] = "create";
    AuditAction["READ"] = "read";
    AuditAction["UPDATE"] = "update";
    AuditAction["DELETE"] = "delete";
    AuditAction["LOGIN"] = "login";
    AuditAction["LOGOUT"] = "logout";
    AuditAction["ACCESS_DENIED"] = "access_denied";
    AuditAction["EXPORT"] = "export";
    AuditAction["IMPORT"] = "import";
})(AuditAction = exports.AuditAction || (exports.AuditAction = {}));
var AuditSeverity;
(function (AuditSeverity) {
    AuditSeverity["LOW"] = "low";
    AuditSeverity["MEDIUM"] = "medium";
    AuditSeverity["HIGH"] = "high";
    AuditSeverity["CRITICAL"] = "critical";
})(AuditSeverity = exports.AuditSeverity || (exports.AuditSeverity = {}));
var AnalyticsPeriod;
(function (AnalyticsPeriod) {
    AnalyticsPeriod["HOUR"] = "hour";
    AnalyticsPeriod["DAY"] = "day";
    AnalyticsPeriod["WEEK"] = "week";
    AnalyticsPeriod["MONTH"] = "month";
    AnalyticsPeriod["QUARTER"] = "quarter";
    AnalyticsPeriod["YEAR"] = "year";
})(AnalyticsPeriod = exports.AnalyticsPeriod || (exports.AnalyticsPeriod = {}));
var ChartType;
(function (ChartType) {
    ChartType["LINE"] = "line";
    ChartType["BAR"] = "bar";
    ChartType["PIE"] = "pie";
    ChartType["AREA"] = "area";
    ChartType["SCATTER"] = "scatter";
})(ChartType = exports.ChartType || (exports.ChartType = {}));
var InsightType;
(function (InsightType) {
    InsightType["PERFORMANCE"] = "performance";
    InsightType["COST"] = "cost";
    InsightType["USAGE"] = "usage";
    InsightType["SECURITY"] = "security";
    InsightType["GROWTH"] = "growth";
})(InsightType = exports.InsightType || (exports.InsightType = {}));
var InsightImpact;
(function (InsightImpact) {
    InsightImpact["LOW"] = "low";
    InsightImpact["MEDIUM"] = "medium";
    InsightImpact["HIGH"] = "high";
})(InsightImpact = exports.InsightImpact || (exports.InsightImpact = {}));
//# sourceMappingURL=enterprise.js.map