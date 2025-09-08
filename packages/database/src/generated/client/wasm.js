
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  name: 'name',
  avatar: 'avatar',
  role: 'role',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProjectScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  status: 'status',
  repository: 'repository',
  framework: 'framework',
  language: 'language',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  userId: 'userId'
};

exports.Prisma.TaskScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  status: 'status',
  priority: 'priority',
  aiProvider: 'aiProvider',
  model: 'model',
  type: 'type',
  context: 'context',
  requirements: 'requirements',
  constraints: 'constraints',
  result: 'result',
  diff: 'diff',
  artifacts: 'artifacts',
  tokenUsage: 'tokenUsage',
  cost: 'cost',
  duration: 'duration',
  quality: 'quality',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  completedAt: 'completedAt',
  projectId: 'projectId',
  userId: 'userId'
};

exports.Prisma.TaskExecutionScalarFieldEnum = {
  id: 'id',
  status: 'status',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  input: 'input',
  output: 'output',
  errorMessage: 'errorMessage',
  logs: 'logs',
  metrics: 'metrics',
  taskId: 'taskId'
};

exports.Prisma.QualityGateScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  status: 'status',
  rules: 'rules',
  config: 'config',
  score: 'score',
  issues: 'issues',
  report: 'report',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  projectId: 'projectId',
  taskId: 'taskId'
};

exports.Prisma.AITeamScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  status: 'status',
  strategy: 'strategy',
  preferences: 'preferences',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TeamMemberScalarFieldEnum = {
  id: 'id',
  role: 'role',
  aiProvider: 'aiProvider',
  model: 'model',
  specialties: 'specialties',
  performance: 'performance',
  teamId: 'teamId',
  userId: 'userId'
};

exports.Prisma.DeploymentScalarFieldEnum = {
  id: 'id',
  version: 'version',
  status: 'status',
  environment: 'environment',
  config: 'config',
  logs: 'logs',
  url: 'url',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deployedAt: 'deployedAt',
  projectId: 'projectId'
};

exports.Prisma.ProjectFileScalarFieldEnum = {
  id: 'id',
  path: 'path',
  name: 'name',
  type: 'type',
  size: 'size',
  checksum: 'checksum',
  language: 'language',
  framework: 'framework',
  purpose: 'purpose',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  projectId: 'projectId'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  data: 'data',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  createdAt: 'createdAt',
  expiresAt: 'expiresAt',
  userId: 'userId'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.UserRole = exports.$Enums.UserRole = {
  ADMIN: 'ADMIN',
  DEVELOPER: 'DEVELOPER',
  VIEWER: 'VIEWER'
};

exports.ProjectStatus = exports.$Enums.ProjectStatus = {
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED'
};

exports.TaskStatus = exports.$Enums.TaskStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

exports.Priority = exports.$Enums.Priority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

exports.AIProvider = exports.$Enums.AIProvider = {
  CLAUDE: 'CLAUDE',
  OPENAI: 'OPENAI',
  GOOGLE: 'GOOGLE',
  ANTHROPIC: 'ANTHROPIC'
};

exports.TaskType = exports.$Enums.TaskType = {
  CODE_GENERATION: 'CODE_GENERATION',
  CODE_REVIEW: 'CODE_REVIEW',
  DEBUGGING: 'DEBUGGING',
  REFACTORING: 'REFACTORING',
  DOCUMENTATION: 'DOCUMENTATION',
  TESTING: 'TESTING',
  DEPLOYMENT: 'DEPLOYMENT',
  ANALYSIS: 'ANALYSIS',
  OPTIMIZATION: 'OPTIMIZATION'
};

exports.ExecutionStatus = exports.$Enums.ExecutionStatus = {
  QUEUED: 'QUEUED',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  TIMEOUT: 'TIMEOUT'
};

exports.QualityGateType = exports.$Enums.QualityGateType = {
  SECURITY_SCAN: 'SECURITY_SCAN',
  LINT_CHECK: 'LINT_CHECK',
  TYPE_CHECK: 'TYPE_CHECK',
  TEST_COVERAGE: 'TEST_COVERAGE',
  BUILD_VALIDATION: 'BUILD_VALIDATION',
  PERFORMANCE_TEST: 'PERFORMANCE_TEST',
  LICENSE_CHECK: 'LICENSE_CHECK',
  DEPENDENCY_AUDIT: 'DEPENDENCY_AUDIT'
};

exports.QualityStatus = exports.$Enums.QualityStatus = {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  PASSED: 'PASSED',
  FAILED: 'FAILED',
  SKIPPED: 'SKIPPED'
};

exports.TeamStatus = exports.$Enums.TeamStatus = {
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  DISBANDED: 'DISBANDED'
};

exports.MemberRole = exports.$Enums.MemberRole = {
  LEAD: 'LEAD',
  SPECIALIST: 'SPECIALIST',
  ASSISTANT: 'ASSISTANT',
  REVIEWER: 'REVIEWER'
};

exports.DeploymentStatus = exports.$Enums.DeploymentStatus = {
  PENDING: 'PENDING',
  BUILDING: 'BUILDING',
  DEPLOYING: 'DEPLOYING',
  DEPLOYED: 'DEPLOYED',
  FAILED: 'FAILED',
  ROLLED_BACK: 'ROLLED_BACK'
};

exports.Prisma.ModelName = {
  User: 'User',
  Project: 'Project',
  Task: 'Task',
  TaskExecution: 'TaskExecution',
  QualityGate: 'QualityGate',
  AITeam: 'AITeam',
  TeamMember: 'TeamMember',
  Deployment: 'Deployment',
  ProjectFile: 'ProjectFile',
  Session: 'Session'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
