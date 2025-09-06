"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeType = exports.DeliverableType = exports.TaskType = exports.AgentStatus = exports.AIAgentType = exports.AICapability = void 0;
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
})(AICapability = exports.AICapability || (exports.AICapability = {}));
var AIAgentType;
(function (AIAgentType) {
    AIAgentType["CLAUDE"] = "claude";
    AIAgentType["GPT4"] = "gpt4";
    AIAgentType["GEMINI"] = "gemini";
    AIAgentType["CUSTOM"] = "custom";
})(AIAgentType = exports.AIAgentType || (exports.AIAgentType = {}));
var AgentStatus;
(function (AgentStatus) {
    AgentStatus["IDLE"] = "idle";
    AgentStatus["BUSY"] = "busy";
    AgentStatus["ERROR"] = "error";
    AgentStatus["MAINTENANCE"] = "maintenance";
    AgentStatus["OFFLINE"] = "offline";
})(AgentStatus = exports.AgentStatus || (exports.AgentStatus = {}));
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
})(TaskType = exports.TaskType || (exports.TaskType = {}));
var DeliverableType;
(function (DeliverableType) {
    DeliverableType["SOURCE_CODE"] = "source_code";
    DeliverableType["TEST_FILE"] = "test_file";
    DeliverableType["DOCUMENTATION"] = "documentation";
    DeliverableType["CONFIGURATION"] = "configuration";
    DeliverableType["PATCH"] = "patch";
})(DeliverableType = exports.DeliverableType || (exports.DeliverableType = {}));
var ChangeType;
(function (ChangeType) {
    ChangeType["ADD"] = "add";
    ChangeType["MODIFY"] = "modify";
    ChangeType["DELETE"] = "delete";
})(ChangeType = exports.ChangeType || (exports.ChangeType = {}));
//# sourceMappingURL=ai.js.map