"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlockCurrentFile = exports.lockCurrentFile = exports.toggleFileLock = exports.deploy = exports.createProjectFromPrompt = exports.assignTask = void 0;
// Central export for all extension commands
var assignTask_js_1 = require("./assignTask.js");
Object.defineProperty(exports, "assignTask", { enumerable: true, get: function () { return assignTask_js_1.assignTask; } });
var createProjectFromPrompt_js_1 = require("./createProjectFromPrompt.js");
Object.defineProperty(exports, "createProjectFromPrompt", { enumerable: true, get: function () { return createProjectFromPrompt_js_1.createProjectFromPrompt; } });
var deploy_js_1 = require("./deploy.js");
Object.defineProperty(exports, "deploy", { enumerable: true, get: function () { return deploy_js_1.deploy; } });
var toggleFileLock_js_1 = require("./toggleFileLock.js");
Object.defineProperty(exports, "toggleFileLock", { enumerable: true, get: function () { return toggleFileLock_js_1.toggleFileLock; } });
Object.defineProperty(exports, "lockCurrentFile", { enumerable: true, get: function () { return toggleFileLock_js_1.lockCurrentFile; } });
Object.defineProperty(exports, "unlockCurrentFile", { enumerable: true, get: function () { return toggleFileLock_js_1.unlockCurrentFile; } });
//# sourceMappingURL=index.js.map