
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model Task
 * 
 */
export type Task = $Result.DefaultSelection<Prisma.$TaskPayload>
/**
 * Model TaskExecution
 * 
 */
export type TaskExecution = $Result.DefaultSelection<Prisma.$TaskExecutionPayload>
/**
 * Model QualityGate
 * 
 */
export type QualityGate = $Result.DefaultSelection<Prisma.$QualityGatePayload>
/**
 * Model AITeam
 * 
 */
export type AITeam = $Result.DefaultSelection<Prisma.$AITeamPayload>
/**
 * Model TeamMember
 * 
 */
export type TeamMember = $Result.DefaultSelection<Prisma.$TeamMemberPayload>
/**
 * Model Deployment
 * 
 */
export type Deployment = $Result.DefaultSelection<Prisma.$DeploymentPayload>
/**
 * Model ProjectFile
 * 
 */
export type ProjectFile = $Result.DefaultSelection<Prisma.$ProjectFilePayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  ADMIN: 'ADMIN',
  DEVELOPER: 'DEVELOPER',
  VIEWER: 'VIEWER'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const ProjectStatus: {
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED'
};

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus]


export const TaskStatus: {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]


export const Priority: {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

export type Priority = (typeof Priority)[keyof typeof Priority]


export const AIProvider: {
  CLAUDE: 'CLAUDE',
  OPENAI: 'OPENAI',
  GOOGLE: 'GOOGLE',
  ANTHROPIC: 'ANTHROPIC'
};

export type AIProvider = (typeof AIProvider)[keyof typeof AIProvider]


export const TaskType: {
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

export type TaskType = (typeof TaskType)[keyof typeof TaskType]


export const ExecutionStatus: {
  QUEUED: 'QUEUED',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  TIMEOUT: 'TIMEOUT'
};

export type ExecutionStatus = (typeof ExecutionStatus)[keyof typeof ExecutionStatus]


export const QualityGateType: {
  SECURITY_SCAN: 'SECURITY_SCAN',
  LINT_CHECK: 'LINT_CHECK',
  TYPE_CHECK: 'TYPE_CHECK',
  TEST_COVERAGE: 'TEST_COVERAGE',
  BUILD_VALIDATION: 'BUILD_VALIDATION',
  PERFORMANCE_TEST: 'PERFORMANCE_TEST',
  LICENSE_CHECK: 'LICENSE_CHECK',
  DEPENDENCY_AUDIT: 'DEPENDENCY_AUDIT'
};

export type QualityGateType = (typeof QualityGateType)[keyof typeof QualityGateType]


export const QualityStatus: {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  PASSED: 'PASSED',
  FAILED: 'FAILED',
  SKIPPED: 'SKIPPED'
};

export type QualityStatus = (typeof QualityStatus)[keyof typeof QualityStatus]


export const TeamStatus: {
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  DISBANDED: 'DISBANDED'
};

export type TeamStatus = (typeof TeamStatus)[keyof typeof TeamStatus]


export const MemberRole: {
  LEAD: 'LEAD',
  SPECIALIST: 'SPECIALIST',
  ASSISTANT: 'ASSISTANT',
  REVIEWER: 'REVIEWER'
};

export type MemberRole = (typeof MemberRole)[keyof typeof MemberRole]


export const DeploymentStatus: {
  PENDING: 'PENDING',
  BUILDING: 'BUILDING',
  DEPLOYING: 'DEPLOYING',
  DEPLOYED: 'DEPLOYED',
  FAILED: 'FAILED',
  ROLLED_BACK: 'ROLLED_BACK'
};

export type DeploymentStatus = (typeof DeploymentStatus)[keyof typeof DeploymentStatus]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type ProjectStatus = $Enums.ProjectStatus

export const ProjectStatus: typeof $Enums.ProjectStatus

export type TaskStatus = $Enums.TaskStatus

export const TaskStatus: typeof $Enums.TaskStatus

export type Priority = $Enums.Priority

export const Priority: typeof $Enums.Priority

export type AIProvider = $Enums.AIProvider

export const AIProvider: typeof $Enums.AIProvider

export type TaskType = $Enums.TaskType

export const TaskType: typeof $Enums.TaskType

export type ExecutionStatus = $Enums.ExecutionStatus

export const ExecutionStatus: typeof $Enums.ExecutionStatus

export type QualityGateType = $Enums.QualityGateType

export const QualityGateType: typeof $Enums.QualityGateType

export type QualityStatus = $Enums.QualityStatus

export const QualityStatus: typeof $Enums.QualityStatus

export type TeamStatus = $Enums.TeamStatus

export const TeamStatus: typeof $Enums.TeamStatus

export type MemberRole = $Enums.MemberRole

export const MemberRole: typeof $Enums.MemberRole

export type DeploymentStatus = $Enums.DeploymentStatus

export const DeploymentStatus: typeof $Enums.DeploymentStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs>;

  /**
   * `prisma.task`: Exposes CRUD operations for the **Task** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tasks
    * const tasks = await prisma.task.findMany()
    * ```
    */
  get task(): Prisma.TaskDelegate<ExtArgs>;

  /**
   * `prisma.taskExecution`: Exposes CRUD operations for the **TaskExecution** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TaskExecutions
    * const taskExecutions = await prisma.taskExecution.findMany()
    * ```
    */
  get taskExecution(): Prisma.TaskExecutionDelegate<ExtArgs>;

  /**
   * `prisma.qualityGate`: Exposes CRUD operations for the **QualityGate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QualityGates
    * const qualityGates = await prisma.qualityGate.findMany()
    * ```
    */
  get qualityGate(): Prisma.QualityGateDelegate<ExtArgs>;

  /**
   * `prisma.aITeam`: Exposes CRUD operations for the **AITeam** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AITeams
    * const aITeams = await prisma.aITeam.findMany()
    * ```
    */
  get aITeam(): Prisma.AITeamDelegate<ExtArgs>;

  /**
   * `prisma.teamMember`: Exposes CRUD operations for the **TeamMember** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TeamMembers
    * const teamMembers = await prisma.teamMember.findMany()
    * ```
    */
  get teamMember(): Prisma.TeamMemberDelegate<ExtArgs>;

  /**
   * `prisma.deployment`: Exposes CRUD operations for the **Deployment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Deployments
    * const deployments = await prisma.deployment.findMany()
    * ```
    */
  get deployment(): Prisma.DeploymentDelegate<ExtArgs>;

  /**
   * `prisma.projectFile`: Exposes CRUD operations for the **ProjectFile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProjectFiles
    * const projectFiles = await prisma.projectFile.findMany()
    * ```
    */
  get projectFile(): Prisma.ProjectFileDelegate<ExtArgs>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
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

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "project" | "task" | "taskExecution" | "qualityGate" | "aITeam" | "teamMember" | "deployment" | "projectFile" | "session"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      Task: {
        payload: Prisma.$TaskPayload<ExtArgs>
        fields: Prisma.TaskFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findFirst: {
            args: Prisma.TaskFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findMany: {
            args: Prisma.TaskFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          create: {
            args: Prisma.TaskCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          createMany: {
            args: Prisma.TaskCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          delete: {
            args: Prisma.TaskDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          update: {
            args: Prisma.TaskUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          deleteMany: {
            args: Prisma.TaskDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TaskUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          aggregate: {
            args: Prisma.TaskAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTask>
          }
          groupBy: {
            args: Prisma.TaskGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskCountArgs<ExtArgs>
            result: $Utils.Optional<TaskCountAggregateOutputType> | number
          }
        }
      }
      TaskExecution: {
        payload: Prisma.$TaskExecutionPayload<ExtArgs>
        fields: Prisma.TaskExecutionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskExecutionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskExecutionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskExecutionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskExecutionPayload>
          }
          findFirst: {
            args: Prisma.TaskExecutionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskExecutionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskExecutionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskExecutionPayload>
          }
          findMany: {
            args: Prisma.TaskExecutionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskExecutionPayload>[]
          }
          create: {
            args: Prisma.TaskExecutionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskExecutionPayload>
          }
          createMany: {
            args: Prisma.TaskExecutionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskExecutionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskExecutionPayload>[]
          }
          delete: {
            args: Prisma.TaskExecutionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskExecutionPayload>
          }
          update: {
            args: Prisma.TaskExecutionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskExecutionPayload>
          }
          deleteMany: {
            args: Prisma.TaskExecutionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskExecutionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TaskExecutionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskExecutionPayload>
          }
          aggregate: {
            args: Prisma.TaskExecutionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTaskExecution>
          }
          groupBy: {
            args: Prisma.TaskExecutionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskExecutionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskExecutionCountArgs<ExtArgs>
            result: $Utils.Optional<TaskExecutionCountAggregateOutputType> | number
          }
        }
      }
      QualityGate: {
        payload: Prisma.$QualityGatePayload<ExtArgs>
        fields: Prisma.QualityGateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QualityGateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QualityGatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QualityGateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QualityGatePayload>
          }
          findFirst: {
            args: Prisma.QualityGateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QualityGatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QualityGateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QualityGatePayload>
          }
          findMany: {
            args: Prisma.QualityGateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QualityGatePayload>[]
          }
          create: {
            args: Prisma.QualityGateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QualityGatePayload>
          }
          createMany: {
            args: Prisma.QualityGateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QualityGateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QualityGatePayload>[]
          }
          delete: {
            args: Prisma.QualityGateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QualityGatePayload>
          }
          update: {
            args: Prisma.QualityGateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QualityGatePayload>
          }
          deleteMany: {
            args: Prisma.QualityGateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QualityGateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.QualityGateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QualityGatePayload>
          }
          aggregate: {
            args: Prisma.QualityGateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQualityGate>
          }
          groupBy: {
            args: Prisma.QualityGateGroupByArgs<ExtArgs>
            result: $Utils.Optional<QualityGateGroupByOutputType>[]
          }
          count: {
            args: Prisma.QualityGateCountArgs<ExtArgs>
            result: $Utils.Optional<QualityGateCountAggregateOutputType> | number
          }
        }
      }
      AITeam: {
        payload: Prisma.$AITeamPayload<ExtArgs>
        fields: Prisma.AITeamFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AITeamFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AITeamPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AITeamFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AITeamPayload>
          }
          findFirst: {
            args: Prisma.AITeamFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AITeamPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AITeamFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AITeamPayload>
          }
          findMany: {
            args: Prisma.AITeamFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AITeamPayload>[]
          }
          create: {
            args: Prisma.AITeamCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AITeamPayload>
          }
          createMany: {
            args: Prisma.AITeamCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AITeamCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AITeamPayload>[]
          }
          delete: {
            args: Prisma.AITeamDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AITeamPayload>
          }
          update: {
            args: Prisma.AITeamUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AITeamPayload>
          }
          deleteMany: {
            args: Prisma.AITeamDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AITeamUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AITeamUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AITeamPayload>
          }
          aggregate: {
            args: Prisma.AITeamAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAITeam>
          }
          groupBy: {
            args: Prisma.AITeamGroupByArgs<ExtArgs>
            result: $Utils.Optional<AITeamGroupByOutputType>[]
          }
          count: {
            args: Prisma.AITeamCountArgs<ExtArgs>
            result: $Utils.Optional<AITeamCountAggregateOutputType> | number
          }
        }
      }
      TeamMember: {
        payload: Prisma.$TeamMemberPayload<ExtArgs>
        fields: Prisma.TeamMemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TeamMemberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TeamMemberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          findFirst: {
            args: Prisma.TeamMemberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TeamMemberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          findMany: {
            args: Prisma.TeamMemberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>[]
          }
          create: {
            args: Prisma.TeamMemberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          createMany: {
            args: Prisma.TeamMemberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TeamMemberCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>[]
          }
          delete: {
            args: Prisma.TeamMemberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          update: {
            args: Prisma.TeamMemberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          deleteMany: {
            args: Prisma.TeamMemberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TeamMemberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TeamMemberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          aggregate: {
            args: Prisma.TeamMemberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTeamMember>
          }
          groupBy: {
            args: Prisma.TeamMemberGroupByArgs<ExtArgs>
            result: $Utils.Optional<TeamMemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.TeamMemberCountArgs<ExtArgs>
            result: $Utils.Optional<TeamMemberCountAggregateOutputType> | number
          }
        }
      }
      Deployment: {
        payload: Prisma.$DeploymentPayload<ExtArgs>
        fields: Prisma.DeploymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeploymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeploymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeploymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeploymentPayload>
          }
          findFirst: {
            args: Prisma.DeploymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeploymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeploymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeploymentPayload>
          }
          findMany: {
            args: Prisma.DeploymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeploymentPayload>[]
          }
          create: {
            args: Prisma.DeploymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeploymentPayload>
          }
          createMany: {
            args: Prisma.DeploymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DeploymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeploymentPayload>[]
          }
          delete: {
            args: Prisma.DeploymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeploymentPayload>
          }
          update: {
            args: Prisma.DeploymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeploymentPayload>
          }
          deleteMany: {
            args: Prisma.DeploymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DeploymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DeploymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeploymentPayload>
          }
          aggregate: {
            args: Prisma.DeploymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDeployment>
          }
          groupBy: {
            args: Prisma.DeploymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DeploymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeploymentCountArgs<ExtArgs>
            result: $Utils.Optional<DeploymentCountAggregateOutputType> | number
          }
        }
      }
      ProjectFile: {
        payload: Prisma.$ProjectFilePayload<ExtArgs>
        fields: Prisma.ProjectFileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          findFirst: {
            args: Prisma.ProjectFileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          findMany: {
            args: Prisma.ProjectFileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>[]
          }
          create: {
            args: Prisma.ProjectFileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          createMany: {
            args: Prisma.ProjectFileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectFileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>[]
          }
          delete: {
            args: Prisma.ProjectFileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          update: {
            args: Prisma.ProjectFileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          deleteMany: {
            args: Prisma.ProjectFileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectFileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProjectFileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectFilePayload>
          }
          aggregate: {
            args: Prisma.ProjectFileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectFile>
          }
          groupBy: {
            args: Prisma.ProjectFileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectFileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectFileCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectFileCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    projects: number
    tasks: number
    sessions: number
    teamMembers: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | UserCountOutputTypeCountProjectsArgs
    tasks?: boolean | UserCountOutputTypeCountTasksArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    teamMembers?: boolean | UserCountOutputTypeCountTeamMembersArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTeamMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamMemberWhereInput
  }


  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    tasks: number
    deployments: number
    qualityGates: number
    files: number
  }

  export type ProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tasks?: boolean | ProjectCountOutputTypeCountTasksArgs
    deployments?: boolean | ProjectCountOutputTypeCountDeploymentsArgs
    qualityGates?: boolean | ProjectCountOutputTypeCountQualityGatesArgs
    files?: boolean | ProjectCountOutputTypeCountFilesArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountDeploymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeploymentWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountQualityGatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QualityGateWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectFileWhereInput
  }


  /**
   * Count Type TaskCountOutputType
   */

  export type TaskCountOutputType = {
    qualityGates: number
    executions: number
  }

  export type TaskCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    qualityGates?: boolean | TaskCountOutputTypeCountQualityGatesArgs
    executions?: boolean | TaskCountOutputTypeCountExecutionsArgs
  }

  // Custom InputTypes
  /**
   * TaskCountOutputType without action
   */
  export type TaskCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskCountOutputType
     */
    select?: TaskCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TaskCountOutputType without action
   */
  export type TaskCountOutputTypeCountQualityGatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QualityGateWhereInput
  }

  /**
   * TaskCountOutputType without action
   */
  export type TaskCountOutputTypeCountExecutionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskExecutionWhereInput
  }


  /**
   * Count Type AITeamCountOutputType
   */

  export type AITeamCountOutputType = {
    members: number
  }

  export type AITeamCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | AITeamCountOutputTypeCountMembersArgs
  }

  // Custom InputTypes
  /**
   * AITeamCountOutputType without action
   */
  export type AITeamCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AITeamCountOutputType
     */
    select?: AITeamCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AITeamCountOutputType without action
   */
  export type AITeamCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamMemberWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    avatar: string | null
    role: $Enums.UserRole | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    avatar: string | null
    role: $Enums.UserRole | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    avatar: number
    role: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    avatar?: true
    role?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    avatar?: true
    role?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    avatar?: true
    role?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string | null
    avatar: string | null
    role: $Enums.UserRole
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    avatar?: boolean
    role?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    projects?: boolean | User$projectsArgs<ExtArgs>
    tasks?: boolean | User$tasksArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    teamMembers?: boolean | User$teamMembersArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    avatar?: boolean
    role?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    avatar?: boolean
    role?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | User$projectsArgs<ExtArgs>
    tasks?: boolean | User$tasksArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    teamMembers?: boolean | User$teamMembersArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      projects: Prisma.$ProjectPayload<ExtArgs>[]
      tasks: Prisma.$TaskPayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      teamMembers: Prisma.$TeamMemberPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string | null
      avatar: string | null
      role: $Enums.UserRole
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    projects<T extends User$projectsArgs<ExtArgs> = {}>(args?: Subset<T, User$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany"> | Null>
    tasks<T extends User$tasksArgs<ExtArgs> = {}>(args?: Subset<T, User$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany"> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany"> | Null>
    teamMembers<T extends User$teamMembersArgs<ExtArgs> = {}>(args?: Subset<T, User$teamMembersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.projects
   */
  export type User$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * User.tasks
   */
  export type User$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.teamMembers
   */
  export type User$teamMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    where?: TeamMemberWhereInput
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    cursor?: TeamMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TeamMemberScalarFieldEnum | TeamMemberScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    status: $Enums.ProjectStatus | null
    repository: string | null
    framework: string | null
    language: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    status: $Enums.ProjectStatus | null
    repository: string | null
    framework: string | null
    language: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    name: number
    description: number
    status: number
    repository: number
    framework: number
    language: number
    createdAt: number
    updatedAt: number
    userId: number
    _all: number
  }


  export type ProjectMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    status?: true
    repository?: true
    framework?: true
    language?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    status?: true
    repository?: true
    framework?: true
    language?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    status?: true
    repository?: true
    framework?: true
    language?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    name: string
    description: string | null
    status: $Enums.ProjectStatus
    repository: string | null
    framework: string | null
    language: string | null
    createdAt: Date
    updatedAt: Date
    userId: string
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    status?: boolean
    repository?: boolean
    framework?: boolean
    language?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    tasks?: boolean | Project$tasksArgs<ExtArgs>
    deployments?: boolean | Project$deploymentsArgs<ExtArgs>
    qualityGates?: boolean | Project$qualityGatesArgs<ExtArgs>
    files?: boolean | Project$filesArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    status?: boolean
    repository?: boolean
    framework?: boolean
    language?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    status?: boolean
    repository?: boolean
    framework?: boolean
    language?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
  }

  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    tasks?: boolean | Project$tasksArgs<ExtArgs>
    deployments?: boolean | Project$deploymentsArgs<ExtArgs>
    qualityGates?: boolean | Project$qualityGatesArgs<ExtArgs>
    files?: boolean | Project$filesArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      tasks: Prisma.$TaskPayload<ExtArgs>[]
      deployments: Prisma.$DeploymentPayload<ExtArgs>[]
      qualityGates: Prisma.$QualityGatePayload<ExtArgs>[]
      files: Prisma.$ProjectFilePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      status: $Enums.ProjectStatus
      repository: string | null
      framework: string | null
      language: string | null
      createdAt: Date
      updatedAt: Date
      userId: string
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    tasks<T extends Project$tasksArgs<ExtArgs> = {}>(args?: Subset<T, Project$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany"> | Null>
    deployments<T extends Project$deploymentsArgs<ExtArgs> = {}>(args?: Subset<T, Project$deploymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeploymentPayload<ExtArgs>, T, "findMany"> | Null>
    qualityGates<T extends Project$qualityGatesArgs<ExtArgs> = {}>(args?: Subset<T, Project$qualityGatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QualityGatePayload<ExtArgs>, T, "findMany"> | Null>
    files<T extends Project$filesArgs<ExtArgs> = {}>(args?: Subset<T, Project$filesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Project model
   */ 
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'String'>
    readonly name: FieldRef<"Project", 'String'>
    readonly description: FieldRef<"Project", 'String'>
    readonly status: FieldRef<"Project", 'ProjectStatus'>
    readonly repository: FieldRef<"Project", 'String'>
    readonly framework: FieldRef<"Project", 'String'>
    readonly language: FieldRef<"Project", 'String'>
    readonly createdAt: FieldRef<"Project", 'DateTime'>
    readonly updatedAt: FieldRef<"Project", 'DateTime'>
    readonly userId: FieldRef<"Project", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
  }

  /**
   * Project.tasks
   */
  export type Project$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Project.deployments
   */
  export type Project$deploymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deployment
     */
    select?: DeploymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeploymentInclude<ExtArgs> | null
    where?: DeploymentWhereInput
    orderBy?: DeploymentOrderByWithRelationInput | DeploymentOrderByWithRelationInput[]
    cursor?: DeploymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeploymentScalarFieldEnum | DeploymentScalarFieldEnum[]
  }

  /**
   * Project.qualityGates
   */
  export type Project$qualityGatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualityGate
     */
    select?: QualityGateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualityGateInclude<ExtArgs> | null
    where?: QualityGateWhereInput
    orderBy?: QualityGateOrderByWithRelationInput | QualityGateOrderByWithRelationInput[]
    cursor?: QualityGateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QualityGateScalarFieldEnum | QualityGateScalarFieldEnum[]
  }

  /**
   * Project.files
   */
  export type Project$filesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    where?: ProjectFileWhereInput
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    cursor?: ProjectFileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Model Task
   */

  export type AggregateTask = {
    _count: TaskCountAggregateOutputType | null
    _avg: TaskAvgAggregateOutputType | null
    _sum: TaskSumAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  export type TaskAvgAggregateOutputType = {
    tokenUsage: number | null
    cost: number | null
    duration: number | null
    quality: number | null
  }

  export type TaskSumAggregateOutputType = {
    tokenUsage: number | null
    cost: number | null
    duration: number | null
    quality: number | null
  }

  export type TaskMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    status: $Enums.TaskStatus | null
    priority: $Enums.Priority | null
    aiProvider: $Enums.AIProvider | null
    model: string | null
    type: $Enums.TaskType | null
    diff: string | null
    tokenUsage: number | null
    cost: number | null
    duration: number | null
    quality: number | null
    createdAt: Date | null
    updatedAt: Date | null
    completedAt: Date | null
    projectId: string | null
    userId: string | null
  }

  export type TaskMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    status: $Enums.TaskStatus | null
    priority: $Enums.Priority | null
    aiProvider: $Enums.AIProvider | null
    model: string | null
    type: $Enums.TaskType | null
    diff: string | null
    tokenUsage: number | null
    cost: number | null
    duration: number | null
    quality: number | null
    createdAt: Date | null
    updatedAt: Date | null
    completedAt: Date | null
    projectId: string | null
    userId: string | null
  }

  export type TaskCountAggregateOutputType = {
    id: number
    title: number
    description: number
    status: number
    priority: number
    aiProvider: number
    model: number
    type: number
    context: number
    requirements: number
    constraints: number
    result: number
    diff: number
    artifacts: number
    tokenUsage: number
    cost: number
    duration: number
    quality: number
    createdAt: number
    updatedAt: number
    completedAt: number
    projectId: number
    userId: number
    _all: number
  }


  export type TaskAvgAggregateInputType = {
    tokenUsage?: true
    cost?: true
    duration?: true
    quality?: true
  }

  export type TaskSumAggregateInputType = {
    tokenUsage?: true
    cost?: true
    duration?: true
    quality?: true
  }

  export type TaskMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    status?: true
    priority?: true
    aiProvider?: true
    model?: true
    type?: true
    diff?: true
    tokenUsage?: true
    cost?: true
    duration?: true
    quality?: true
    createdAt?: true
    updatedAt?: true
    completedAt?: true
    projectId?: true
    userId?: true
  }

  export type TaskMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    status?: true
    priority?: true
    aiProvider?: true
    model?: true
    type?: true
    diff?: true
    tokenUsage?: true
    cost?: true
    duration?: true
    quality?: true
    createdAt?: true
    updatedAt?: true
    completedAt?: true
    projectId?: true
    userId?: true
  }

  export type TaskCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    status?: true
    priority?: true
    aiProvider?: true
    model?: true
    type?: true
    context?: true
    requirements?: true
    constraints?: true
    result?: true
    diff?: true
    artifacts?: true
    tokenUsage?: true
    cost?: true
    duration?: true
    quality?: true
    createdAt?: true
    updatedAt?: true
    completedAt?: true
    projectId?: true
    userId?: true
    _all?: true
  }

  export type TaskAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Task to aggregate.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tasks
    **/
    _count?: true | TaskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TaskAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TaskSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskMaxAggregateInputType
  }

  export type GetTaskAggregateType<T extends TaskAggregateArgs> = {
        [P in keyof T & keyof AggregateTask]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTask[P]>
      : GetScalarType<T[P], AggregateTask[P]>
  }




  export type TaskGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithAggregationInput | TaskOrderByWithAggregationInput[]
    by: TaskScalarFieldEnum[] | TaskScalarFieldEnum
    having?: TaskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskCountAggregateInputType | true
    _avg?: TaskAvgAggregateInputType
    _sum?: TaskSumAggregateInputType
    _min?: TaskMinAggregateInputType
    _max?: TaskMaxAggregateInputType
  }

  export type TaskGroupByOutputType = {
    id: string
    title: string
    description: string | null
    status: $Enums.TaskStatus
    priority: $Enums.Priority
    aiProvider: $Enums.AIProvider
    model: string | null
    type: $Enums.TaskType
    context: JsonValue | null
    requirements: JsonValue | null
    constraints: JsonValue | null
    result: JsonValue | null
    diff: string | null
    artifacts: JsonValue | null
    tokenUsage: number | null
    cost: number | null
    duration: number | null
    quality: number | null
    createdAt: Date
    updatedAt: Date
    completedAt: Date | null
    projectId: string
    userId: string
    _count: TaskCountAggregateOutputType | null
    _avg: TaskAvgAggregateOutputType | null
    _sum: TaskSumAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  type GetTaskGroupByPayload<T extends TaskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskGroupByOutputType[P]>
            : GetScalarType<T[P], TaskGroupByOutputType[P]>
        }
      >
    >


  export type TaskSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    priority?: boolean
    aiProvider?: boolean
    model?: boolean
    type?: boolean
    context?: boolean
    requirements?: boolean
    constraints?: boolean
    result?: boolean
    diff?: boolean
    artifacts?: boolean
    tokenUsage?: boolean
    cost?: boolean
    duration?: boolean
    quality?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    completedAt?: boolean
    projectId?: boolean
    userId?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    qualityGates?: boolean | Task$qualityGatesArgs<ExtArgs>
    executions?: boolean | Task$executionsArgs<ExtArgs>
    _count?: boolean | TaskCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    priority?: boolean
    aiProvider?: boolean
    model?: boolean
    type?: boolean
    context?: boolean
    requirements?: boolean
    constraints?: boolean
    result?: boolean
    diff?: boolean
    artifacts?: boolean
    tokenUsage?: boolean
    cost?: boolean
    duration?: boolean
    quality?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    completedAt?: boolean
    projectId?: boolean
    userId?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    priority?: boolean
    aiProvider?: boolean
    model?: boolean
    type?: boolean
    context?: boolean
    requirements?: boolean
    constraints?: boolean
    result?: boolean
    diff?: boolean
    artifacts?: boolean
    tokenUsage?: boolean
    cost?: boolean
    duration?: boolean
    quality?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    completedAt?: boolean
    projectId?: boolean
    userId?: boolean
  }

  export type TaskInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    qualityGates?: boolean | Task$qualityGatesArgs<ExtArgs>
    executions?: boolean | Task$executionsArgs<ExtArgs>
    _count?: boolean | TaskCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TaskIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TaskPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Task"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
      qualityGates: Prisma.$QualityGatePayload<ExtArgs>[]
      executions: Prisma.$TaskExecutionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string | null
      status: $Enums.TaskStatus
      priority: $Enums.Priority
      aiProvider: $Enums.AIProvider
      model: string | null
      type: $Enums.TaskType
      context: Prisma.JsonValue | null
      requirements: Prisma.JsonValue | null
      constraints: Prisma.JsonValue | null
      result: Prisma.JsonValue | null
      diff: string | null
      artifacts: Prisma.JsonValue | null
      tokenUsage: number | null
      cost: number | null
      duration: number | null
      quality: number | null
      createdAt: Date
      updatedAt: Date
      completedAt: Date | null
      projectId: string
      userId: string
    }, ExtArgs["result"]["task"]>
    composites: {}
  }

  type TaskGetPayload<S extends boolean | null | undefined | TaskDefaultArgs> = $Result.GetResult<Prisma.$TaskPayload, S>

  type TaskCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TaskFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TaskCountAggregateInputType | true
    }

  export interface TaskDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Task'], meta: { name: 'Task' } }
    /**
     * Find zero or one Task that matches the filter.
     * @param {TaskFindUniqueArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskFindUniqueArgs>(args: SelectSubset<T, TaskFindUniqueArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Task that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TaskFindUniqueOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Task that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskFindFirstArgs>(args?: SelectSubset<T, TaskFindFirstArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Task that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Tasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tasks
     * const tasks = await prisma.task.findMany()
     * 
     * // Get first 10 Tasks
     * const tasks = await prisma.task.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskWithIdOnly = await prisma.task.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskFindManyArgs>(args?: SelectSubset<T, TaskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Task.
     * @param {TaskCreateArgs} args - Arguments to create a Task.
     * @example
     * // Create one Task
     * const Task = await prisma.task.create({
     *   data: {
     *     // ... data to create a Task
     *   }
     * })
     * 
     */
    create<T extends TaskCreateArgs>(args: SelectSubset<T, TaskCreateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Tasks.
     * @param {TaskCreateManyArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskCreateManyArgs>(args?: SelectSubset<T, TaskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tasks and returns the data saved in the database.
     * @param {TaskCreateManyAndReturnArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tasks and only return the `id`
     * const taskWithIdOnly = await prisma.task.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Task.
     * @param {TaskDeleteArgs} args - Arguments to delete one Task.
     * @example
     * // Delete one Task
     * const Task = await prisma.task.delete({
     *   where: {
     *     // ... filter to delete one Task
     *   }
     * })
     * 
     */
    delete<T extends TaskDeleteArgs>(args: SelectSubset<T, TaskDeleteArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Task.
     * @param {TaskUpdateArgs} args - Arguments to update one Task.
     * @example
     * // Update one Task
     * const task = await prisma.task.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskUpdateArgs>(args: SelectSubset<T, TaskUpdateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Tasks.
     * @param {TaskDeleteManyArgs} args - Arguments to filter Tasks to delete.
     * @example
     * // Delete a few Tasks
     * const { count } = await prisma.task.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskDeleteManyArgs>(args?: SelectSubset<T, TaskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tasks
     * const task = await prisma.task.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskUpdateManyArgs>(args: SelectSubset<T, TaskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Task.
     * @param {TaskUpsertArgs} args - Arguments to update or create a Task.
     * @example
     * // Update or create a Task
     * const task = await prisma.task.upsert({
     *   create: {
     *     // ... data to create a Task
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Task we want to update
     *   }
     * })
     */
    upsert<T extends TaskUpsertArgs>(args: SelectSubset<T, TaskUpsertArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskCountArgs} args - Arguments to filter Tasks to count.
     * @example
     * // Count the number of Tasks
     * const count = await prisma.task.count({
     *   where: {
     *     // ... the filter for the Tasks we want to count
     *   }
     * })
    **/
    count<T extends TaskCountArgs>(
      args?: Subset<T, TaskCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaskAggregateArgs>(args: Subset<T, TaskAggregateArgs>): Prisma.PrismaPromise<GetTaskAggregateType<T>>

    /**
     * Group by Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TaskGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskGroupByArgs['orderBy'] }
        : { orderBy?: TaskGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Task model
   */
  readonly fields: TaskFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Task.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    qualityGates<T extends Task$qualityGatesArgs<ExtArgs> = {}>(args?: Subset<T, Task$qualityGatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QualityGatePayload<ExtArgs>, T, "findMany"> | Null>
    executions<T extends Task$executionsArgs<ExtArgs> = {}>(args?: Subset<T, Task$executionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskExecutionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Task model
   */ 
  interface TaskFieldRefs {
    readonly id: FieldRef<"Task", 'String'>
    readonly title: FieldRef<"Task", 'String'>
    readonly description: FieldRef<"Task", 'String'>
    readonly status: FieldRef<"Task", 'TaskStatus'>
    readonly priority: FieldRef<"Task", 'Priority'>
    readonly aiProvider: FieldRef<"Task", 'AIProvider'>
    readonly model: FieldRef<"Task", 'String'>
    readonly type: FieldRef<"Task", 'TaskType'>
    readonly context: FieldRef<"Task", 'Json'>
    readonly requirements: FieldRef<"Task", 'Json'>
    readonly constraints: FieldRef<"Task", 'Json'>
    readonly result: FieldRef<"Task", 'Json'>
    readonly diff: FieldRef<"Task", 'String'>
    readonly artifacts: FieldRef<"Task", 'Json'>
    readonly tokenUsage: FieldRef<"Task", 'Int'>
    readonly cost: FieldRef<"Task", 'Float'>
    readonly duration: FieldRef<"Task", 'Int'>
    readonly quality: FieldRef<"Task", 'Float'>
    readonly createdAt: FieldRef<"Task", 'DateTime'>
    readonly updatedAt: FieldRef<"Task", 'DateTime'>
    readonly completedAt: FieldRef<"Task", 'DateTime'>
    readonly projectId: FieldRef<"Task", 'String'>
    readonly userId: FieldRef<"Task", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Task findUnique
   */
  export type TaskFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findUniqueOrThrow
   */
  export type TaskFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findFirst
   */
  export type TaskFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findFirstOrThrow
   */
  export type TaskFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findMany
   */
  export type TaskFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Tasks to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task create
   */
  export type TaskCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to create a Task.
     */
    data: XOR<TaskCreateInput, TaskUncheckedCreateInput>
  }

  /**
   * Task createMany
   */
  export type TaskCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Task createManyAndReturn
   */
  export type TaskCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Task update
   */
  export type TaskUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to update a Task.
     */
    data: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
    /**
     * Choose, which Task to update.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task updateMany
   */
  export type TaskUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tasks.
     */
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyInput>
    /**
     * Filter which Tasks to update
     */
    where?: TaskWhereInput
  }

  /**
   * Task upsert
   */
  export type TaskUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The filter to search for the Task to update in case it exists.
     */
    where: TaskWhereUniqueInput
    /**
     * In case the Task found by the `where` argument doesn't exist, create a new Task with this data.
     */
    create: XOR<TaskCreateInput, TaskUncheckedCreateInput>
    /**
     * In case the Task was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
  }

  /**
   * Task delete
   */
  export type TaskDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter which Task to delete.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task deleteMany
   */
  export type TaskDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tasks to delete
     */
    where?: TaskWhereInput
  }

  /**
   * Task.qualityGates
   */
  export type Task$qualityGatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualityGate
     */
    select?: QualityGateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualityGateInclude<ExtArgs> | null
    where?: QualityGateWhereInput
    orderBy?: QualityGateOrderByWithRelationInput | QualityGateOrderByWithRelationInput[]
    cursor?: QualityGateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QualityGateScalarFieldEnum | QualityGateScalarFieldEnum[]
  }

  /**
   * Task.executions
   */
  export type Task$executionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskExecution
     */
    select?: TaskExecutionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskExecutionInclude<ExtArgs> | null
    where?: TaskExecutionWhereInput
    orderBy?: TaskExecutionOrderByWithRelationInput | TaskExecutionOrderByWithRelationInput[]
    cursor?: TaskExecutionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskExecutionScalarFieldEnum | TaskExecutionScalarFieldEnum[]
  }

  /**
   * Task without action
   */
  export type TaskDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
  }


  /**
   * Model TaskExecution
   */

  export type AggregateTaskExecution = {
    _count: TaskExecutionCountAggregateOutputType | null
    _min: TaskExecutionMinAggregateOutputType | null
    _max: TaskExecutionMaxAggregateOutputType | null
  }

  export type TaskExecutionMinAggregateOutputType = {
    id: string | null
    status: $Enums.ExecutionStatus | null
    startedAt: Date | null
    completedAt: Date | null
    errorMessage: string | null
    taskId: string | null
  }

  export type TaskExecutionMaxAggregateOutputType = {
    id: string | null
    status: $Enums.ExecutionStatus | null
    startedAt: Date | null
    completedAt: Date | null
    errorMessage: string | null
    taskId: string | null
  }

  export type TaskExecutionCountAggregateOutputType = {
    id: number
    status: number
    startedAt: number
    completedAt: number
    input: number
    output: number
    errorMessage: number
    logs: number
    metrics: number
    taskId: number
    _all: number
  }


  export type TaskExecutionMinAggregateInputType = {
    id?: true
    status?: true
    startedAt?: true
    completedAt?: true
    errorMessage?: true
    taskId?: true
  }

  export type TaskExecutionMaxAggregateInputType = {
    id?: true
    status?: true
    startedAt?: true
    completedAt?: true
    errorMessage?: true
    taskId?: true
  }

  export type TaskExecutionCountAggregateInputType = {
    id?: true
    status?: true
    startedAt?: true
    completedAt?: true
    input?: true
    output?: true
    errorMessage?: true
    logs?: true
    metrics?: true
    taskId?: true
    _all?: true
  }

  export type TaskExecutionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskExecution to aggregate.
     */
    where?: TaskExecutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskExecutions to fetch.
     */
    orderBy?: TaskExecutionOrderByWithRelationInput | TaskExecutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskExecutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskExecutions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskExecutions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TaskExecutions
    **/
    _count?: true | TaskExecutionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskExecutionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskExecutionMaxAggregateInputType
  }

  export type GetTaskExecutionAggregateType<T extends TaskExecutionAggregateArgs> = {
        [P in keyof T & keyof AggregateTaskExecution]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTaskExecution[P]>
      : GetScalarType<T[P], AggregateTaskExecution[P]>
  }




  export type TaskExecutionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskExecutionWhereInput
    orderBy?: TaskExecutionOrderByWithAggregationInput | TaskExecutionOrderByWithAggregationInput[]
    by: TaskExecutionScalarFieldEnum[] | TaskExecutionScalarFieldEnum
    having?: TaskExecutionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskExecutionCountAggregateInputType | true
    _min?: TaskExecutionMinAggregateInputType
    _max?: TaskExecutionMaxAggregateInputType
  }

  export type TaskExecutionGroupByOutputType = {
    id: string
    status: $Enums.ExecutionStatus
    startedAt: Date
    completedAt: Date | null
    input: JsonValue
    output: JsonValue | null
    errorMessage: string | null
    logs: JsonValue | null
    metrics: JsonValue | null
    taskId: string
    _count: TaskExecutionCountAggregateOutputType | null
    _min: TaskExecutionMinAggregateOutputType | null
    _max: TaskExecutionMaxAggregateOutputType | null
  }

  type GetTaskExecutionGroupByPayload<T extends TaskExecutionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskExecutionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskExecutionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskExecutionGroupByOutputType[P]>
            : GetScalarType<T[P], TaskExecutionGroupByOutputType[P]>
        }
      >
    >


  export type TaskExecutionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    status?: boolean
    startedAt?: boolean
    completedAt?: boolean
    input?: boolean
    output?: boolean
    errorMessage?: boolean
    logs?: boolean
    metrics?: boolean
    taskId?: boolean
    task?: boolean | TaskDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskExecution"]>

  export type TaskExecutionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    status?: boolean
    startedAt?: boolean
    completedAt?: boolean
    input?: boolean
    output?: boolean
    errorMessage?: boolean
    logs?: boolean
    metrics?: boolean
    taskId?: boolean
    task?: boolean | TaskDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskExecution"]>

  export type TaskExecutionSelectScalar = {
    id?: boolean
    status?: boolean
    startedAt?: boolean
    completedAt?: boolean
    input?: boolean
    output?: boolean
    errorMessage?: boolean
    logs?: boolean
    metrics?: boolean
    taskId?: boolean
  }

  export type TaskExecutionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | TaskDefaultArgs<ExtArgs>
  }
  export type TaskExecutionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    task?: boolean | TaskDefaultArgs<ExtArgs>
  }

  export type $TaskExecutionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TaskExecution"
    objects: {
      task: Prisma.$TaskPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      status: $Enums.ExecutionStatus
      startedAt: Date
      completedAt: Date | null
      input: Prisma.JsonValue
      output: Prisma.JsonValue | null
      errorMessage: string | null
      logs: Prisma.JsonValue | null
      metrics: Prisma.JsonValue | null
      taskId: string
    }, ExtArgs["result"]["taskExecution"]>
    composites: {}
  }

  type TaskExecutionGetPayload<S extends boolean | null | undefined | TaskExecutionDefaultArgs> = $Result.GetResult<Prisma.$TaskExecutionPayload, S>

  type TaskExecutionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TaskExecutionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TaskExecutionCountAggregateInputType | true
    }

  export interface TaskExecutionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TaskExecution'], meta: { name: 'TaskExecution' } }
    /**
     * Find zero or one TaskExecution that matches the filter.
     * @param {TaskExecutionFindUniqueArgs} args - Arguments to find a TaskExecution
     * @example
     * // Get one TaskExecution
     * const taskExecution = await prisma.taskExecution.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskExecutionFindUniqueArgs>(args: SelectSubset<T, TaskExecutionFindUniqueArgs<ExtArgs>>): Prisma__TaskExecutionClient<$Result.GetResult<Prisma.$TaskExecutionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TaskExecution that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TaskExecutionFindUniqueOrThrowArgs} args - Arguments to find a TaskExecution
     * @example
     * // Get one TaskExecution
     * const taskExecution = await prisma.taskExecution.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskExecutionFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskExecutionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskExecutionClient<$Result.GetResult<Prisma.$TaskExecutionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TaskExecution that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskExecutionFindFirstArgs} args - Arguments to find a TaskExecution
     * @example
     * // Get one TaskExecution
     * const taskExecution = await prisma.taskExecution.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskExecutionFindFirstArgs>(args?: SelectSubset<T, TaskExecutionFindFirstArgs<ExtArgs>>): Prisma__TaskExecutionClient<$Result.GetResult<Prisma.$TaskExecutionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TaskExecution that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskExecutionFindFirstOrThrowArgs} args - Arguments to find a TaskExecution
     * @example
     * // Get one TaskExecution
     * const taskExecution = await prisma.taskExecution.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskExecutionFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskExecutionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskExecutionClient<$Result.GetResult<Prisma.$TaskExecutionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TaskExecutions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskExecutionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TaskExecutions
     * const taskExecutions = await prisma.taskExecution.findMany()
     * 
     * // Get first 10 TaskExecutions
     * const taskExecutions = await prisma.taskExecution.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskExecutionWithIdOnly = await prisma.taskExecution.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskExecutionFindManyArgs>(args?: SelectSubset<T, TaskExecutionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskExecutionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TaskExecution.
     * @param {TaskExecutionCreateArgs} args - Arguments to create a TaskExecution.
     * @example
     * // Create one TaskExecution
     * const TaskExecution = await prisma.taskExecution.create({
     *   data: {
     *     // ... data to create a TaskExecution
     *   }
     * })
     * 
     */
    create<T extends TaskExecutionCreateArgs>(args: SelectSubset<T, TaskExecutionCreateArgs<ExtArgs>>): Prisma__TaskExecutionClient<$Result.GetResult<Prisma.$TaskExecutionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TaskExecutions.
     * @param {TaskExecutionCreateManyArgs} args - Arguments to create many TaskExecutions.
     * @example
     * // Create many TaskExecutions
     * const taskExecution = await prisma.taskExecution.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskExecutionCreateManyArgs>(args?: SelectSubset<T, TaskExecutionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TaskExecutions and returns the data saved in the database.
     * @param {TaskExecutionCreateManyAndReturnArgs} args - Arguments to create many TaskExecutions.
     * @example
     * // Create many TaskExecutions
     * const taskExecution = await prisma.taskExecution.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TaskExecutions and only return the `id`
     * const taskExecutionWithIdOnly = await prisma.taskExecution.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskExecutionCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskExecutionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskExecutionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TaskExecution.
     * @param {TaskExecutionDeleteArgs} args - Arguments to delete one TaskExecution.
     * @example
     * // Delete one TaskExecution
     * const TaskExecution = await prisma.taskExecution.delete({
     *   where: {
     *     // ... filter to delete one TaskExecution
     *   }
     * })
     * 
     */
    delete<T extends TaskExecutionDeleteArgs>(args: SelectSubset<T, TaskExecutionDeleteArgs<ExtArgs>>): Prisma__TaskExecutionClient<$Result.GetResult<Prisma.$TaskExecutionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TaskExecution.
     * @param {TaskExecutionUpdateArgs} args - Arguments to update one TaskExecution.
     * @example
     * // Update one TaskExecution
     * const taskExecution = await prisma.taskExecution.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskExecutionUpdateArgs>(args: SelectSubset<T, TaskExecutionUpdateArgs<ExtArgs>>): Prisma__TaskExecutionClient<$Result.GetResult<Prisma.$TaskExecutionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TaskExecutions.
     * @param {TaskExecutionDeleteManyArgs} args - Arguments to filter TaskExecutions to delete.
     * @example
     * // Delete a few TaskExecutions
     * const { count } = await prisma.taskExecution.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskExecutionDeleteManyArgs>(args?: SelectSubset<T, TaskExecutionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaskExecutions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskExecutionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TaskExecutions
     * const taskExecution = await prisma.taskExecution.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskExecutionUpdateManyArgs>(args: SelectSubset<T, TaskExecutionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TaskExecution.
     * @param {TaskExecutionUpsertArgs} args - Arguments to update or create a TaskExecution.
     * @example
     * // Update or create a TaskExecution
     * const taskExecution = await prisma.taskExecution.upsert({
     *   create: {
     *     // ... data to create a TaskExecution
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TaskExecution we want to update
     *   }
     * })
     */
    upsert<T extends TaskExecutionUpsertArgs>(args: SelectSubset<T, TaskExecutionUpsertArgs<ExtArgs>>): Prisma__TaskExecutionClient<$Result.GetResult<Prisma.$TaskExecutionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TaskExecutions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskExecutionCountArgs} args - Arguments to filter TaskExecutions to count.
     * @example
     * // Count the number of TaskExecutions
     * const count = await prisma.taskExecution.count({
     *   where: {
     *     // ... the filter for the TaskExecutions we want to count
     *   }
     * })
    **/
    count<T extends TaskExecutionCountArgs>(
      args?: Subset<T, TaskExecutionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskExecutionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TaskExecution.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskExecutionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaskExecutionAggregateArgs>(args: Subset<T, TaskExecutionAggregateArgs>): Prisma.PrismaPromise<GetTaskExecutionAggregateType<T>>

    /**
     * Group by TaskExecution.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskExecutionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TaskExecutionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskExecutionGroupByArgs['orderBy'] }
        : { orderBy?: TaskExecutionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TaskExecutionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskExecutionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TaskExecution model
   */
  readonly fields: TaskExecutionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TaskExecution.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskExecutionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    task<T extends TaskDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TaskDefaultArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TaskExecution model
   */ 
  interface TaskExecutionFieldRefs {
    readonly id: FieldRef<"TaskExecution", 'String'>
    readonly status: FieldRef<"TaskExecution", 'ExecutionStatus'>
    readonly startedAt: FieldRef<"TaskExecution", 'DateTime'>
    readonly completedAt: FieldRef<"TaskExecution", 'DateTime'>
    readonly input: FieldRef<"TaskExecution", 'Json'>
    readonly output: FieldRef<"TaskExecution", 'Json'>
    readonly errorMessage: FieldRef<"TaskExecution", 'String'>
    readonly logs: FieldRef<"TaskExecution", 'Json'>
    readonly metrics: FieldRef<"TaskExecution", 'Json'>
    readonly taskId: FieldRef<"TaskExecution", 'String'>
  }
    

  // Custom InputTypes
  /**
   * TaskExecution findUnique
   */
  export type TaskExecutionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskExecution
     */
    select?: TaskExecutionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskExecutionInclude<ExtArgs> | null
    /**
     * Filter, which TaskExecution to fetch.
     */
    where: TaskExecutionWhereUniqueInput
  }

  /**
   * TaskExecution findUniqueOrThrow
   */
  export type TaskExecutionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskExecution
     */
    select?: TaskExecutionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskExecutionInclude<ExtArgs> | null
    /**
     * Filter, which TaskExecution to fetch.
     */
    where: TaskExecutionWhereUniqueInput
  }

  /**
   * TaskExecution findFirst
   */
  export type TaskExecutionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskExecution
     */
    select?: TaskExecutionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskExecutionInclude<ExtArgs> | null
    /**
     * Filter, which TaskExecution to fetch.
     */
    where?: TaskExecutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskExecutions to fetch.
     */
    orderBy?: TaskExecutionOrderByWithRelationInput | TaskExecutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskExecutions.
     */
    cursor?: TaskExecutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskExecutions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskExecutions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskExecutions.
     */
    distinct?: TaskExecutionScalarFieldEnum | TaskExecutionScalarFieldEnum[]
  }

  /**
   * TaskExecution findFirstOrThrow
   */
  export type TaskExecutionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskExecution
     */
    select?: TaskExecutionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskExecutionInclude<ExtArgs> | null
    /**
     * Filter, which TaskExecution to fetch.
     */
    where?: TaskExecutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskExecutions to fetch.
     */
    orderBy?: TaskExecutionOrderByWithRelationInput | TaskExecutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskExecutions.
     */
    cursor?: TaskExecutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskExecutions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskExecutions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskExecutions.
     */
    distinct?: TaskExecutionScalarFieldEnum | TaskExecutionScalarFieldEnum[]
  }

  /**
   * TaskExecution findMany
   */
  export type TaskExecutionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskExecution
     */
    select?: TaskExecutionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskExecutionInclude<ExtArgs> | null
    /**
     * Filter, which TaskExecutions to fetch.
     */
    where?: TaskExecutionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskExecutions to fetch.
     */
    orderBy?: TaskExecutionOrderByWithRelationInput | TaskExecutionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TaskExecutions.
     */
    cursor?: TaskExecutionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskExecutions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskExecutions.
     */
    skip?: number
    distinct?: TaskExecutionScalarFieldEnum | TaskExecutionScalarFieldEnum[]
  }

  /**
   * TaskExecution create
   */
  export type TaskExecutionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskExecution
     */
    select?: TaskExecutionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskExecutionInclude<ExtArgs> | null
    /**
     * The data needed to create a TaskExecution.
     */
    data: XOR<TaskExecutionCreateInput, TaskExecutionUncheckedCreateInput>
  }

  /**
   * TaskExecution createMany
   */
  export type TaskExecutionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TaskExecutions.
     */
    data: TaskExecutionCreateManyInput | TaskExecutionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TaskExecution createManyAndReturn
   */
  export type TaskExecutionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskExecution
     */
    select?: TaskExecutionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TaskExecutions.
     */
    data: TaskExecutionCreateManyInput | TaskExecutionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskExecutionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TaskExecution update
   */
  export type TaskExecutionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskExecution
     */
    select?: TaskExecutionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskExecutionInclude<ExtArgs> | null
    /**
     * The data needed to update a TaskExecution.
     */
    data: XOR<TaskExecutionUpdateInput, TaskExecutionUncheckedUpdateInput>
    /**
     * Choose, which TaskExecution to update.
     */
    where: TaskExecutionWhereUniqueInput
  }

  /**
   * TaskExecution updateMany
   */
  export type TaskExecutionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TaskExecutions.
     */
    data: XOR<TaskExecutionUpdateManyMutationInput, TaskExecutionUncheckedUpdateManyInput>
    /**
     * Filter which TaskExecutions to update
     */
    where?: TaskExecutionWhereInput
  }

  /**
   * TaskExecution upsert
   */
  export type TaskExecutionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskExecution
     */
    select?: TaskExecutionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskExecutionInclude<ExtArgs> | null
    /**
     * The filter to search for the TaskExecution to update in case it exists.
     */
    where: TaskExecutionWhereUniqueInput
    /**
     * In case the TaskExecution found by the `where` argument doesn't exist, create a new TaskExecution with this data.
     */
    create: XOR<TaskExecutionCreateInput, TaskExecutionUncheckedCreateInput>
    /**
     * In case the TaskExecution was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskExecutionUpdateInput, TaskExecutionUncheckedUpdateInput>
  }

  /**
   * TaskExecution delete
   */
  export type TaskExecutionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskExecution
     */
    select?: TaskExecutionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskExecutionInclude<ExtArgs> | null
    /**
     * Filter which TaskExecution to delete.
     */
    where: TaskExecutionWhereUniqueInput
  }

  /**
   * TaskExecution deleteMany
   */
  export type TaskExecutionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskExecutions to delete
     */
    where?: TaskExecutionWhereInput
  }

  /**
   * TaskExecution without action
   */
  export type TaskExecutionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskExecution
     */
    select?: TaskExecutionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskExecutionInclude<ExtArgs> | null
  }


  /**
   * Model QualityGate
   */

  export type AggregateQualityGate = {
    _count: QualityGateCountAggregateOutputType | null
    _avg: QualityGateAvgAggregateOutputType | null
    _sum: QualityGateSumAggregateOutputType | null
    _min: QualityGateMinAggregateOutputType | null
    _max: QualityGateMaxAggregateOutputType | null
  }

  export type QualityGateAvgAggregateOutputType = {
    score: number | null
  }

  export type QualityGateSumAggregateOutputType = {
    score: number | null
  }

  export type QualityGateMinAggregateOutputType = {
    id: string | null
    name: string | null
    type: $Enums.QualityGateType | null
    status: $Enums.QualityStatus | null
    score: number | null
    createdAt: Date | null
    updatedAt: Date | null
    projectId: string | null
    taskId: string | null
  }

  export type QualityGateMaxAggregateOutputType = {
    id: string | null
    name: string | null
    type: $Enums.QualityGateType | null
    status: $Enums.QualityStatus | null
    score: number | null
    createdAt: Date | null
    updatedAt: Date | null
    projectId: string | null
    taskId: string | null
  }

  export type QualityGateCountAggregateOutputType = {
    id: number
    name: number
    type: number
    status: number
    rules: number
    config: number
    score: number
    issues: number
    report: number
    createdAt: number
    updatedAt: number
    projectId: number
    taskId: number
    _all: number
  }


  export type QualityGateAvgAggregateInputType = {
    score?: true
  }

  export type QualityGateSumAggregateInputType = {
    score?: true
  }

  export type QualityGateMinAggregateInputType = {
    id?: true
    name?: true
    type?: true
    status?: true
    score?: true
    createdAt?: true
    updatedAt?: true
    projectId?: true
    taskId?: true
  }

  export type QualityGateMaxAggregateInputType = {
    id?: true
    name?: true
    type?: true
    status?: true
    score?: true
    createdAt?: true
    updatedAt?: true
    projectId?: true
    taskId?: true
  }

  export type QualityGateCountAggregateInputType = {
    id?: true
    name?: true
    type?: true
    status?: true
    rules?: true
    config?: true
    score?: true
    issues?: true
    report?: true
    createdAt?: true
    updatedAt?: true
    projectId?: true
    taskId?: true
    _all?: true
  }

  export type QualityGateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QualityGate to aggregate.
     */
    where?: QualityGateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QualityGates to fetch.
     */
    orderBy?: QualityGateOrderByWithRelationInput | QualityGateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QualityGateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QualityGates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QualityGates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QualityGates
    **/
    _count?: true | QualityGateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QualityGateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QualityGateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QualityGateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QualityGateMaxAggregateInputType
  }

  export type GetQualityGateAggregateType<T extends QualityGateAggregateArgs> = {
        [P in keyof T & keyof AggregateQualityGate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQualityGate[P]>
      : GetScalarType<T[P], AggregateQualityGate[P]>
  }




  export type QualityGateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QualityGateWhereInput
    orderBy?: QualityGateOrderByWithAggregationInput | QualityGateOrderByWithAggregationInput[]
    by: QualityGateScalarFieldEnum[] | QualityGateScalarFieldEnum
    having?: QualityGateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QualityGateCountAggregateInputType | true
    _avg?: QualityGateAvgAggregateInputType
    _sum?: QualityGateSumAggregateInputType
    _min?: QualityGateMinAggregateInputType
    _max?: QualityGateMaxAggregateInputType
  }

  export type QualityGateGroupByOutputType = {
    id: string
    name: string
    type: $Enums.QualityGateType
    status: $Enums.QualityStatus
    rules: JsonValue
    config: JsonValue | null
    score: number | null
    issues: JsonValue | null
    report: JsonValue | null
    createdAt: Date
    updatedAt: Date
    projectId: string
    taskId: string | null
    _count: QualityGateCountAggregateOutputType | null
    _avg: QualityGateAvgAggregateOutputType | null
    _sum: QualityGateSumAggregateOutputType | null
    _min: QualityGateMinAggregateOutputType | null
    _max: QualityGateMaxAggregateOutputType | null
  }

  type GetQualityGateGroupByPayload<T extends QualityGateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QualityGateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QualityGateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QualityGateGroupByOutputType[P]>
            : GetScalarType<T[P], QualityGateGroupByOutputType[P]>
        }
      >
    >


  export type QualityGateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    status?: boolean
    rules?: boolean
    config?: boolean
    score?: boolean
    issues?: boolean
    report?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    projectId?: boolean
    taskId?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    task?: boolean | QualityGate$taskArgs<ExtArgs>
  }, ExtArgs["result"]["qualityGate"]>

  export type QualityGateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    type?: boolean
    status?: boolean
    rules?: boolean
    config?: boolean
    score?: boolean
    issues?: boolean
    report?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    projectId?: boolean
    taskId?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    task?: boolean | QualityGate$taskArgs<ExtArgs>
  }, ExtArgs["result"]["qualityGate"]>

  export type QualityGateSelectScalar = {
    id?: boolean
    name?: boolean
    type?: boolean
    status?: boolean
    rules?: boolean
    config?: boolean
    score?: boolean
    issues?: boolean
    report?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    projectId?: boolean
    taskId?: boolean
  }

  export type QualityGateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    task?: boolean | QualityGate$taskArgs<ExtArgs>
  }
  export type QualityGateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
    task?: boolean | QualityGate$taskArgs<ExtArgs>
  }

  export type $QualityGatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QualityGate"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
      task: Prisma.$TaskPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      type: $Enums.QualityGateType
      status: $Enums.QualityStatus
      rules: Prisma.JsonValue
      config: Prisma.JsonValue | null
      score: number | null
      issues: Prisma.JsonValue | null
      report: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
      projectId: string
      taskId: string | null
    }, ExtArgs["result"]["qualityGate"]>
    composites: {}
  }

  type QualityGateGetPayload<S extends boolean | null | undefined | QualityGateDefaultArgs> = $Result.GetResult<Prisma.$QualityGatePayload, S>

  type QualityGateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<QualityGateFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: QualityGateCountAggregateInputType | true
    }

  export interface QualityGateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QualityGate'], meta: { name: 'QualityGate' } }
    /**
     * Find zero or one QualityGate that matches the filter.
     * @param {QualityGateFindUniqueArgs} args - Arguments to find a QualityGate
     * @example
     * // Get one QualityGate
     * const qualityGate = await prisma.qualityGate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QualityGateFindUniqueArgs>(args: SelectSubset<T, QualityGateFindUniqueArgs<ExtArgs>>): Prisma__QualityGateClient<$Result.GetResult<Prisma.$QualityGatePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one QualityGate that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {QualityGateFindUniqueOrThrowArgs} args - Arguments to find a QualityGate
     * @example
     * // Get one QualityGate
     * const qualityGate = await prisma.qualityGate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QualityGateFindUniqueOrThrowArgs>(args: SelectSubset<T, QualityGateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QualityGateClient<$Result.GetResult<Prisma.$QualityGatePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first QualityGate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QualityGateFindFirstArgs} args - Arguments to find a QualityGate
     * @example
     * // Get one QualityGate
     * const qualityGate = await prisma.qualityGate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QualityGateFindFirstArgs>(args?: SelectSubset<T, QualityGateFindFirstArgs<ExtArgs>>): Prisma__QualityGateClient<$Result.GetResult<Prisma.$QualityGatePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first QualityGate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QualityGateFindFirstOrThrowArgs} args - Arguments to find a QualityGate
     * @example
     * // Get one QualityGate
     * const qualityGate = await prisma.qualityGate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QualityGateFindFirstOrThrowArgs>(args?: SelectSubset<T, QualityGateFindFirstOrThrowArgs<ExtArgs>>): Prisma__QualityGateClient<$Result.GetResult<Prisma.$QualityGatePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more QualityGates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QualityGateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QualityGates
     * const qualityGates = await prisma.qualityGate.findMany()
     * 
     * // Get first 10 QualityGates
     * const qualityGates = await prisma.qualityGate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const qualityGateWithIdOnly = await prisma.qualityGate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QualityGateFindManyArgs>(args?: SelectSubset<T, QualityGateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QualityGatePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a QualityGate.
     * @param {QualityGateCreateArgs} args - Arguments to create a QualityGate.
     * @example
     * // Create one QualityGate
     * const QualityGate = await prisma.qualityGate.create({
     *   data: {
     *     // ... data to create a QualityGate
     *   }
     * })
     * 
     */
    create<T extends QualityGateCreateArgs>(args: SelectSubset<T, QualityGateCreateArgs<ExtArgs>>): Prisma__QualityGateClient<$Result.GetResult<Prisma.$QualityGatePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many QualityGates.
     * @param {QualityGateCreateManyArgs} args - Arguments to create many QualityGates.
     * @example
     * // Create many QualityGates
     * const qualityGate = await prisma.qualityGate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QualityGateCreateManyArgs>(args?: SelectSubset<T, QualityGateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QualityGates and returns the data saved in the database.
     * @param {QualityGateCreateManyAndReturnArgs} args - Arguments to create many QualityGates.
     * @example
     * // Create many QualityGates
     * const qualityGate = await prisma.qualityGate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QualityGates and only return the `id`
     * const qualityGateWithIdOnly = await prisma.qualityGate.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QualityGateCreateManyAndReturnArgs>(args?: SelectSubset<T, QualityGateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QualityGatePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a QualityGate.
     * @param {QualityGateDeleteArgs} args - Arguments to delete one QualityGate.
     * @example
     * // Delete one QualityGate
     * const QualityGate = await prisma.qualityGate.delete({
     *   where: {
     *     // ... filter to delete one QualityGate
     *   }
     * })
     * 
     */
    delete<T extends QualityGateDeleteArgs>(args: SelectSubset<T, QualityGateDeleteArgs<ExtArgs>>): Prisma__QualityGateClient<$Result.GetResult<Prisma.$QualityGatePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one QualityGate.
     * @param {QualityGateUpdateArgs} args - Arguments to update one QualityGate.
     * @example
     * // Update one QualityGate
     * const qualityGate = await prisma.qualityGate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QualityGateUpdateArgs>(args: SelectSubset<T, QualityGateUpdateArgs<ExtArgs>>): Prisma__QualityGateClient<$Result.GetResult<Prisma.$QualityGatePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more QualityGates.
     * @param {QualityGateDeleteManyArgs} args - Arguments to filter QualityGates to delete.
     * @example
     * // Delete a few QualityGates
     * const { count } = await prisma.qualityGate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QualityGateDeleteManyArgs>(args?: SelectSubset<T, QualityGateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QualityGates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QualityGateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QualityGates
     * const qualityGate = await prisma.qualityGate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QualityGateUpdateManyArgs>(args: SelectSubset<T, QualityGateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one QualityGate.
     * @param {QualityGateUpsertArgs} args - Arguments to update or create a QualityGate.
     * @example
     * // Update or create a QualityGate
     * const qualityGate = await prisma.qualityGate.upsert({
     *   create: {
     *     // ... data to create a QualityGate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QualityGate we want to update
     *   }
     * })
     */
    upsert<T extends QualityGateUpsertArgs>(args: SelectSubset<T, QualityGateUpsertArgs<ExtArgs>>): Prisma__QualityGateClient<$Result.GetResult<Prisma.$QualityGatePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of QualityGates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QualityGateCountArgs} args - Arguments to filter QualityGates to count.
     * @example
     * // Count the number of QualityGates
     * const count = await prisma.qualityGate.count({
     *   where: {
     *     // ... the filter for the QualityGates we want to count
     *   }
     * })
    **/
    count<T extends QualityGateCountArgs>(
      args?: Subset<T, QualityGateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QualityGateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QualityGate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QualityGateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QualityGateAggregateArgs>(args: Subset<T, QualityGateAggregateArgs>): Prisma.PrismaPromise<GetQualityGateAggregateType<T>>

    /**
     * Group by QualityGate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QualityGateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QualityGateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QualityGateGroupByArgs['orderBy'] }
        : { orderBy?: QualityGateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QualityGateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQualityGateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QualityGate model
   */
  readonly fields: QualityGateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QualityGate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QualityGateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    task<T extends QualityGate$taskArgs<ExtArgs> = {}>(args?: Subset<T, QualityGate$taskArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the QualityGate model
   */ 
  interface QualityGateFieldRefs {
    readonly id: FieldRef<"QualityGate", 'String'>
    readonly name: FieldRef<"QualityGate", 'String'>
    readonly type: FieldRef<"QualityGate", 'QualityGateType'>
    readonly status: FieldRef<"QualityGate", 'QualityStatus'>
    readonly rules: FieldRef<"QualityGate", 'Json'>
    readonly config: FieldRef<"QualityGate", 'Json'>
    readonly score: FieldRef<"QualityGate", 'Float'>
    readonly issues: FieldRef<"QualityGate", 'Json'>
    readonly report: FieldRef<"QualityGate", 'Json'>
    readonly createdAt: FieldRef<"QualityGate", 'DateTime'>
    readonly updatedAt: FieldRef<"QualityGate", 'DateTime'>
    readonly projectId: FieldRef<"QualityGate", 'String'>
    readonly taskId: FieldRef<"QualityGate", 'String'>
  }
    

  // Custom InputTypes
  /**
   * QualityGate findUnique
   */
  export type QualityGateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualityGate
     */
    select?: QualityGateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualityGateInclude<ExtArgs> | null
    /**
     * Filter, which QualityGate to fetch.
     */
    where: QualityGateWhereUniqueInput
  }

  /**
   * QualityGate findUniqueOrThrow
   */
  export type QualityGateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualityGate
     */
    select?: QualityGateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualityGateInclude<ExtArgs> | null
    /**
     * Filter, which QualityGate to fetch.
     */
    where: QualityGateWhereUniqueInput
  }

  /**
   * QualityGate findFirst
   */
  export type QualityGateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualityGate
     */
    select?: QualityGateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualityGateInclude<ExtArgs> | null
    /**
     * Filter, which QualityGate to fetch.
     */
    where?: QualityGateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QualityGates to fetch.
     */
    orderBy?: QualityGateOrderByWithRelationInput | QualityGateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QualityGates.
     */
    cursor?: QualityGateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QualityGates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QualityGates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QualityGates.
     */
    distinct?: QualityGateScalarFieldEnum | QualityGateScalarFieldEnum[]
  }

  /**
   * QualityGate findFirstOrThrow
   */
  export type QualityGateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualityGate
     */
    select?: QualityGateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualityGateInclude<ExtArgs> | null
    /**
     * Filter, which QualityGate to fetch.
     */
    where?: QualityGateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QualityGates to fetch.
     */
    orderBy?: QualityGateOrderByWithRelationInput | QualityGateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QualityGates.
     */
    cursor?: QualityGateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QualityGates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QualityGates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QualityGates.
     */
    distinct?: QualityGateScalarFieldEnum | QualityGateScalarFieldEnum[]
  }

  /**
   * QualityGate findMany
   */
  export type QualityGateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualityGate
     */
    select?: QualityGateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualityGateInclude<ExtArgs> | null
    /**
     * Filter, which QualityGates to fetch.
     */
    where?: QualityGateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QualityGates to fetch.
     */
    orderBy?: QualityGateOrderByWithRelationInput | QualityGateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QualityGates.
     */
    cursor?: QualityGateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QualityGates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QualityGates.
     */
    skip?: number
    distinct?: QualityGateScalarFieldEnum | QualityGateScalarFieldEnum[]
  }

  /**
   * QualityGate create
   */
  export type QualityGateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualityGate
     */
    select?: QualityGateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualityGateInclude<ExtArgs> | null
    /**
     * The data needed to create a QualityGate.
     */
    data: XOR<QualityGateCreateInput, QualityGateUncheckedCreateInput>
  }

  /**
   * QualityGate createMany
   */
  export type QualityGateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QualityGates.
     */
    data: QualityGateCreateManyInput | QualityGateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QualityGate createManyAndReturn
   */
  export type QualityGateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualityGate
     */
    select?: QualityGateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many QualityGates.
     */
    data: QualityGateCreateManyInput | QualityGateCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualityGateIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * QualityGate update
   */
  export type QualityGateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualityGate
     */
    select?: QualityGateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualityGateInclude<ExtArgs> | null
    /**
     * The data needed to update a QualityGate.
     */
    data: XOR<QualityGateUpdateInput, QualityGateUncheckedUpdateInput>
    /**
     * Choose, which QualityGate to update.
     */
    where: QualityGateWhereUniqueInput
  }

  /**
   * QualityGate updateMany
   */
  export type QualityGateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QualityGates.
     */
    data: XOR<QualityGateUpdateManyMutationInput, QualityGateUncheckedUpdateManyInput>
    /**
     * Filter which QualityGates to update
     */
    where?: QualityGateWhereInput
  }

  /**
   * QualityGate upsert
   */
  export type QualityGateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualityGate
     */
    select?: QualityGateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualityGateInclude<ExtArgs> | null
    /**
     * The filter to search for the QualityGate to update in case it exists.
     */
    where: QualityGateWhereUniqueInput
    /**
     * In case the QualityGate found by the `where` argument doesn't exist, create a new QualityGate with this data.
     */
    create: XOR<QualityGateCreateInput, QualityGateUncheckedCreateInput>
    /**
     * In case the QualityGate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QualityGateUpdateInput, QualityGateUncheckedUpdateInput>
  }

  /**
   * QualityGate delete
   */
  export type QualityGateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualityGate
     */
    select?: QualityGateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualityGateInclude<ExtArgs> | null
    /**
     * Filter which QualityGate to delete.
     */
    where: QualityGateWhereUniqueInput
  }

  /**
   * QualityGate deleteMany
   */
  export type QualityGateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QualityGates to delete
     */
    where?: QualityGateWhereInput
  }

  /**
   * QualityGate.task
   */
  export type QualityGate$taskArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
  }

  /**
   * QualityGate without action
   */
  export type QualityGateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QualityGate
     */
    select?: QualityGateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QualityGateInclude<ExtArgs> | null
  }


  /**
   * Model AITeam
   */

  export type AggregateAITeam = {
    _count: AITeamCountAggregateOutputType | null
    _min: AITeamMinAggregateOutputType | null
    _max: AITeamMaxAggregateOutputType | null
  }

  export type AITeamMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    status: $Enums.TeamStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AITeamMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    status: $Enums.TeamStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AITeamCountAggregateOutputType = {
    id: number
    name: number
    description: number
    status: number
    strategy: number
    preferences: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AITeamMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AITeamMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AITeamCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    status?: true
    strategy?: true
    preferences?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AITeamAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AITeam to aggregate.
     */
    where?: AITeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AITeams to fetch.
     */
    orderBy?: AITeamOrderByWithRelationInput | AITeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AITeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AITeams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AITeams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AITeams
    **/
    _count?: true | AITeamCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AITeamMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AITeamMaxAggregateInputType
  }

  export type GetAITeamAggregateType<T extends AITeamAggregateArgs> = {
        [P in keyof T & keyof AggregateAITeam]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAITeam[P]>
      : GetScalarType<T[P], AggregateAITeam[P]>
  }




  export type AITeamGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AITeamWhereInput
    orderBy?: AITeamOrderByWithAggregationInput | AITeamOrderByWithAggregationInput[]
    by: AITeamScalarFieldEnum[] | AITeamScalarFieldEnum
    having?: AITeamScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AITeamCountAggregateInputType | true
    _min?: AITeamMinAggregateInputType
    _max?: AITeamMaxAggregateInputType
  }

  export type AITeamGroupByOutputType = {
    id: string
    name: string
    description: string | null
    status: $Enums.TeamStatus
    strategy: JsonValue
    preferences: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: AITeamCountAggregateOutputType | null
    _min: AITeamMinAggregateOutputType | null
    _max: AITeamMaxAggregateOutputType | null
  }

  type GetAITeamGroupByPayload<T extends AITeamGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AITeamGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AITeamGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AITeamGroupByOutputType[P]>
            : GetScalarType<T[P], AITeamGroupByOutputType[P]>
        }
      >
    >


  export type AITeamSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    status?: boolean
    strategy?: boolean
    preferences?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    members?: boolean | AITeam$membersArgs<ExtArgs>
    _count?: boolean | AITeamCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aITeam"]>

  export type AITeamSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    status?: boolean
    strategy?: boolean
    preferences?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aITeam"]>

  export type AITeamSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    status?: boolean
    strategy?: boolean
    preferences?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AITeamInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | AITeam$membersArgs<ExtArgs>
    _count?: boolean | AITeamCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AITeamIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AITeamPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AITeam"
    objects: {
      members: Prisma.$TeamMemberPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      status: $Enums.TeamStatus
      strategy: Prisma.JsonValue
      preferences: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["aITeam"]>
    composites: {}
  }

  type AITeamGetPayload<S extends boolean | null | undefined | AITeamDefaultArgs> = $Result.GetResult<Prisma.$AITeamPayload, S>

  type AITeamCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AITeamFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AITeamCountAggregateInputType | true
    }

  export interface AITeamDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AITeam'], meta: { name: 'AITeam' } }
    /**
     * Find zero or one AITeam that matches the filter.
     * @param {AITeamFindUniqueArgs} args - Arguments to find a AITeam
     * @example
     * // Get one AITeam
     * const aITeam = await prisma.aITeam.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AITeamFindUniqueArgs>(args: SelectSubset<T, AITeamFindUniqueArgs<ExtArgs>>): Prisma__AITeamClient<$Result.GetResult<Prisma.$AITeamPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AITeam that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AITeamFindUniqueOrThrowArgs} args - Arguments to find a AITeam
     * @example
     * // Get one AITeam
     * const aITeam = await prisma.aITeam.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AITeamFindUniqueOrThrowArgs>(args: SelectSubset<T, AITeamFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AITeamClient<$Result.GetResult<Prisma.$AITeamPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AITeam that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AITeamFindFirstArgs} args - Arguments to find a AITeam
     * @example
     * // Get one AITeam
     * const aITeam = await prisma.aITeam.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AITeamFindFirstArgs>(args?: SelectSubset<T, AITeamFindFirstArgs<ExtArgs>>): Prisma__AITeamClient<$Result.GetResult<Prisma.$AITeamPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AITeam that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AITeamFindFirstOrThrowArgs} args - Arguments to find a AITeam
     * @example
     * // Get one AITeam
     * const aITeam = await prisma.aITeam.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AITeamFindFirstOrThrowArgs>(args?: SelectSubset<T, AITeamFindFirstOrThrowArgs<ExtArgs>>): Prisma__AITeamClient<$Result.GetResult<Prisma.$AITeamPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AITeams that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AITeamFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AITeams
     * const aITeams = await prisma.aITeam.findMany()
     * 
     * // Get first 10 AITeams
     * const aITeams = await prisma.aITeam.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aITeamWithIdOnly = await prisma.aITeam.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AITeamFindManyArgs>(args?: SelectSubset<T, AITeamFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AITeamPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AITeam.
     * @param {AITeamCreateArgs} args - Arguments to create a AITeam.
     * @example
     * // Create one AITeam
     * const AITeam = await prisma.aITeam.create({
     *   data: {
     *     // ... data to create a AITeam
     *   }
     * })
     * 
     */
    create<T extends AITeamCreateArgs>(args: SelectSubset<T, AITeamCreateArgs<ExtArgs>>): Prisma__AITeamClient<$Result.GetResult<Prisma.$AITeamPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AITeams.
     * @param {AITeamCreateManyArgs} args - Arguments to create many AITeams.
     * @example
     * // Create many AITeams
     * const aITeam = await prisma.aITeam.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AITeamCreateManyArgs>(args?: SelectSubset<T, AITeamCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AITeams and returns the data saved in the database.
     * @param {AITeamCreateManyAndReturnArgs} args - Arguments to create many AITeams.
     * @example
     * // Create many AITeams
     * const aITeam = await prisma.aITeam.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AITeams and only return the `id`
     * const aITeamWithIdOnly = await prisma.aITeam.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AITeamCreateManyAndReturnArgs>(args?: SelectSubset<T, AITeamCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AITeamPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AITeam.
     * @param {AITeamDeleteArgs} args - Arguments to delete one AITeam.
     * @example
     * // Delete one AITeam
     * const AITeam = await prisma.aITeam.delete({
     *   where: {
     *     // ... filter to delete one AITeam
     *   }
     * })
     * 
     */
    delete<T extends AITeamDeleteArgs>(args: SelectSubset<T, AITeamDeleteArgs<ExtArgs>>): Prisma__AITeamClient<$Result.GetResult<Prisma.$AITeamPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AITeam.
     * @param {AITeamUpdateArgs} args - Arguments to update one AITeam.
     * @example
     * // Update one AITeam
     * const aITeam = await prisma.aITeam.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AITeamUpdateArgs>(args: SelectSubset<T, AITeamUpdateArgs<ExtArgs>>): Prisma__AITeamClient<$Result.GetResult<Prisma.$AITeamPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AITeams.
     * @param {AITeamDeleteManyArgs} args - Arguments to filter AITeams to delete.
     * @example
     * // Delete a few AITeams
     * const { count } = await prisma.aITeam.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AITeamDeleteManyArgs>(args?: SelectSubset<T, AITeamDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AITeams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AITeamUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AITeams
     * const aITeam = await prisma.aITeam.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AITeamUpdateManyArgs>(args: SelectSubset<T, AITeamUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AITeam.
     * @param {AITeamUpsertArgs} args - Arguments to update or create a AITeam.
     * @example
     * // Update or create a AITeam
     * const aITeam = await prisma.aITeam.upsert({
     *   create: {
     *     // ... data to create a AITeam
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AITeam we want to update
     *   }
     * })
     */
    upsert<T extends AITeamUpsertArgs>(args: SelectSubset<T, AITeamUpsertArgs<ExtArgs>>): Prisma__AITeamClient<$Result.GetResult<Prisma.$AITeamPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AITeams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AITeamCountArgs} args - Arguments to filter AITeams to count.
     * @example
     * // Count the number of AITeams
     * const count = await prisma.aITeam.count({
     *   where: {
     *     // ... the filter for the AITeams we want to count
     *   }
     * })
    **/
    count<T extends AITeamCountArgs>(
      args?: Subset<T, AITeamCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AITeamCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AITeam.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AITeamAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AITeamAggregateArgs>(args: Subset<T, AITeamAggregateArgs>): Prisma.PrismaPromise<GetAITeamAggregateType<T>>

    /**
     * Group by AITeam.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AITeamGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AITeamGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AITeamGroupByArgs['orderBy'] }
        : { orderBy?: AITeamGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AITeamGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAITeamGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AITeam model
   */
  readonly fields: AITeamFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AITeam.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AITeamClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    members<T extends AITeam$membersArgs<ExtArgs> = {}>(args?: Subset<T, AITeam$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AITeam model
   */ 
  interface AITeamFieldRefs {
    readonly id: FieldRef<"AITeam", 'String'>
    readonly name: FieldRef<"AITeam", 'String'>
    readonly description: FieldRef<"AITeam", 'String'>
    readonly status: FieldRef<"AITeam", 'TeamStatus'>
    readonly strategy: FieldRef<"AITeam", 'Json'>
    readonly preferences: FieldRef<"AITeam", 'Json'>
    readonly createdAt: FieldRef<"AITeam", 'DateTime'>
    readonly updatedAt: FieldRef<"AITeam", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AITeam findUnique
   */
  export type AITeamFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AITeam
     */
    select?: AITeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AITeamInclude<ExtArgs> | null
    /**
     * Filter, which AITeam to fetch.
     */
    where: AITeamWhereUniqueInput
  }

  /**
   * AITeam findUniqueOrThrow
   */
  export type AITeamFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AITeam
     */
    select?: AITeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AITeamInclude<ExtArgs> | null
    /**
     * Filter, which AITeam to fetch.
     */
    where: AITeamWhereUniqueInput
  }

  /**
   * AITeam findFirst
   */
  export type AITeamFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AITeam
     */
    select?: AITeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AITeamInclude<ExtArgs> | null
    /**
     * Filter, which AITeam to fetch.
     */
    where?: AITeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AITeams to fetch.
     */
    orderBy?: AITeamOrderByWithRelationInput | AITeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AITeams.
     */
    cursor?: AITeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AITeams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AITeams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AITeams.
     */
    distinct?: AITeamScalarFieldEnum | AITeamScalarFieldEnum[]
  }

  /**
   * AITeam findFirstOrThrow
   */
  export type AITeamFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AITeam
     */
    select?: AITeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AITeamInclude<ExtArgs> | null
    /**
     * Filter, which AITeam to fetch.
     */
    where?: AITeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AITeams to fetch.
     */
    orderBy?: AITeamOrderByWithRelationInput | AITeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AITeams.
     */
    cursor?: AITeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AITeams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AITeams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AITeams.
     */
    distinct?: AITeamScalarFieldEnum | AITeamScalarFieldEnum[]
  }

  /**
   * AITeam findMany
   */
  export type AITeamFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AITeam
     */
    select?: AITeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AITeamInclude<ExtArgs> | null
    /**
     * Filter, which AITeams to fetch.
     */
    where?: AITeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AITeams to fetch.
     */
    orderBy?: AITeamOrderByWithRelationInput | AITeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AITeams.
     */
    cursor?: AITeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AITeams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AITeams.
     */
    skip?: number
    distinct?: AITeamScalarFieldEnum | AITeamScalarFieldEnum[]
  }

  /**
   * AITeam create
   */
  export type AITeamCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AITeam
     */
    select?: AITeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AITeamInclude<ExtArgs> | null
    /**
     * The data needed to create a AITeam.
     */
    data: XOR<AITeamCreateInput, AITeamUncheckedCreateInput>
  }

  /**
   * AITeam createMany
   */
  export type AITeamCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AITeams.
     */
    data: AITeamCreateManyInput | AITeamCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AITeam createManyAndReturn
   */
  export type AITeamCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AITeam
     */
    select?: AITeamSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AITeams.
     */
    data: AITeamCreateManyInput | AITeamCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AITeam update
   */
  export type AITeamUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AITeam
     */
    select?: AITeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AITeamInclude<ExtArgs> | null
    /**
     * The data needed to update a AITeam.
     */
    data: XOR<AITeamUpdateInput, AITeamUncheckedUpdateInput>
    /**
     * Choose, which AITeam to update.
     */
    where: AITeamWhereUniqueInput
  }

  /**
   * AITeam updateMany
   */
  export type AITeamUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AITeams.
     */
    data: XOR<AITeamUpdateManyMutationInput, AITeamUncheckedUpdateManyInput>
    /**
     * Filter which AITeams to update
     */
    where?: AITeamWhereInput
  }

  /**
   * AITeam upsert
   */
  export type AITeamUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AITeam
     */
    select?: AITeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AITeamInclude<ExtArgs> | null
    /**
     * The filter to search for the AITeam to update in case it exists.
     */
    where: AITeamWhereUniqueInput
    /**
     * In case the AITeam found by the `where` argument doesn't exist, create a new AITeam with this data.
     */
    create: XOR<AITeamCreateInput, AITeamUncheckedCreateInput>
    /**
     * In case the AITeam was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AITeamUpdateInput, AITeamUncheckedUpdateInput>
  }

  /**
   * AITeam delete
   */
  export type AITeamDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AITeam
     */
    select?: AITeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AITeamInclude<ExtArgs> | null
    /**
     * Filter which AITeam to delete.
     */
    where: AITeamWhereUniqueInput
  }

  /**
   * AITeam deleteMany
   */
  export type AITeamDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AITeams to delete
     */
    where?: AITeamWhereInput
  }

  /**
   * AITeam.members
   */
  export type AITeam$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    where?: TeamMemberWhereInput
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    cursor?: TeamMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TeamMemberScalarFieldEnum | TeamMemberScalarFieldEnum[]
  }

  /**
   * AITeam without action
   */
  export type AITeamDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AITeam
     */
    select?: AITeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AITeamInclude<ExtArgs> | null
  }


  /**
   * Model TeamMember
   */

  export type AggregateTeamMember = {
    _count: TeamMemberCountAggregateOutputType | null
    _min: TeamMemberMinAggregateOutputType | null
    _max: TeamMemberMaxAggregateOutputType | null
  }

  export type TeamMemberMinAggregateOutputType = {
    id: string | null
    role: $Enums.MemberRole | null
    aiProvider: $Enums.AIProvider | null
    model: string | null
    teamId: string | null
    userId: string | null
  }

  export type TeamMemberMaxAggregateOutputType = {
    id: string | null
    role: $Enums.MemberRole | null
    aiProvider: $Enums.AIProvider | null
    model: string | null
    teamId: string | null
    userId: string | null
  }

  export type TeamMemberCountAggregateOutputType = {
    id: number
    role: number
    aiProvider: number
    model: number
    specialties: number
    performance: number
    teamId: number
    userId: number
    _all: number
  }


  export type TeamMemberMinAggregateInputType = {
    id?: true
    role?: true
    aiProvider?: true
    model?: true
    teamId?: true
    userId?: true
  }

  export type TeamMemberMaxAggregateInputType = {
    id?: true
    role?: true
    aiProvider?: true
    model?: true
    teamId?: true
    userId?: true
  }

  export type TeamMemberCountAggregateInputType = {
    id?: true
    role?: true
    aiProvider?: true
    model?: true
    specialties?: true
    performance?: true
    teamId?: true
    userId?: true
    _all?: true
  }

  export type TeamMemberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TeamMember to aggregate.
     */
    where?: TeamMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamMembers to fetch.
     */
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TeamMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TeamMembers
    **/
    _count?: true | TeamMemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TeamMemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TeamMemberMaxAggregateInputType
  }

  export type GetTeamMemberAggregateType<T extends TeamMemberAggregateArgs> = {
        [P in keyof T & keyof AggregateTeamMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTeamMember[P]>
      : GetScalarType<T[P], AggregateTeamMember[P]>
  }




  export type TeamMemberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamMemberWhereInput
    orderBy?: TeamMemberOrderByWithAggregationInput | TeamMemberOrderByWithAggregationInput[]
    by: TeamMemberScalarFieldEnum[] | TeamMemberScalarFieldEnum
    having?: TeamMemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TeamMemberCountAggregateInputType | true
    _min?: TeamMemberMinAggregateInputType
    _max?: TeamMemberMaxAggregateInputType
  }

  export type TeamMemberGroupByOutputType = {
    id: string
    role: $Enums.MemberRole
    aiProvider: $Enums.AIProvider
    model: string
    specialties: JsonValue | null
    performance: JsonValue | null
    teamId: string
    userId: string | null
    _count: TeamMemberCountAggregateOutputType | null
    _min: TeamMemberMinAggregateOutputType | null
    _max: TeamMemberMaxAggregateOutputType | null
  }

  type GetTeamMemberGroupByPayload<T extends TeamMemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TeamMemberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TeamMemberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TeamMemberGroupByOutputType[P]>
            : GetScalarType<T[P], TeamMemberGroupByOutputType[P]>
        }
      >
    >


  export type TeamMemberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    aiProvider?: boolean
    model?: boolean
    specialties?: boolean
    performance?: boolean
    teamId?: boolean
    userId?: boolean
    team?: boolean | AITeamDefaultArgs<ExtArgs>
    user?: boolean | TeamMember$userArgs<ExtArgs>
  }, ExtArgs["result"]["teamMember"]>

  export type TeamMemberSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    aiProvider?: boolean
    model?: boolean
    specialties?: boolean
    performance?: boolean
    teamId?: boolean
    userId?: boolean
    team?: boolean | AITeamDefaultArgs<ExtArgs>
    user?: boolean | TeamMember$userArgs<ExtArgs>
  }, ExtArgs["result"]["teamMember"]>

  export type TeamMemberSelectScalar = {
    id?: boolean
    role?: boolean
    aiProvider?: boolean
    model?: boolean
    specialties?: boolean
    performance?: boolean
    teamId?: boolean
    userId?: boolean
  }

  export type TeamMemberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | AITeamDefaultArgs<ExtArgs>
    user?: boolean | TeamMember$userArgs<ExtArgs>
  }
  export type TeamMemberIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | AITeamDefaultArgs<ExtArgs>
    user?: boolean | TeamMember$userArgs<ExtArgs>
  }

  export type $TeamMemberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TeamMember"
    objects: {
      team: Prisma.$AITeamPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      role: $Enums.MemberRole
      aiProvider: $Enums.AIProvider
      model: string
      specialties: Prisma.JsonValue | null
      performance: Prisma.JsonValue | null
      teamId: string
      userId: string | null
    }, ExtArgs["result"]["teamMember"]>
    composites: {}
  }

  type TeamMemberGetPayload<S extends boolean | null | undefined | TeamMemberDefaultArgs> = $Result.GetResult<Prisma.$TeamMemberPayload, S>

  type TeamMemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TeamMemberFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TeamMemberCountAggregateInputType | true
    }

  export interface TeamMemberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TeamMember'], meta: { name: 'TeamMember' } }
    /**
     * Find zero or one TeamMember that matches the filter.
     * @param {TeamMemberFindUniqueArgs} args - Arguments to find a TeamMember
     * @example
     * // Get one TeamMember
     * const teamMember = await prisma.teamMember.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeamMemberFindUniqueArgs>(args: SelectSubset<T, TeamMemberFindUniqueArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TeamMember that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TeamMemberFindUniqueOrThrowArgs} args - Arguments to find a TeamMember
     * @example
     * // Get one TeamMember
     * const teamMember = await prisma.teamMember.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeamMemberFindUniqueOrThrowArgs>(args: SelectSubset<T, TeamMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TeamMember that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberFindFirstArgs} args - Arguments to find a TeamMember
     * @example
     * // Get one TeamMember
     * const teamMember = await prisma.teamMember.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeamMemberFindFirstArgs>(args?: SelectSubset<T, TeamMemberFindFirstArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TeamMember that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberFindFirstOrThrowArgs} args - Arguments to find a TeamMember
     * @example
     * // Get one TeamMember
     * const teamMember = await prisma.teamMember.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeamMemberFindFirstOrThrowArgs>(args?: SelectSubset<T, TeamMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TeamMembers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TeamMembers
     * const teamMembers = await prisma.teamMember.findMany()
     * 
     * // Get first 10 TeamMembers
     * const teamMembers = await prisma.teamMember.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const teamMemberWithIdOnly = await prisma.teamMember.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TeamMemberFindManyArgs>(args?: SelectSubset<T, TeamMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TeamMember.
     * @param {TeamMemberCreateArgs} args - Arguments to create a TeamMember.
     * @example
     * // Create one TeamMember
     * const TeamMember = await prisma.teamMember.create({
     *   data: {
     *     // ... data to create a TeamMember
     *   }
     * })
     * 
     */
    create<T extends TeamMemberCreateArgs>(args: SelectSubset<T, TeamMemberCreateArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TeamMembers.
     * @param {TeamMemberCreateManyArgs} args - Arguments to create many TeamMembers.
     * @example
     * // Create many TeamMembers
     * const teamMember = await prisma.teamMember.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TeamMemberCreateManyArgs>(args?: SelectSubset<T, TeamMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TeamMembers and returns the data saved in the database.
     * @param {TeamMemberCreateManyAndReturnArgs} args - Arguments to create many TeamMembers.
     * @example
     * // Create many TeamMembers
     * const teamMember = await prisma.teamMember.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TeamMembers and only return the `id`
     * const teamMemberWithIdOnly = await prisma.teamMember.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TeamMemberCreateManyAndReturnArgs>(args?: SelectSubset<T, TeamMemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TeamMember.
     * @param {TeamMemberDeleteArgs} args - Arguments to delete one TeamMember.
     * @example
     * // Delete one TeamMember
     * const TeamMember = await prisma.teamMember.delete({
     *   where: {
     *     // ... filter to delete one TeamMember
     *   }
     * })
     * 
     */
    delete<T extends TeamMemberDeleteArgs>(args: SelectSubset<T, TeamMemberDeleteArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TeamMember.
     * @param {TeamMemberUpdateArgs} args - Arguments to update one TeamMember.
     * @example
     * // Update one TeamMember
     * const teamMember = await prisma.teamMember.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TeamMemberUpdateArgs>(args: SelectSubset<T, TeamMemberUpdateArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TeamMembers.
     * @param {TeamMemberDeleteManyArgs} args - Arguments to filter TeamMembers to delete.
     * @example
     * // Delete a few TeamMembers
     * const { count } = await prisma.teamMember.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TeamMemberDeleteManyArgs>(args?: SelectSubset<T, TeamMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TeamMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TeamMembers
     * const teamMember = await prisma.teamMember.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TeamMemberUpdateManyArgs>(args: SelectSubset<T, TeamMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TeamMember.
     * @param {TeamMemberUpsertArgs} args - Arguments to update or create a TeamMember.
     * @example
     * // Update or create a TeamMember
     * const teamMember = await prisma.teamMember.upsert({
     *   create: {
     *     // ... data to create a TeamMember
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TeamMember we want to update
     *   }
     * })
     */
    upsert<T extends TeamMemberUpsertArgs>(args: SelectSubset<T, TeamMemberUpsertArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TeamMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberCountArgs} args - Arguments to filter TeamMembers to count.
     * @example
     * // Count the number of TeamMembers
     * const count = await prisma.teamMember.count({
     *   where: {
     *     // ... the filter for the TeamMembers we want to count
     *   }
     * })
    **/
    count<T extends TeamMemberCountArgs>(
      args?: Subset<T, TeamMemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TeamMemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TeamMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TeamMemberAggregateArgs>(args: Subset<T, TeamMemberAggregateArgs>): Prisma.PrismaPromise<GetTeamMemberAggregateType<T>>

    /**
     * Group by TeamMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TeamMemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TeamMemberGroupByArgs['orderBy'] }
        : { orderBy?: TeamMemberGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TeamMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TeamMember model
   */
  readonly fields: TeamMemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TeamMember.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TeamMemberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    team<T extends AITeamDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AITeamDefaultArgs<ExtArgs>>): Prisma__AITeamClient<$Result.GetResult<Prisma.$AITeamPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    user<T extends TeamMember$userArgs<ExtArgs> = {}>(args?: Subset<T, TeamMember$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TeamMember model
   */ 
  interface TeamMemberFieldRefs {
    readonly id: FieldRef<"TeamMember", 'String'>
    readonly role: FieldRef<"TeamMember", 'MemberRole'>
    readonly aiProvider: FieldRef<"TeamMember", 'AIProvider'>
    readonly model: FieldRef<"TeamMember", 'String'>
    readonly specialties: FieldRef<"TeamMember", 'Json'>
    readonly performance: FieldRef<"TeamMember", 'Json'>
    readonly teamId: FieldRef<"TeamMember", 'String'>
    readonly userId: FieldRef<"TeamMember", 'String'>
  }
    

  // Custom InputTypes
  /**
   * TeamMember findUnique
   */
  export type TeamMemberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter, which TeamMember to fetch.
     */
    where: TeamMemberWhereUniqueInput
  }

  /**
   * TeamMember findUniqueOrThrow
   */
  export type TeamMemberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter, which TeamMember to fetch.
     */
    where: TeamMemberWhereUniqueInput
  }

  /**
   * TeamMember findFirst
   */
  export type TeamMemberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter, which TeamMember to fetch.
     */
    where?: TeamMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamMembers to fetch.
     */
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TeamMembers.
     */
    cursor?: TeamMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TeamMembers.
     */
    distinct?: TeamMemberScalarFieldEnum | TeamMemberScalarFieldEnum[]
  }

  /**
   * TeamMember findFirstOrThrow
   */
  export type TeamMemberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter, which TeamMember to fetch.
     */
    where?: TeamMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamMembers to fetch.
     */
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TeamMembers.
     */
    cursor?: TeamMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TeamMembers.
     */
    distinct?: TeamMemberScalarFieldEnum | TeamMemberScalarFieldEnum[]
  }

  /**
   * TeamMember findMany
   */
  export type TeamMemberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter, which TeamMembers to fetch.
     */
    where?: TeamMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamMembers to fetch.
     */
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TeamMembers.
     */
    cursor?: TeamMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamMembers.
     */
    skip?: number
    distinct?: TeamMemberScalarFieldEnum | TeamMemberScalarFieldEnum[]
  }

  /**
   * TeamMember create
   */
  export type TeamMemberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * The data needed to create a TeamMember.
     */
    data: XOR<TeamMemberCreateInput, TeamMemberUncheckedCreateInput>
  }

  /**
   * TeamMember createMany
   */
  export type TeamMemberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TeamMembers.
     */
    data: TeamMemberCreateManyInput | TeamMemberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TeamMember createManyAndReturn
   */
  export type TeamMemberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TeamMembers.
     */
    data: TeamMemberCreateManyInput | TeamMemberCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TeamMember update
   */
  export type TeamMemberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * The data needed to update a TeamMember.
     */
    data: XOR<TeamMemberUpdateInput, TeamMemberUncheckedUpdateInput>
    /**
     * Choose, which TeamMember to update.
     */
    where: TeamMemberWhereUniqueInput
  }

  /**
   * TeamMember updateMany
   */
  export type TeamMemberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TeamMembers.
     */
    data: XOR<TeamMemberUpdateManyMutationInput, TeamMemberUncheckedUpdateManyInput>
    /**
     * Filter which TeamMembers to update
     */
    where?: TeamMemberWhereInput
  }

  /**
   * TeamMember upsert
   */
  export type TeamMemberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * The filter to search for the TeamMember to update in case it exists.
     */
    where: TeamMemberWhereUniqueInput
    /**
     * In case the TeamMember found by the `where` argument doesn't exist, create a new TeamMember with this data.
     */
    create: XOR<TeamMemberCreateInput, TeamMemberUncheckedCreateInput>
    /**
     * In case the TeamMember was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TeamMemberUpdateInput, TeamMemberUncheckedUpdateInput>
  }

  /**
   * TeamMember delete
   */
  export type TeamMemberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter which TeamMember to delete.
     */
    where: TeamMemberWhereUniqueInput
  }

  /**
   * TeamMember deleteMany
   */
  export type TeamMemberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TeamMembers to delete
     */
    where?: TeamMemberWhereInput
  }

  /**
   * TeamMember.user
   */
  export type TeamMember$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * TeamMember without action
   */
  export type TeamMemberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
  }


  /**
   * Model Deployment
   */

  export type AggregateDeployment = {
    _count: DeploymentCountAggregateOutputType | null
    _min: DeploymentMinAggregateOutputType | null
    _max: DeploymentMaxAggregateOutputType | null
  }

  export type DeploymentMinAggregateOutputType = {
    id: string | null
    version: string | null
    status: $Enums.DeploymentStatus | null
    environment: string | null
    url: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deployedAt: Date | null
    projectId: string | null
  }

  export type DeploymentMaxAggregateOutputType = {
    id: string | null
    version: string | null
    status: $Enums.DeploymentStatus | null
    environment: string | null
    url: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deployedAt: Date | null
    projectId: string | null
  }

  export type DeploymentCountAggregateOutputType = {
    id: number
    version: number
    status: number
    environment: number
    config: number
    logs: number
    url: number
    createdAt: number
    updatedAt: number
    deployedAt: number
    projectId: number
    _all: number
  }


  export type DeploymentMinAggregateInputType = {
    id?: true
    version?: true
    status?: true
    environment?: true
    url?: true
    createdAt?: true
    updatedAt?: true
    deployedAt?: true
    projectId?: true
  }

  export type DeploymentMaxAggregateInputType = {
    id?: true
    version?: true
    status?: true
    environment?: true
    url?: true
    createdAt?: true
    updatedAt?: true
    deployedAt?: true
    projectId?: true
  }

  export type DeploymentCountAggregateInputType = {
    id?: true
    version?: true
    status?: true
    environment?: true
    config?: true
    logs?: true
    url?: true
    createdAt?: true
    updatedAt?: true
    deployedAt?: true
    projectId?: true
    _all?: true
  }

  export type DeploymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Deployment to aggregate.
     */
    where?: DeploymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Deployments to fetch.
     */
    orderBy?: DeploymentOrderByWithRelationInput | DeploymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeploymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Deployments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Deployments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Deployments
    **/
    _count?: true | DeploymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeploymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeploymentMaxAggregateInputType
  }

  export type GetDeploymentAggregateType<T extends DeploymentAggregateArgs> = {
        [P in keyof T & keyof AggregateDeployment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDeployment[P]>
      : GetScalarType<T[P], AggregateDeployment[P]>
  }




  export type DeploymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeploymentWhereInput
    orderBy?: DeploymentOrderByWithAggregationInput | DeploymentOrderByWithAggregationInput[]
    by: DeploymentScalarFieldEnum[] | DeploymentScalarFieldEnum
    having?: DeploymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeploymentCountAggregateInputType | true
    _min?: DeploymentMinAggregateInputType
    _max?: DeploymentMaxAggregateInputType
  }

  export type DeploymentGroupByOutputType = {
    id: string
    version: string
    status: $Enums.DeploymentStatus
    environment: string
    config: JsonValue | null
    logs: JsonValue | null
    url: string | null
    createdAt: Date
    updatedAt: Date
    deployedAt: Date | null
    projectId: string
    _count: DeploymentCountAggregateOutputType | null
    _min: DeploymentMinAggregateOutputType | null
    _max: DeploymentMaxAggregateOutputType | null
  }

  type GetDeploymentGroupByPayload<T extends DeploymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeploymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeploymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeploymentGroupByOutputType[P]>
            : GetScalarType<T[P], DeploymentGroupByOutputType[P]>
        }
      >
    >


  export type DeploymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    version?: boolean
    status?: boolean
    environment?: boolean
    config?: boolean
    logs?: boolean
    url?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deployedAt?: boolean
    projectId?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deployment"]>

  export type DeploymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    version?: boolean
    status?: boolean
    environment?: boolean
    config?: boolean
    logs?: boolean
    url?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deployedAt?: boolean
    projectId?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deployment"]>

  export type DeploymentSelectScalar = {
    id?: boolean
    version?: boolean
    status?: boolean
    environment?: boolean
    config?: boolean
    logs?: boolean
    url?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deployedAt?: boolean
    projectId?: boolean
  }

  export type DeploymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type DeploymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $DeploymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Deployment"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      version: string
      status: $Enums.DeploymentStatus
      environment: string
      config: Prisma.JsonValue | null
      logs: Prisma.JsonValue | null
      url: string | null
      createdAt: Date
      updatedAt: Date
      deployedAt: Date | null
      projectId: string
    }, ExtArgs["result"]["deployment"]>
    composites: {}
  }

  type DeploymentGetPayload<S extends boolean | null | undefined | DeploymentDefaultArgs> = $Result.GetResult<Prisma.$DeploymentPayload, S>

  type DeploymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DeploymentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DeploymentCountAggregateInputType | true
    }

  export interface DeploymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Deployment'], meta: { name: 'Deployment' } }
    /**
     * Find zero or one Deployment that matches the filter.
     * @param {DeploymentFindUniqueArgs} args - Arguments to find a Deployment
     * @example
     * // Get one Deployment
     * const deployment = await prisma.deployment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DeploymentFindUniqueArgs>(args: SelectSubset<T, DeploymentFindUniqueArgs<ExtArgs>>): Prisma__DeploymentClient<$Result.GetResult<Prisma.$DeploymentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Deployment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DeploymentFindUniqueOrThrowArgs} args - Arguments to find a Deployment
     * @example
     * // Get one Deployment
     * const deployment = await prisma.deployment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DeploymentFindUniqueOrThrowArgs>(args: SelectSubset<T, DeploymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DeploymentClient<$Result.GetResult<Prisma.$DeploymentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Deployment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeploymentFindFirstArgs} args - Arguments to find a Deployment
     * @example
     * // Get one Deployment
     * const deployment = await prisma.deployment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DeploymentFindFirstArgs>(args?: SelectSubset<T, DeploymentFindFirstArgs<ExtArgs>>): Prisma__DeploymentClient<$Result.GetResult<Prisma.$DeploymentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Deployment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeploymentFindFirstOrThrowArgs} args - Arguments to find a Deployment
     * @example
     * // Get one Deployment
     * const deployment = await prisma.deployment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DeploymentFindFirstOrThrowArgs>(args?: SelectSubset<T, DeploymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DeploymentClient<$Result.GetResult<Prisma.$DeploymentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Deployments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeploymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Deployments
     * const deployments = await prisma.deployment.findMany()
     * 
     * // Get first 10 Deployments
     * const deployments = await prisma.deployment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const deploymentWithIdOnly = await prisma.deployment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DeploymentFindManyArgs>(args?: SelectSubset<T, DeploymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeploymentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Deployment.
     * @param {DeploymentCreateArgs} args - Arguments to create a Deployment.
     * @example
     * // Create one Deployment
     * const Deployment = await prisma.deployment.create({
     *   data: {
     *     // ... data to create a Deployment
     *   }
     * })
     * 
     */
    create<T extends DeploymentCreateArgs>(args: SelectSubset<T, DeploymentCreateArgs<ExtArgs>>): Prisma__DeploymentClient<$Result.GetResult<Prisma.$DeploymentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Deployments.
     * @param {DeploymentCreateManyArgs} args - Arguments to create many Deployments.
     * @example
     * // Create many Deployments
     * const deployment = await prisma.deployment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DeploymentCreateManyArgs>(args?: SelectSubset<T, DeploymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Deployments and returns the data saved in the database.
     * @param {DeploymentCreateManyAndReturnArgs} args - Arguments to create many Deployments.
     * @example
     * // Create many Deployments
     * const deployment = await prisma.deployment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Deployments and only return the `id`
     * const deploymentWithIdOnly = await prisma.deployment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DeploymentCreateManyAndReturnArgs>(args?: SelectSubset<T, DeploymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeploymentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Deployment.
     * @param {DeploymentDeleteArgs} args - Arguments to delete one Deployment.
     * @example
     * // Delete one Deployment
     * const Deployment = await prisma.deployment.delete({
     *   where: {
     *     // ... filter to delete one Deployment
     *   }
     * })
     * 
     */
    delete<T extends DeploymentDeleteArgs>(args: SelectSubset<T, DeploymentDeleteArgs<ExtArgs>>): Prisma__DeploymentClient<$Result.GetResult<Prisma.$DeploymentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Deployment.
     * @param {DeploymentUpdateArgs} args - Arguments to update one Deployment.
     * @example
     * // Update one Deployment
     * const deployment = await prisma.deployment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DeploymentUpdateArgs>(args: SelectSubset<T, DeploymentUpdateArgs<ExtArgs>>): Prisma__DeploymentClient<$Result.GetResult<Prisma.$DeploymentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Deployments.
     * @param {DeploymentDeleteManyArgs} args - Arguments to filter Deployments to delete.
     * @example
     * // Delete a few Deployments
     * const { count } = await prisma.deployment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DeploymentDeleteManyArgs>(args?: SelectSubset<T, DeploymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Deployments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeploymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Deployments
     * const deployment = await prisma.deployment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DeploymentUpdateManyArgs>(args: SelectSubset<T, DeploymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Deployment.
     * @param {DeploymentUpsertArgs} args - Arguments to update or create a Deployment.
     * @example
     * // Update or create a Deployment
     * const deployment = await prisma.deployment.upsert({
     *   create: {
     *     // ... data to create a Deployment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Deployment we want to update
     *   }
     * })
     */
    upsert<T extends DeploymentUpsertArgs>(args: SelectSubset<T, DeploymentUpsertArgs<ExtArgs>>): Prisma__DeploymentClient<$Result.GetResult<Prisma.$DeploymentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Deployments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeploymentCountArgs} args - Arguments to filter Deployments to count.
     * @example
     * // Count the number of Deployments
     * const count = await prisma.deployment.count({
     *   where: {
     *     // ... the filter for the Deployments we want to count
     *   }
     * })
    **/
    count<T extends DeploymentCountArgs>(
      args?: Subset<T, DeploymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeploymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Deployment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeploymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DeploymentAggregateArgs>(args: Subset<T, DeploymentAggregateArgs>): Prisma.PrismaPromise<GetDeploymentAggregateType<T>>

    /**
     * Group by Deployment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeploymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DeploymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeploymentGroupByArgs['orderBy'] }
        : { orderBy?: DeploymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DeploymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeploymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Deployment model
   */
  readonly fields: DeploymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Deployment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeploymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Deployment model
   */ 
  interface DeploymentFieldRefs {
    readonly id: FieldRef<"Deployment", 'String'>
    readonly version: FieldRef<"Deployment", 'String'>
    readonly status: FieldRef<"Deployment", 'DeploymentStatus'>
    readonly environment: FieldRef<"Deployment", 'String'>
    readonly config: FieldRef<"Deployment", 'Json'>
    readonly logs: FieldRef<"Deployment", 'Json'>
    readonly url: FieldRef<"Deployment", 'String'>
    readonly createdAt: FieldRef<"Deployment", 'DateTime'>
    readonly updatedAt: FieldRef<"Deployment", 'DateTime'>
    readonly deployedAt: FieldRef<"Deployment", 'DateTime'>
    readonly projectId: FieldRef<"Deployment", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Deployment findUnique
   */
  export type DeploymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deployment
     */
    select?: DeploymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeploymentInclude<ExtArgs> | null
    /**
     * Filter, which Deployment to fetch.
     */
    where: DeploymentWhereUniqueInput
  }

  /**
   * Deployment findUniqueOrThrow
   */
  export type DeploymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deployment
     */
    select?: DeploymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeploymentInclude<ExtArgs> | null
    /**
     * Filter, which Deployment to fetch.
     */
    where: DeploymentWhereUniqueInput
  }

  /**
   * Deployment findFirst
   */
  export type DeploymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deployment
     */
    select?: DeploymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeploymentInclude<ExtArgs> | null
    /**
     * Filter, which Deployment to fetch.
     */
    where?: DeploymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Deployments to fetch.
     */
    orderBy?: DeploymentOrderByWithRelationInput | DeploymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Deployments.
     */
    cursor?: DeploymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Deployments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Deployments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Deployments.
     */
    distinct?: DeploymentScalarFieldEnum | DeploymentScalarFieldEnum[]
  }

  /**
   * Deployment findFirstOrThrow
   */
  export type DeploymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deployment
     */
    select?: DeploymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeploymentInclude<ExtArgs> | null
    /**
     * Filter, which Deployment to fetch.
     */
    where?: DeploymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Deployments to fetch.
     */
    orderBy?: DeploymentOrderByWithRelationInput | DeploymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Deployments.
     */
    cursor?: DeploymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Deployments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Deployments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Deployments.
     */
    distinct?: DeploymentScalarFieldEnum | DeploymentScalarFieldEnum[]
  }

  /**
   * Deployment findMany
   */
  export type DeploymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deployment
     */
    select?: DeploymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeploymentInclude<ExtArgs> | null
    /**
     * Filter, which Deployments to fetch.
     */
    where?: DeploymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Deployments to fetch.
     */
    orderBy?: DeploymentOrderByWithRelationInput | DeploymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Deployments.
     */
    cursor?: DeploymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Deployments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Deployments.
     */
    skip?: number
    distinct?: DeploymentScalarFieldEnum | DeploymentScalarFieldEnum[]
  }

  /**
   * Deployment create
   */
  export type DeploymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deployment
     */
    select?: DeploymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeploymentInclude<ExtArgs> | null
    /**
     * The data needed to create a Deployment.
     */
    data: XOR<DeploymentCreateInput, DeploymentUncheckedCreateInput>
  }

  /**
   * Deployment createMany
   */
  export type DeploymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Deployments.
     */
    data: DeploymentCreateManyInput | DeploymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Deployment createManyAndReturn
   */
  export type DeploymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deployment
     */
    select?: DeploymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Deployments.
     */
    data: DeploymentCreateManyInput | DeploymentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeploymentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Deployment update
   */
  export type DeploymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deployment
     */
    select?: DeploymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeploymentInclude<ExtArgs> | null
    /**
     * The data needed to update a Deployment.
     */
    data: XOR<DeploymentUpdateInput, DeploymentUncheckedUpdateInput>
    /**
     * Choose, which Deployment to update.
     */
    where: DeploymentWhereUniqueInput
  }

  /**
   * Deployment updateMany
   */
  export type DeploymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Deployments.
     */
    data: XOR<DeploymentUpdateManyMutationInput, DeploymentUncheckedUpdateManyInput>
    /**
     * Filter which Deployments to update
     */
    where?: DeploymentWhereInput
  }

  /**
   * Deployment upsert
   */
  export type DeploymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deployment
     */
    select?: DeploymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeploymentInclude<ExtArgs> | null
    /**
     * The filter to search for the Deployment to update in case it exists.
     */
    where: DeploymentWhereUniqueInput
    /**
     * In case the Deployment found by the `where` argument doesn't exist, create a new Deployment with this data.
     */
    create: XOR<DeploymentCreateInput, DeploymentUncheckedCreateInput>
    /**
     * In case the Deployment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeploymentUpdateInput, DeploymentUncheckedUpdateInput>
  }

  /**
   * Deployment delete
   */
  export type DeploymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deployment
     */
    select?: DeploymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeploymentInclude<ExtArgs> | null
    /**
     * Filter which Deployment to delete.
     */
    where: DeploymentWhereUniqueInput
  }

  /**
   * Deployment deleteMany
   */
  export type DeploymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Deployments to delete
     */
    where?: DeploymentWhereInput
  }

  /**
   * Deployment without action
   */
  export type DeploymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Deployment
     */
    select?: DeploymentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeploymentInclude<ExtArgs> | null
  }


  /**
   * Model ProjectFile
   */

  export type AggregateProjectFile = {
    _count: ProjectFileCountAggregateOutputType | null
    _avg: ProjectFileAvgAggregateOutputType | null
    _sum: ProjectFileSumAggregateOutputType | null
    _min: ProjectFileMinAggregateOutputType | null
    _max: ProjectFileMaxAggregateOutputType | null
  }

  export type ProjectFileAvgAggregateOutputType = {
    size: number | null
  }

  export type ProjectFileSumAggregateOutputType = {
    size: number | null
  }

  export type ProjectFileMinAggregateOutputType = {
    id: string | null
    path: string | null
    name: string | null
    type: string | null
    size: number | null
    checksum: string | null
    language: string | null
    framework: string | null
    purpose: string | null
    createdAt: Date | null
    updatedAt: Date | null
    projectId: string | null
  }

  export type ProjectFileMaxAggregateOutputType = {
    id: string | null
    path: string | null
    name: string | null
    type: string | null
    size: number | null
    checksum: string | null
    language: string | null
    framework: string | null
    purpose: string | null
    createdAt: Date | null
    updatedAt: Date | null
    projectId: string | null
  }

  export type ProjectFileCountAggregateOutputType = {
    id: number
    path: number
    name: number
    type: number
    size: number
    checksum: number
    language: number
    framework: number
    purpose: number
    createdAt: number
    updatedAt: number
    projectId: number
    _all: number
  }


  export type ProjectFileAvgAggregateInputType = {
    size?: true
  }

  export type ProjectFileSumAggregateInputType = {
    size?: true
  }

  export type ProjectFileMinAggregateInputType = {
    id?: true
    path?: true
    name?: true
    type?: true
    size?: true
    checksum?: true
    language?: true
    framework?: true
    purpose?: true
    createdAt?: true
    updatedAt?: true
    projectId?: true
  }

  export type ProjectFileMaxAggregateInputType = {
    id?: true
    path?: true
    name?: true
    type?: true
    size?: true
    checksum?: true
    language?: true
    framework?: true
    purpose?: true
    createdAt?: true
    updatedAt?: true
    projectId?: true
  }

  export type ProjectFileCountAggregateInputType = {
    id?: true
    path?: true
    name?: true
    type?: true
    size?: true
    checksum?: true
    language?: true
    framework?: true
    purpose?: true
    createdAt?: true
    updatedAt?: true
    projectId?: true
    _all?: true
  }

  export type ProjectFileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectFile to aggregate.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProjectFiles
    **/
    _count?: true | ProjectFileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProjectFileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProjectFileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectFileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectFileMaxAggregateInputType
  }

  export type GetProjectFileAggregateType<T extends ProjectFileAggregateArgs> = {
        [P in keyof T & keyof AggregateProjectFile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectFile[P]>
      : GetScalarType<T[P], AggregateProjectFile[P]>
  }




  export type ProjectFileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectFileWhereInput
    orderBy?: ProjectFileOrderByWithAggregationInput | ProjectFileOrderByWithAggregationInput[]
    by: ProjectFileScalarFieldEnum[] | ProjectFileScalarFieldEnum
    having?: ProjectFileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectFileCountAggregateInputType | true
    _avg?: ProjectFileAvgAggregateInputType
    _sum?: ProjectFileSumAggregateInputType
    _min?: ProjectFileMinAggregateInputType
    _max?: ProjectFileMaxAggregateInputType
  }

  export type ProjectFileGroupByOutputType = {
    id: string
    path: string
    name: string
    type: string | null
    size: number | null
    checksum: string | null
    language: string | null
    framework: string | null
    purpose: string | null
    createdAt: Date
    updatedAt: Date
    projectId: string
    _count: ProjectFileCountAggregateOutputType | null
    _avg: ProjectFileAvgAggregateOutputType | null
    _sum: ProjectFileSumAggregateOutputType | null
    _min: ProjectFileMinAggregateOutputType | null
    _max: ProjectFileMaxAggregateOutputType | null
  }

  type GetProjectFileGroupByPayload<T extends ProjectFileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectFileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectFileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectFileGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectFileGroupByOutputType[P]>
        }
      >
    >


  export type ProjectFileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    path?: boolean
    name?: boolean
    type?: boolean
    size?: boolean
    checksum?: boolean
    language?: boolean
    framework?: boolean
    purpose?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    projectId?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectFile"]>

  export type ProjectFileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    path?: boolean
    name?: boolean
    type?: boolean
    size?: boolean
    checksum?: boolean
    language?: boolean
    framework?: boolean
    purpose?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    projectId?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectFile"]>

  export type ProjectFileSelectScalar = {
    id?: boolean
    path?: boolean
    name?: boolean
    type?: boolean
    size?: boolean
    checksum?: boolean
    language?: boolean
    framework?: boolean
    purpose?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    projectId?: boolean
  }

  export type ProjectFileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type ProjectFileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $ProjectFilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProjectFile"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      path: string
      name: string
      type: string | null
      size: number | null
      checksum: string | null
      language: string | null
      framework: string | null
      purpose: string | null
      createdAt: Date
      updatedAt: Date
      projectId: string
    }, ExtArgs["result"]["projectFile"]>
    composites: {}
  }

  type ProjectFileGetPayload<S extends boolean | null | undefined | ProjectFileDefaultArgs> = $Result.GetResult<Prisma.$ProjectFilePayload, S>

  type ProjectFileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProjectFileFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProjectFileCountAggregateInputType | true
    }

  export interface ProjectFileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProjectFile'], meta: { name: 'ProjectFile' } }
    /**
     * Find zero or one ProjectFile that matches the filter.
     * @param {ProjectFileFindUniqueArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFileFindUniqueArgs>(args: SelectSubset<T, ProjectFileFindUniqueArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ProjectFile that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProjectFileFindUniqueOrThrowArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFileFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ProjectFile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileFindFirstArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFileFindFirstArgs>(args?: SelectSubset<T, ProjectFileFindFirstArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ProjectFile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileFindFirstOrThrowArgs} args - Arguments to find a ProjectFile
     * @example
     * // Get one ProjectFile
     * const projectFile = await prisma.projectFile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFileFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFileFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ProjectFiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectFiles
     * const projectFiles = await prisma.projectFile.findMany()
     * 
     * // Get first 10 ProjectFiles
     * const projectFiles = await prisma.projectFile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectFileWithIdOnly = await prisma.projectFile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFileFindManyArgs>(args?: SelectSubset<T, ProjectFileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ProjectFile.
     * @param {ProjectFileCreateArgs} args - Arguments to create a ProjectFile.
     * @example
     * // Create one ProjectFile
     * const ProjectFile = await prisma.projectFile.create({
     *   data: {
     *     // ... data to create a ProjectFile
     *   }
     * })
     * 
     */
    create<T extends ProjectFileCreateArgs>(args: SelectSubset<T, ProjectFileCreateArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ProjectFiles.
     * @param {ProjectFileCreateManyArgs} args - Arguments to create many ProjectFiles.
     * @example
     * // Create many ProjectFiles
     * const projectFile = await prisma.projectFile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectFileCreateManyArgs>(args?: SelectSubset<T, ProjectFileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProjectFiles and returns the data saved in the database.
     * @param {ProjectFileCreateManyAndReturnArgs} args - Arguments to create many ProjectFiles.
     * @example
     * // Create many ProjectFiles
     * const projectFile = await prisma.projectFile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProjectFiles and only return the `id`
     * const projectFileWithIdOnly = await prisma.projectFile.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectFileCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectFileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ProjectFile.
     * @param {ProjectFileDeleteArgs} args - Arguments to delete one ProjectFile.
     * @example
     * // Delete one ProjectFile
     * const ProjectFile = await prisma.projectFile.delete({
     *   where: {
     *     // ... filter to delete one ProjectFile
     *   }
     * })
     * 
     */
    delete<T extends ProjectFileDeleteArgs>(args: SelectSubset<T, ProjectFileDeleteArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ProjectFile.
     * @param {ProjectFileUpdateArgs} args - Arguments to update one ProjectFile.
     * @example
     * // Update one ProjectFile
     * const projectFile = await prisma.projectFile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectFileUpdateArgs>(args: SelectSubset<T, ProjectFileUpdateArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ProjectFiles.
     * @param {ProjectFileDeleteManyArgs} args - Arguments to filter ProjectFiles to delete.
     * @example
     * // Delete a few ProjectFiles
     * const { count } = await prisma.projectFile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectFileDeleteManyArgs>(args?: SelectSubset<T, ProjectFileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectFiles
     * const projectFile = await prisma.projectFile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectFileUpdateManyArgs>(args: SelectSubset<T, ProjectFileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProjectFile.
     * @param {ProjectFileUpsertArgs} args - Arguments to update or create a ProjectFile.
     * @example
     * // Update or create a ProjectFile
     * const projectFile = await prisma.projectFile.upsert({
     *   create: {
     *     // ... data to create a ProjectFile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectFile we want to update
     *   }
     * })
     */
    upsert<T extends ProjectFileUpsertArgs>(args: SelectSubset<T, ProjectFileUpsertArgs<ExtArgs>>): Prisma__ProjectFileClient<$Result.GetResult<Prisma.$ProjectFilePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ProjectFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileCountArgs} args - Arguments to filter ProjectFiles to count.
     * @example
     * // Count the number of ProjectFiles
     * const count = await prisma.projectFile.count({
     *   where: {
     *     // ... the filter for the ProjectFiles we want to count
     *   }
     * })
    **/
    count<T extends ProjectFileCountArgs>(
      args?: Subset<T, ProjectFileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectFileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectFileAggregateArgs>(args: Subset<T, ProjectFileAggregateArgs>): Prisma.PrismaPromise<GetProjectFileAggregateType<T>>

    /**
     * Group by ProjectFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectFileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectFileGroupByArgs['orderBy'] }
        : { orderBy?: ProjectFileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectFileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectFileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProjectFile model
   */
  readonly fields: ProjectFileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectFile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectFileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProjectFile model
   */ 
  interface ProjectFileFieldRefs {
    readonly id: FieldRef<"ProjectFile", 'String'>
    readonly path: FieldRef<"ProjectFile", 'String'>
    readonly name: FieldRef<"ProjectFile", 'String'>
    readonly type: FieldRef<"ProjectFile", 'String'>
    readonly size: FieldRef<"ProjectFile", 'Int'>
    readonly checksum: FieldRef<"ProjectFile", 'String'>
    readonly language: FieldRef<"ProjectFile", 'String'>
    readonly framework: FieldRef<"ProjectFile", 'String'>
    readonly purpose: FieldRef<"ProjectFile", 'String'>
    readonly createdAt: FieldRef<"ProjectFile", 'DateTime'>
    readonly updatedAt: FieldRef<"ProjectFile", 'DateTime'>
    readonly projectId: FieldRef<"ProjectFile", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ProjectFile findUnique
   */
  export type ProjectFileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile findUniqueOrThrow
   */
  export type ProjectFileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile findFirst
   */
  export type ProjectFileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectFiles.
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectFiles.
     */
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * ProjectFile findFirstOrThrow
   */
  export type ProjectFileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFile to fetch.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectFiles.
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectFiles.
     */
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * ProjectFile findMany
   */
  export type ProjectFileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter, which ProjectFiles to fetch.
     */
    where?: ProjectFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectFiles to fetch.
     */
    orderBy?: ProjectFileOrderByWithRelationInput | ProjectFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProjectFiles.
     */
    cursor?: ProjectFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectFiles.
     */
    skip?: number
    distinct?: ProjectFileScalarFieldEnum | ProjectFileScalarFieldEnum[]
  }

  /**
   * ProjectFile create
   */
  export type ProjectFileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectFile.
     */
    data: XOR<ProjectFileCreateInput, ProjectFileUncheckedCreateInput>
  }

  /**
   * ProjectFile createMany
   */
  export type ProjectFileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProjectFiles.
     */
    data: ProjectFileCreateManyInput | ProjectFileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProjectFile createManyAndReturn
   */
  export type ProjectFileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ProjectFiles.
     */
    data: ProjectFileCreateManyInput | ProjectFileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProjectFile update
   */
  export type ProjectFileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectFile.
     */
    data: XOR<ProjectFileUpdateInput, ProjectFileUncheckedUpdateInput>
    /**
     * Choose, which ProjectFile to update.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile updateMany
   */
  export type ProjectFileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProjectFiles.
     */
    data: XOR<ProjectFileUpdateManyMutationInput, ProjectFileUncheckedUpdateManyInput>
    /**
     * Filter which ProjectFiles to update
     */
    where?: ProjectFileWhereInput
  }

  /**
   * ProjectFile upsert
   */
  export type ProjectFileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectFile to update in case it exists.
     */
    where: ProjectFileWhereUniqueInput
    /**
     * In case the ProjectFile found by the `where` argument doesn't exist, create a new ProjectFile with this data.
     */
    create: XOR<ProjectFileCreateInput, ProjectFileUncheckedCreateInput>
    /**
     * In case the ProjectFile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectFileUpdateInput, ProjectFileUncheckedUpdateInput>
  }

  /**
   * ProjectFile delete
   */
  export type ProjectFileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
    /**
     * Filter which ProjectFile to delete.
     */
    where: ProjectFileWhereUniqueInput
  }

  /**
   * ProjectFile deleteMany
   */
  export type ProjectFileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectFiles to delete
     */
    where?: ProjectFileWhereInput
  }

  /**
   * ProjectFile without action
   */
  export type ProjectFileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectFile
     */
    select?: ProjectFileSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectFileInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
    expiresAt: Date | null
    userId: string | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
    expiresAt: Date | null
    userId: string | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    sessionId: number
    data: number
    ipAddress: number
    userAgent: number
    createdAt: number
    expiresAt: number
    userId: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    sessionId?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
    expiresAt?: true
    userId?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    sessionId?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
    expiresAt?: true
    userId?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    sessionId?: true
    data?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
    expiresAt?: true
    userId?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    sessionId: string
    data: JsonValue | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date
    expiresAt: Date
    userId: string
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    data?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    data?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    sessionId?: boolean
    data?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    userId?: boolean
  }

  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      data: Prisma.JsonValue | null
      ipAddress: string | null
      userAgent: string | null
      createdAt: Date
      expiresAt: Date
      userId: string
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */ 
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly sessionId: FieldRef<"Session", 'String'>
    readonly data: FieldRef<"Session", 'Json'>
    readonly ipAddress: FieldRef<"Session", 'String'>
    readonly userAgent: FieldRef<"Session", 'String'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
    readonly expiresAt: FieldRef<"Session", 'DateTime'>
    readonly userId: FieldRef<"Session", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    avatar: 'avatar',
    role: 'role',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ProjectScalarFieldEnum: {
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

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const TaskScalarFieldEnum: {
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

  export type TaskScalarFieldEnum = (typeof TaskScalarFieldEnum)[keyof typeof TaskScalarFieldEnum]


  export const TaskExecutionScalarFieldEnum: {
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

  export type TaskExecutionScalarFieldEnum = (typeof TaskExecutionScalarFieldEnum)[keyof typeof TaskExecutionScalarFieldEnum]


  export const QualityGateScalarFieldEnum: {
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

  export type QualityGateScalarFieldEnum = (typeof QualityGateScalarFieldEnum)[keyof typeof QualityGateScalarFieldEnum]


  export const AITeamScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    status: 'status',
    strategy: 'strategy',
    preferences: 'preferences',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AITeamScalarFieldEnum = (typeof AITeamScalarFieldEnum)[keyof typeof AITeamScalarFieldEnum]


  export const TeamMemberScalarFieldEnum: {
    id: 'id',
    role: 'role',
    aiProvider: 'aiProvider',
    model: 'model',
    specialties: 'specialties',
    performance: 'performance',
    teamId: 'teamId',
    userId: 'userId'
  };

  export type TeamMemberScalarFieldEnum = (typeof TeamMemberScalarFieldEnum)[keyof typeof TeamMemberScalarFieldEnum]


  export const DeploymentScalarFieldEnum: {
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

  export type DeploymentScalarFieldEnum = (typeof DeploymentScalarFieldEnum)[keyof typeof DeploymentScalarFieldEnum]


  export const ProjectFileScalarFieldEnum: {
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

  export type ProjectFileScalarFieldEnum = (typeof ProjectFileScalarFieldEnum)[keyof typeof ProjectFileScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    data: 'data',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt',
    userId: 'userId'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'ProjectStatus'
   */
  export type EnumProjectStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectStatus'>
    


  /**
   * Reference to a field of type 'ProjectStatus[]'
   */
  export type ListEnumProjectStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectStatus[]'>
    


  /**
   * Reference to a field of type 'TaskStatus'
   */
  export type EnumTaskStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskStatus'>
    


  /**
   * Reference to a field of type 'TaskStatus[]'
   */
  export type ListEnumTaskStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskStatus[]'>
    


  /**
   * Reference to a field of type 'Priority'
   */
  export type EnumPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Priority'>
    


  /**
   * Reference to a field of type 'Priority[]'
   */
  export type ListEnumPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Priority[]'>
    


  /**
   * Reference to a field of type 'AIProvider'
   */
  export type EnumAIProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AIProvider'>
    


  /**
   * Reference to a field of type 'AIProvider[]'
   */
  export type ListEnumAIProviderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AIProvider[]'>
    


  /**
   * Reference to a field of type 'TaskType'
   */
  export type EnumTaskTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskType'>
    


  /**
   * Reference to a field of type 'TaskType[]'
   */
  export type ListEnumTaskTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskType[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'ExecutionStatus'
   */
  export type EnumExecutionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExecutionStatus'>
    


  /**
   * Reference to a field of type 'ExecutionStatus[]'
   */
  export type ListEnumExecutionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExecutionStatus[]'>
    


  /**
   * Reference to a field of type 'QualityGateType'
   */
  export type EnumQualityGateTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QualityGateType'>
    


  /**
   * Reference to a field of type 'QualityGateType[]'
   */
  export type ListEnumQualityGateTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QualityGateType[]'>
    


  /**
   * Reference to a field of type 'QualityStatus'
   */
  export type EnumQualityStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QualityStatus'>
    


  /**
   * Reference to a field of type 'QualityStatus[]'
   */
  export type ListEnumQualityStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QualityStatus[]'>
    


  /**
   * Reference to a field of type 'TeamStatus'
   */
  export type EnumTeamStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TeamStatus'>
    


  /**
   * Reference to a field of type 'TeamStatus[]'
   */
  export type ListEnumTeamStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TeamStatus[]'>
    


  /**
   * Reference to a field of type 'MemberRole'
   */
  export type EnumMemberRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MemberRole'>
    


  /**
   * Reference to a field of type 'MemberRole[]'
   */
  export type ListEnumMemberRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MemberRole[]'>
    


  /**
   * Reference to a field of type 'DeploymentStatus'
   */
  export type EnumDeploymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeploymentStatus'>
    


  /**
   * Reference to a field of type 'DeploymentStatus[]'
   */
  export type ListEnumDeploymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DeploymentStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    projects?: ProjectListRelationFilter
    tasks?: TaskListRelationFilter
    sessions?: SessionListRelationFilter
    teamMembers?: TeamMemberListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projects?: ProjectOrderByRelationAggregateInput
    tasks?: TaskOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
    teamMembers?: TeamMemberOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    projects?: ProjectListRelationFilter
    tasks?: TaskListRelationFilter
    sessions?: SessionListRelationFilter
    teamMembers?: TeamMemberListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    repository?: StringNullableFilter<"Project"> | string | null
    framework?: StringNullableFilter<"Project"> | string | null
    language?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    userId?: StringFilter<"Project"> | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    tasks?: TaskListRelationFilter
    deployments?: DeploymentListRelationFilter
    qualityGates?: QualityGateListRelationFilter
    files?: ProjectFileListRelationFilter
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    repository?: SortOrderInput | SortOrder
    framework?: SortOrderInput | SortOrder
    language?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
    tasks?: TaskOrderByRelationAggregateInput
    deployments?: DeploymentOrderByRelationAggregateInput
    qualityGates?: QualityGateOrderByRelationAggregateInput
    files?: ProjectFileOrderByRelationAggregateInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    name?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    repository?: StringNullableFilter<"Project"> | string | null
    framework?: StringNullableFilter<"Project"> | string | null
    language?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    userId?: StringFilter<"Project"> | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    tasks?: TaskListRelationFilter
    deployments?: DeploymentListRelationFilter
    qualityGates?: QualityGateListRelationFilter
    files?: ProjectFileListRelationFilter
  }, "id">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    repository?: SortOrderInput | SortOrder
    framework?: SortOrderInput | SortOrder
    language?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Project"> | string
    name?: StringWithAggregatesFilter<"Project"> | string
    description?: StringNullableWithAggregatesFilter<"Project"> | string | null
    status?: EnumProjectStatusWithAggregatesFilter<"Project"> | $Enums.ProjectStatus
    repository?: StringNullableWithAggregatesFilter<"Project"> | string | null
    framework?: StringNullableWithAggregatesFilter<"Project"> | string | null
    language?: StringNullableWithAggregatesFilter<"Project"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    userId?: StringWithAggregatesFilter<"Project"> | string
  }

  export type TaskWhereInput = {
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    id?: StringFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    description?: StringNullableFilter<"Task"> | string | null
    status?: EnumTaskStatusFilter<"Task"> | $Enums.TaskStatus
    priority?: EnumPriorityFilter<"Task"> | $Enums.Priority
    aiProvider?: EnumAIProviderFilter<"Task"> | $Enums.AIProvider
    model?: StringNullableFilter<"Task"> | string | null
    type?: EnumTaskTypeFilter<"Task"> | $Enums.TaskType
    context?: JsonNullableFilter<"Task">
    requirements?: JsonNullableFilter<"Task">
    constraints?: JsonNullableFilter<"Task">
    result?: JsonNullableFilter<"Task">
    diff?: StringNullableFilter<"Task"> | string | null
    artifacts?: JsonNullableFilter<"Task">
    tokenUsage?: IntNullableFilter<"Task"> | number | null
    cost?: FloatNullableFilter<"Task"> | number | null
    duration?: IntNullableFilter<"Task"> | number | null
    quality?: FloatNullableFilter<"Task"> | number | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeFilter<"Task"> | Date | string
    completedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    projectId?: StringFilter<"Task"> | string
    userId?: StringFilter<"Task"> | string
    project?: XOR<ProjectRelationFilter, ProjectWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
    qualityGates?: QualityGateListRelationFilter
    executions?: TaskExecutionListRelationFilter
  }

  export type TaskOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    priority?: SortOrder
    aiProvider?: SortOrder
    model?: SortOrderInput | SortOrder
    type?: SortOrder
    context?: SortOrderInput | SortOrder
    requirements?: SortOrderInput | SortOrder
    constraints?: SortOrderInput | SortOrder
    result?: SortOrderInput | SortOrder
    diff?: SortOrderInput | SortOrder
    artifacts?: SortOrderInput | SortOrder
    tokenUsage?: SortOrderInput | SortOrder
    cost?: SortOrderInput | SortOrder
    duration?: SortOrderInput | SortOrder
    quality?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    projectId?: SortOrder
    userId?: SortOrder
    project?: ProjectOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    qualityGates?: QualityGateOrderByRelationAggregateInput
    executions?: TaskExecutionOrderByRelationAggregateInput
  }

  export type TaskWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    title?: StringFilter<"Task"> | string
    description?: StringNullableFilter<"Task"> | string | null
    status?: EnumTaskStatusFilter<"Task"> | $Enums.TaskStatus
    priority?: EnumPriorityFilter<"Task"> | $Enums.Priority
    aiProvider?: EnumAIProviderFilter<"Task"> | $Enums.AIProvider
    model?: StringNullableFilter<"Task"> | string | null
    type?: EnumTaskTypeFilter<"Task"> | $Enums.TaskType
    context?: JsonNullableFilter<"Task">
    requirements?: JsonNullableFilter<"Task">
    constraints?: JsonNullableFilter<"Task">
    result?: JsonNullableFilter<"Task">
    diff?: StringNullableFilter<"Task"> | string | null
    artifacts?: JsonNullableFilter<"Task">
    tokenUsage?: IntNullableFilter<"Task"> | number | null
    cost?: FloatNullableFilter<"Task"> | number | null
    duration?: IntNullableFilter<"Task"> | number | null
    quality?: FloatNullableFilter<"Task"> | number | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeFilter<"Task"> | Date | string
    completedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    projectId?: StringFilter<"Task"> | string
    userId?: StringFilter<"Task"> | string
    project?: XOR<ProjectRelationFilter, ProjectWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
    qualityGates?: QualityGateListRelationFilter
    executions?: TaskExecutionListRelationFilter
  }, "id">

  export type TaskOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    priority?: SortOrder
    aiProvider?: SortOrder
    model?: SortOrderInput | SortOrder
    type?: SortOrder
    context?: SortOrderInput | SortOrder
    requirements?: SortOrderInput | SortOrder
    constraints?: SortOrderInput | SortOrder
    result?: SortOrderInput | SortOrder
    diff?: SortOrderInput | SortOrder
    artifacts?: SortOrderInput | SortOrder
    tokenUsage?: SortOrderInput | SortOrder
    cost?: SortOrderInput | SortOrder
    duration?: SortOrderInput | SortOrder
    quality?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    projectId?: SortOrder
    userId?: SortOrder
    _count?: TaskCountOrderByAggregateInput
    _avg?: TaskAvgOrderByAggregateInput
    _max?: TaskMaxOrderByAggregateInput
    _min?: TaskMinOrderByAggregateInput
    _sum?: TaskSumOrderByAggregateInput
  }

  export type TaskScalarWhereWithAggregatesInput = {
    AND?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    OR?: TaskScalarWhereWithAggregatesInput[]
    NOT?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Task"> | string
    title?: StringWithAggregatesFilter<"Task"> | string
    description?: StringNullableWithAggregatesFilter<"Task"> | string | null
    status?: EnumTaskStatusWithAggregatesFilter<"Task"> | $Enums.TaskStatus
    priority?: EnumPriorityWithAggregatesFilter<"Task"> | $Enums.Priority
    aiProvider?: EnumAIProviderWithAggregatesFilter<"Task"> | $Enums.AIProvider
    model?: StringNullableWithAggregatesFilter<"Task"> | string | null
    type?: EnumTaskTypeWithAggregatesFilter<"Task"> | $Enums.TaskType
    context?: JsonNullableWithAggregatesFilter<"Task">
    requirements?: JsonNullableWithAggregatesFilter<"Task">
    constraints?: JsonNullableWithAggregatesFilter<"Task">
    result?: JsonNullableWithAggregatesFilter<"Task">
    diff?: StringNullableWithAggregatesFilter<"Task"> | string | null
    artifacts?: JsonNullableWithAggregatesFilter<"Task">
    tokenUsage?: IntNullableWithAggregatesFilter<"Task"> | number | null
    cost?: FloatNullableWithAggregatesFilter<"Task"> | number | null
    duration?: IntNullableWithAggregatesFilter<"Task"> | number | null
    quality?: FloatNullableWithAggregatesFilter<"Task"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Task"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Task"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"Task"> | Date | string | null
    projectId?: StringWithAggregatesFilter<"Task"> | string
    userId?: StringWithAggregatesFilter<"Task"> | string
  }

  export type TaskExecutionWhereInput = {
    AND?: TaskExecutionWhereInput | TaskExecutionWhereInput[]
    OR?: TaskExecutionWhereInput[]
    NOT?: TaskExecutionWhereInput | TaskExecutionWhereInput[]
    id?: StringFilter<"TaskExecution"> | string
    status?: EnumExecutionStatusFilter<"TaskExecution"> | $Enums.ExecutionStatus
    startedAt?: DateTimeFilter<"TaskExecution"> | Date | string
    completedAt?: DateTimeNullableFilter<"TaskExecution"> | Date | string | null
    input?: JsonFilter<"TaskExecution">
    output?: JsonNullableFilter<"TaskExecution">
    errorMessage?: StringNullableFilter<"TaskExecution"> | string | null
    logs?: JsonNullableFilter<"TaskExecution">
    metrics?: JsonNullableFilter<"TaskExecution">
    taskId?: StringFilter<"TaskExecution"> | string
    task?: XOR<TaskRelationFilter, TaskWhereInput>
  }

  export type TaskExecutionOrderByWithRelationInput = {
    id?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    input?: SortOrder
    output?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    logs?: SortOrderInput | SortOrder
    metrics?: SortOrderInput | SortOrder
    taskId?: SortOrder
    task?: TaskOrderByWithRelationInput
  }

  export type TaskExecutionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskExecutionWhereInput | TaskExecutionWhereInput[]
    OR?: TaskExecutionWhereInput[]
    NOT?: TaskExecutionWhereInput | TaskExecutionWhereInput[]
    status?: EnumExecutionStatusFilter<"TaskExecution"> | $Enums.ExecutionStatus
    startedAt?: DateTimeFilter<"TaskExecution"> | Date | string
    completedAt?: DateTimeNullableFilter<"TaskExecution"> | Date | string | null
    input?: JsonFilter<"TaskExecution">
    output?: JsonNullableFilter<"TaskExecution">
    errorMessage?: StringNullableFilter<"TaskExecution"> | string | null
    logs?: JsonNullableFilter<"TaskExecution">
    metrics?: JsonNullableFilter<"TaskExecution">
    taskId?: StringFilter<"TaskExecution"> | string
    task?: XOR<TaskRelationFilter, TaskWhereInput>
  }, "id">

  export type TaskExecutionOrderByWithAggregationInput = {
    id?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    input?: SortOrder
    output?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    logs?: SortOrderInput | SortOrder
    metrics?: SortOrderInput | SortOrder
    taskId?: SortOrder
    _count?: TaskExecutionCountOrderByAggregateInput
    _max?: TaskExecutionMaxOrderByAggregateInput
    _min?: TaskExecutionMinOrderByAggregateInput
  }

  export type TaskExecutionScalarWhereWithAggregatesInput = {
    AND?: TaskExecutionScalarWhereWithAggregatesInput | TaskExecutionScalarWhereWithAggregatesInput[]
    OR?: TaskExecutionScalarWhereWithAggregatesInput[]
    NOT?: TaskExecutionScalarWhereWithAggregatesInput | TaskExecutionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TaskExecution"> | string
    status?: EnumExecutionStatusWithAggregatesFilter<"TaskExecution"> | $Enums.ExecutionStatus
    startedAt?: DateTimeWithAggregatesFilter<"TaskExecution"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"TaskExecution"> | Date | string | null
    input?: JsonWithAggregatesFilter<"TaskExecution">
    output?: JsonNullableWithAggregatesFilter<"TaskExecution">
    errorMessage?: StringNullableWithAggregatesFilter<"TaskExecution"> | string | null
    logs?: JsonNullableWithAggregatesFilter<"TaskExecution">
    metrics?: JsonNullableWithAggregatesFilter<"TaskExecution">
    taskId?: StringWithAggregatesFilter<"TaskExecution"> | string
  }

  export type QualityGateWhereInput = {
    AND?: QualityGateWhereInput | QualityGateWhereInput[]
    OR?: QualityGateWhereInput[]
    NOT?: QualityGateWhereInput | QualityGateWhereInput[]
    id?: StringFilter<"QualityGate"> | string
    name?: StringFilter<"QualityGate"> | string
    type?: EnumQualityGateTypeFilter<"QualityGate"> | $Enums.QualityGateType
    status?: EnumQualityStatusFilter<"QualityGate"> | $Enums.QualityStatus
    rules?: JsonFilter<"QualityGate">
    config?: JsonNullableFilter<"QualityGate">
    score?: FloatNullableFilter<"QualityGate"> | number | null
    issues?: JsonNullableFilter<"QualityGate">
    report?: JsonNullableFilter<"QualityGate">
    createdAt?: DateTimeFilter<"QualityGate"> | Date | string
    updatedAt?: DateTimeFilter<"QualityGate"> | Date | string
    projectId?: StringFilter<"QualityGate"> | string
    taskId?: StringNullableFilter<"QualityGate"> | string | null
    project?: XOR<ProjectRelationFilter, ProjectWhereInput>
    task?: XOR<TaskNullableRelationFilter, TaskWhereInput> | null
  }

  export type QualityGateOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    status?: SortOrder
    rules?: SortOrder
    config?: SortOrderInput | SortOrder
    score?: SortOrderInput | SortOrder
    issues?: SortOrderInput | SortOrder
    report?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projectId?: SortOrder
    taskId?: SortOrderInput | SortOrder
    project?: ProjectOrderByWithRelationInput
    task?: TaskOrderByWithRelationInput
  }

  export type QualityGateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QualityGateWhereInput | QualityGateWhereInput[]
    OR?: QualityGateWhereInput[]
    NOT?: QualityGateWhereInput | QualityGateWhereInput[]
    name?: StringFilter<"QualityGate"> | string
    type?: EnumQualityGateTypeFilter<"QualityGate"> | $Enums.QualityGateType
    status?: EnumQualityStatusFilter<"QualityGate"> | $Enums.QualityStatus
    rules?: JsonFilter<"QualityGate">
    config?: JsonNullableFilter<"QualityGate">
    score?: FloatNullableFilter<"QualityGate"> | number | null
    issues?: JsonNullableFilter<"QualityGate">
    report?: JsonNullableFilter<"QualityGate">
    createdAt?: DateTimeFilter<"QualityGate"> | Date | string
    updatedAt?: DateTimeFilter<"QualityGate"> | Date | string
    projectId?: StringFilter<"QualityGate"> | string
    taskId?: StringNullableFilter<"QualityGate"> | string | null
    project?: XOR<ProjectRelationFilter, ProjectWhereInput>
    task?: XOR<TaskNullableRelationFilter, TaskWhereInput> | null
  }, "id">

  export type QualityGateOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    status?: SortOrder
    rules?: SortOrder
    config?: SortOrderInput | SortOrder
    score?: SortOrderInput | SortOrder
    issues?: SortOrderInput | SortOrder
    report?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projectId?: SortOrder
    taskId?: SortOrderInput | SortOrder
    _count?: QualityGateCountOrderByAggregateInput
    _avg?: QualityGateAvgOrderByAggregateInput
    _max?: QualityGateMaxOrderByAggregateInput
    _min?: QualityGateMinOrderByAggregateInput
    _sum?: QualityGateSumOrderByAggregateInput
  }

  export type QualityGateScalarWhereWithAggregatesInput = {
    AND?: QualityGateScalarWhereWithAggregatesInput | QualityGateScalarWhereWithAggregatesInput[]
    OR?: QualityGateScalarWhereWithAggregatesInput[]
    NOT?: QualityGateScalarWhereWithAggregatesInput | QualityGateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"QualityGate"> | string
    name?: StringWithAggregatesFilter<"QualityGate"> | string
    type?: EnumQualityGateTypeWithAggregatesFilter<"QualityGate"> | $Enums.QualityGateType
    status?: EnumQualityStatusWithAggregatesFilter<"QualityGate"> | $Enums.QualityStatus
    rules?: JsonWithAggregatesFilter<"QualityGate">
    config?: JsonNullableWithAggregatesFilter<"QualityGate">
    score?: FloatNullableWithAggregatesFilter<"QualityGate"> | number | null
    issues?: JsonNullableWithAggregatesFilter<"QualityGate">
    report?: JsonNullableWithAggregatesFilter<"QualityGate">
    createdAt?: DateTimeWithAggregatesFilter<"QualityGate"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"QualityGate"> | Date | string
    projectId?: StringWithAggregatesFilter<"QualityGate"> | string
    taskId?: StringNullableWithAggregatesFilter<"QualityGate"> | string | null
  }

  export type AITeamWhereInput = {
    AND?: AITeamWhereInput | AITeamWhereInput[]
    OR?: AITeamWhereInput[]
    NOT?: AITeamWhereInput | AITeamWhereInput[]
    id?: StringFilter<"AITeam"> | string
    name?: StringFilter<"AITeam"> | string
    description?: StringNullableFilter<"AITeam"> | string | null
    status?: EnumTeamStatusFilter<"AITeam"> | $Enums.TeamStatus
    strategy?: JsonFilter<"AITeam">
    preferences?: JsonNullableFilter<"AITeam">
    createdAt?: DateTimeFilter<"AITeam"> | Date | string
    updatedAt?: DateTimeFilter<"AITeam"> | Date | string
    members?: TeamMemberListRelationFilter
  }

  export type AITeamOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    strategy?: SortOrder
    preferences?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    members?: TeamMemberOrderByRelationAggregateInput
  }

  export type AITeamWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AITeamWhereInput | AITeamWhereInput[]
    OR?: AITeamWhereInput[]
    NOT?: AITeamWhereInput | AITeamWhereInput[]
    name?: StringFilter<"AITeam"> | string
    description?: StringNullableFilter<"AITeam"> | string | null
    status?: EnumTeamStatusFilter<"AITeam"> | $Enums.TeamStatus
    strategy?: JsonFilter<"AITeam">
    preferences?: JsonNullableFilter<"AITeam">
    createdAt?: DateTimeFilter<"AITeam"> | Date | string
    updatedAt?: DateTimeFilter<"AITeam"> | Date | string
    members?: TeamMemberListRelationFilter
  }, "id">

  export type AITeamOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    strategy?: SortOrder
    preferences?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AITeamCountOrderByAggregateInput
    _max?: AITeamMaxOrderByAggregateInput
    _min?: AITeamMinOrderByAggregateInput
  }

  export type AITeamScalarWhereWithAggregatesInput = {
    AND?: AITeamScalarWhereWithAggregatesInput | AITeamScalarWhereWithAggregatesInput[]
    OR?: AITeamScalarWhereWithAggregatesInput[]
    NOT?: AITeamScalarWhereWithAggregatesInput | AITeamScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AITeam"> | string
    name?: StringWithAggregatesFilter<"AITeam"> | string
    description?: StringNullableWithAggregatesFilter<"AITeam"> | string | null
    status?: EnumTeamStatusWithAggregatesFilter<"AITeam"> | $Enums.TeamStatus
    strategy?: JsonWithAggregatesFilter<"AITeam">
    preferences?: JsonNullableWithAggregatesFilter<"AITeam">
    createdAt?: DateTimeWithAggregatesFilter<"AITeam"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AITeam"> | Date | string
  }

  export type TeamMemberWhereInput = {
    AND?: TeamMemberWhereInput | TeamMemberWhereInput[]
    OR?: TeamMemberWhereInput[]
    NOT?: TeamMemberWhereInput | TeamMemberWhereInput[]
    id?: StringFilter<"TeamMember"> | string
    role?: EnumMemberRoleFilter<"TeamMember"> | $Enums.MemberRole
    aiProvider?: EnumAIProviderFilter<"TeamMember"> | $Enums.AIProvider
    model?: StringFilter<"TeamMember"> | string
    specialties?: JsonNullableFilter<"TeamMember">
    performance?: JsonNullableFilter<"TeamMember">
    teamId?: StringFilter<"TeamMember"> | string
    userId?: StringNullableFilter<"TeamMember"> | string | null
    team?: XOR<AITeamRelationFilter, AITeamWhereInput>
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }

  export type TeamMemberOrderByWithRelationInput = {
    id?: SortOrder
    role?: SortOrder
    aiProvider?: SortOrder
    model?: SortOrder
    specialties?: SortOrderInput | SortOrder
    performance?: SortOrderInput | SortOrder
    teamId?: SortOrder
    userId?: SortOrderInput | SortOrder
    team?: AITeamOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type TeamMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TeamMemberWhereInput | TeamMemberWhereInput[]
    OR?: TeamMemberWhereInput[]
    NOT?: TeamMemberWhereInput | TeamMemberWhereInput[]
    role?: EnumMemberRoleFilter<"TeamMember"> | $Enums.MemberRole
    aiProvider?: EnumAIProviderFilter<"TeamMember"> | $Enums.AIProvider
    model?: StringFilter<"TeamMember"> | string
    specialties?: JsonNullableFilter<"TeamMember">
    performance?: JsonNullableFilter<"TeamMember">
    teamId?: StringFilter<"TeamMember"> | string
    userId?: StringNullableFilter<"TeamMember"> | string | null
    team?: XOR<AITeamRelationFilter, AITeamWhereInput>
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }, "id">

  export type TeamMemberOrderByWithAggregationInput = {
    id?: SortOrder
    role?: SortOrder
    aiProvider?: SortOrder
    model?: SortOrder
    specialties?: SortOrderInput | SortOrder
    performance?: SortOrderInput | SortOrder
    teamId?: SortOrder
    userId?: SortOrderInput | SortOrder
    _count?: TeamMemberCountOrderByAggregateInput
    _max?: TeamMemberMaxOrderByAggregateInput
    _min?: TeamMemberMinOrderByAggregateInput
  }

  export type TeamMemberScalarWhereWithAggregatesInput = {
    AND?: TeamMemberScalarWhereWithAggregatesInput | TeamMemberScalarWhereWithAggregatesInput[]
    OR?: TeamMemberScalarWhereWithAggregatesInput[]
    NOT?: TeamMemberScalarWhereWithAggregatesInput | TeamMemberScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TeamMember"> | string
    role?: EnumMemberRoleWithAggregatesFilter<"TeamMember"> | $Enums.MemberRole
    aiProvider?: EnumAIProviderWithAggregatesFilter<"TeamMember"> | $Enums.AIProvider
    model?: StringWithAggregatesFilter<"TeamMember"> | string
    specialties?: JsonNullableWithAggregatesFilter<"TeamMember">
    performance?: JsonNullableWithAggregatesFilter<"TeamMember">
    teamId?: StringWithAggregatesFilter<"TeamMember"> | string
    userId?: StringNullableWithAggregatesFilter<"TeamMember"> | string | null
  }

  export type DeploymentWhereInput = {
    AND?: DeploymentWhereInput | DeploymentWhereInput[]
    OR?: DeploymentWhereInput[]
    NOT?: DeploymentWhereInput | DeploymentWhereInput[]
    id?: StringFilter<"Deployment"> | string
    version?: StringFilter<"Deployment"> | string
    status?: EnumDeploymentStatusFilter<"Deployment"> | $Enums.DeploymentStatus
    environment?: StringFilter<"Deployment"> | string
    config?: JsonNullableFilter<"Deployment">
    logs?: JsonNullableFilter<"Deployment">
    url?: StringNullableFilter<"Deployment"> | string | null
    createdAt?: DateTimeFilter<"Deployment"> | Date | string
    updatedAt?: DateTimeFilter<"Deployment"> | Date | string
    deployedAt?: DateTimeNullableFilter<"Deployment"> | Date | string | null
    projectId?: StringFilter<"Deployment"> | string
    project?: XOR<ProjectRelationFilter, ProjectWhereInput>
  }

  export type DeploymentOrderByWithRelationInput = {
    id?: SortOrder
    version?: SortOrder
    status?: SortOrder
    environment?: SortOrder
    config?: SortOrderInput | SortOrder
    logs?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deployedAt?: SortOrderInput | SortOrder
    projectId?: SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type DeploymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DeploymentWhereInput | DeploymentWhereInput[]
    OR?: DeploymentWhereInput[]
    NOT?: DeploymentWhereInput | DeploymentWhereInput[]
    version?: StringFilter<"Deployment"> | string
    status?: EnumDeploymentStatusFilter<"Deployment"> | $Enums.DeploymentStatus
    environment?: StringFilter<"Deployment"> | string
    config?: JsonNullableFilter<"Deployment">
    logs?: JsonNullableFilter<"Deployment">
    url?: StringNullableFilter<"Deployment"> | string | null
    createdAt?: DateTimeFilter<"Deployment"> | Date | string
    updatedAt?: DateTimeFilter<"Deployment"> | Date | string
    deployedAt?: DateTimeNullableFilter<"Deployment"> | Date | string | null
    projectId?: StringFilter<"Deployment"> | string
    project?: XOR<ProjectRelationFilter, ProjectWhereInput>
  }, "id">

  export type DeploymentOrderByWithAggregationInput = {
    id?: SortOrder
    version?: SortOrder
    status?: SortOrder
    environment?: SortOrder
    config?: SortOrderInput | SortOrder
    logs?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deployedAt?: SortOrderInput | SortOrder
    projectId?: SortOrder
    _count?: DeploymentCountOrderByAggregateInput
    _max?: DeploymentMaxOrderByAggregateInput
    _min?: DeploymentMinOrderByAggregateInput
  }

  export type DeploymentScalarWhereWithAggregatesInput = {
    AND?: DeploymentScalarWhereWithAggregatesInput | DeploymentScalarWhereWithAggregatesInput[]
    OR?: DeploymentScalarWhereWithAggregatesInput[]
    NOT?: DeploymentScalarWhereWithAggregatesInput | DeploymentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Deployment"> | string
    version?: StringWithAggregatesFilter<"Deployment"> | string
    status?: EnumDeploymentStatusWithAggregatesFilter<"Deployment"> | $Enums.DeploymentStatus
    environment?: StringWithAggregatesFilter<"Deployment"> | string
    config?: JsonNullableWithAggregatesFilter<"Deployment">
    logs?: JsonNullableWithAggregatesFilter<"Deployment">
    url?: StringNullableWithAggregatesFilter<"Deployment"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Deployment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Deployment"> | Date | string
    deployedAt?: DateTimeNullableWithAggregatesFilter<"Deployment"> | Date | string | null
    projectId?: StringWithAggregatesFilter<"Deployment"> | string
  }

  export type ProjectFileWhereInput = {
    AND?: ProjectFileWhereInput | ProjectFileWhereInput[]
    OR?: ProjectFileWhereInput[]
    NOT?: ProjectFileWhereInput | ProjectFileWhereInput[]
    id?: StringFilter<"ProjectFile"> | string
    path?: StringFilter<"ProjectFile"> | string
    name?: StringFilter<"ProjectFile"> | string
    type?: StringNullableFilter<"ProjectFile"> | string | null
    size?: IntNullableFilter<"ProjectFile"> | number | null
    checksum?: StringNullableFilter<"ProjectFile"> | string | null
    language?: StringNullableFilter<"ProjectFile"> | string | null
    framework?: StringNullableFilter<"ProjectFile"> | string | null
    purpose?: StringNullableFilter<"ProjectFile"> | string | null
    createdAt?: DateTimeFilter<"ProjectFile"> | Date | string
    updatedAt?: DateTimeFilter<"ProjectFile"> | Date | string
    projectId?: StringFilter<"ProjectFile"> | string
    project?: XOR<ProjectRelationFilter, ProjectWhereInput>
  }

  export type ProjectFileOrderByWithRelationInput = {
    id?: SortOrder
    path?: SortOrder
    name?: SortOrder
    type?: SortOrderInput | SortOrder
    size?: SortOrderInput | SortOrder
    checksum?: SortOrderInput | SortOrder
    language?: SortOrderInput | SortOrder
    framework?: SortOrderInput | SortOrder
    purpose?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projectId?: SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type ProjectFileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    projectId_path?: ProjectFileProjectIdPathCompoundUniqueInput
    AND?: ProjectFileWhereInput | ProjectFileWhereInput[]
    OR?: ProjectFileWhereInput[]
    NOT?: ProjectFileWhereInput | ProjectFileWhereInput[]
    path?: StringFilter<"ProjectFile"> | string
    name?: StringFilter<"ProjectFile"> | string
    type?: StringNullableFilter<"ProjectFile"> | string | null
    size?: IntNullableFilter<"ProjectFile"> | number | null
    checksum?: StringNullableFilter<"ProjectFile"> | string | null
    language?: StringNullableFilter<"ProjectFile"> | string | null
    framework?: StringNullableFilter<"ProjectFile"> | string | null
    purpose?: StringNullableFilter<"ProjectFile"> | string | null
    createdAt?: DateTimeFilter<"ProjectFile"> | Date | string
    updatedAt?: DateTimeFilter<"ProjectFile"> | Date | string
    projectId?: StringFilter<"ProjectFile"> | string
    project?: XOR<ProjectRelationFilter, ProjectWhereInput>
  }, "id" | "projectId_path">

  export type ProjectFileOrderByWithAggregationInput = {
    id?: SortOrder
    path?: SortOrder
    name?: SortOrder
    type?: SortOrderInput | SortOrder
    size?: SortOrderInput | SortOrder
    checksum?: SortOrderInput | SortOrder
    language?: SortOrderInput | SortOrder
    framework?: SortOrderInput | SortOrder
    purpose?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projectId?: SortOrder
    _count?: ProjectFileCountOrderByAggregateInput
    _avg?: ProjectFileAvgOrderByAggregateInput
    _max?: ProjectFileMaxOrderByAggregateInput
    _min?: ProjectFileMinOrderByAggregateInput
    _sum?: ProjectFileSumOrderByAggregateInput
  }

  export type ProjectFileScalarWhereWithAggregatesInput = {
    AND?: ProjectFileScalarWhereWithAggregatesInput | ProjectFileScalarWhereWithAggregatesInput[]
    OR?: ProjectFileScalarWhereWithAggregatesInput[]
    NOT?: ProjectFileScalarWhereWithAggregatesInput | ProjectFileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProjectFile"> | string
    path?: StringWithAggregatesFilter<"ProjectFile"> | string
    name?: StringWithAggregatesFilter<"ProjectFile"> | string
    type?: StringNullableWithAggregatesFilter<"ProjectFile"> | string | null
    size?: IntNullableWithAggregatesFilter<"ProjectFile"> | number | null
    checksum?: StringNullableWithAggregatesFilter<"ProjectFile"> | string | null
    language?: StringNullableWithAggregatesFilter<"ProjectFile"> | string | null
    framework?: StringNullableWithAggregatesFilter<"ProjectFile"> | string | null
    purpose?: StringNullableWithAggregatesFilter<"ProjectFile"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ProjectFile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ProjectFile"> | Date | string
    projectId?: StringWithAggregatesFilter<"ProjectFile"> | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionId?: StringFilter<"Session"> | string
    data?: JsonNullableFilter<"Session">
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    createdAt?: DateTimeFilter<"Session"> | Date | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    userId?: StringFilter<"Session"> | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    data?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionId?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    data?: JsonNullableFilter<"Session">
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    createdAt?: DateTimeFilter<"Session"> | Date | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    userId?: StringFilter<"Session"> | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "sessionId">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    data?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    userId?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    sessionId?: StringWithAggregatesFilter<"Session"> | string
    data?: JsonNullableWithAggregatesFilter<"Session">
    ipAddress?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"Session"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    userId?: StringWithAggregatesFilter<"Session"> | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutUserInput
    tasks?: TaskCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    teamMembers?: TeamMemberCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutUserInput
    tasks?: TaskUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    teamMembers?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutUserNestedInput
    tasks?: TaskUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    teamMembers?: TeamMemberUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutUserNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    teamMembers?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.ProjectStatus
    repository?: string | null
    framework?: string | null
    language?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutProjectsInput
    tasks?: TaskCreateNestedManyWithoutProjectInput
    deployments?: DeploymentCreateNestedManyWithoutProjectInput
    qualityGates?: QualityGateCreateNestedManyWithoutProjectInput
    files?: ProjectFileCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.ProjectStatus
    repository?: string | null
    framework?: string | null
    language?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    tasks?: TaskUncheckedCreateNestedManyWithoutProjectInput
    deployments?: DeploymentUncheckedCreateNestedManyWithoutProjectInput
    qualityGates?: QualityGateUncheckedCreateNestedManyWithoutProjectInput
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    framework?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProjectsNestedInput
    tasks?: TaskUpdateManyWithoutProjectNestedInput
    deployments?: DeploymentUpdateManyWithoutProjectNestedInput
    qualityGates?: QualityGateUpdateManyWithoutProjectNestedInput
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    framework?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    tasks?: TaskUncheckedUpdateManyWithoutProjectNestedInput
    deployments?: DeploymentUncheckedUpdateManyWithoutProjectNestedInput
    qualityGates?: QualityGateUncheckedUpdateManyWithoutProjectNestedInput
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.ProjectStatus
    repository?: string | null
    framework?: string | null
    language?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    framework?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    framework?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type TaskCreateInput = {
    id?: string
    title: string
    description?: string | null
    status?: $Enums.TaskStatus
    priority?: $Enums.Priority
    aiProvider: $Enums.AIProvider
    model?: string | null
    type: $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: number | null
    cost?: number | null
    duration?: number | null
    quality?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    project: ProjectCreateNestedOneWithoutTasksInput
    user: UserCreateNestedOneWithoutTasksInput
    qualityGates?: QualityGateCreateNestedManyWithoutTaskInput
    executions?: TaskExecutionCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    status?: $Enums.TaskStatus
    priority?: $Enums.Priority
    aiProvider: $Enums.AIProvider
    model?: string | null
    type: $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: number | null
    cost?: number | null
    duration?: number | null
    quality?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    projectId: string
    userId: string
    qualityGates?: QualityGateUncheckedCreateNestedManyWithoutTaskInput
    executions?: TaskExecutionUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: NullableStringFieldUpdateOperationsInput | string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableIntFieldUpdateOperationsInput | number | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    quality?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    project?: ProjectUpdateOneRequiredWithoutTasksNestedInput
    user?: UserUpdateOneRequiredWithoutTasksNestedInput
    qualityGates?: QualityGateUpdateManyWithoutTaskNestedInput
    executions?: TaskExecutionUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: NullableStringFieldUpdateOperationsInput | string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableIntFieldUpdateOperationsInput | number | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    quality?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    projectId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    qualityGates?: QualityGateUncheckedUpdateManyWithoutTaskNestedInput
    executions?: TaskExecutionUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type TaskCreateManyInput = {
    id?: string
    title: string
    description?: string | null
    status?: $Enums.TaskStatus
    priority?: $Enums.Priority
    aiProvider: $Enums.AIProvider
    model?: string | null
    type: $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: number | null
    cost?: number | null
    duration?: number | null
    quality?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    projectId: string
    userId: string
  }

  export type TaskUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: NullableStringFieldUpdateOperationsInput | string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableIntFieldUpdateOperationsInput | number | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    quality?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TaskUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: NullableStringFieldUpdateOperationsInput | string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableIntFieldUpdateOperationsInput | number | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    quality?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    projectId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type TaskExecutionCreateInput = {
    id?: string
    status?: $Enums.ExecutionStatus
    startedAt?: Date | string
    completedAt?: Date | string | null
    input: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    logs?: NullableJsonNullValueInput | InputJsonValue
    metrics?: NullableJsonNullValueInput | InputJsonValue
    task: TaskCreateNestedOneWithoutExecutionsInput
  }

  export type TaskExecutionUncheckedCreateInput = {
    id?: string
    status?: $Enums.ExecutionStatus
    startedAt?: Date | string
    completedAt?: Date | string | null
    input: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    logs?: NullableJsonNullValueInput | InputJsonValue
    metrics?: NullableJsonNullValueInput | InputJsonValue
    taskId: string
  }

  export type TaskExecutionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumExecutionStatusFieldUpdateOperationsInput | $Enums.ExecutionStatus
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    logs?: NullableJsonNullValueInput | InputJsonValue
    metrics?: NullableJsonNullValueInput | InputJsonValue
    task?: TaskUpdateOneRequiredWithoutExecutionsNestedInput
  }

  export type TaskExecutionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumExecutionStatusFieldUpdateOperationsInput | $Enums.ExecutionStatus
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    logs?: NullableJsonNullValueInput | InputJsonValue
    metrics?: NullableJsonNullValueInput | InputJsonValue
    taskId?: StringFieldUpdateOperationsInput | string
  }

  export type TaskExecutionCreateManyInput = {
    id?: string
    status?: $Enums.ExecutionStatus
    startedAt?: Date | string
    completedAt?: Date | string | null
    input: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    logs?: NullableJsonNullValueInput | InputJsonValue
    metrics?: NullableJsonNullValueInput | InputJsonValue
    taskId: string
  }

  export type TaskExecutionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumExecutionStatusFieldUpdateOperationsInput | $Enums.ExecutionStatus
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    logs?: NullableJsonNullValueInput | InputJsonValue
    metrics?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TaskExecutionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumExecutionStatusFieldUpdateOperationsInput | $Enums.ExecutionStatus
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    logs?: NullableJsonNullValueInput | InputJsonValue
    metrics?: NullableJsonNullValueInput | InputJsonValue
    taskId?: StringFieldUpdateOperationsInput | string
  }

  export type QualityGateCreateInput = {
    id?: string
    name: string
    type: $Enums.QualityGateType
    status?: $Enums.QualityStatus
    rules: JsonNullValueInput | InputJsonValue
    config?: NullableJsonNullValueInput | InputJsonValue
    score?: number | null
    issues?: NullableJsonNullValueInput | InputJsonValue
    report?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutQualityGatesInput
    task?: TaskCreateNestedOneWithoutQualityGatesInput
  }

  export type QualityGateUncheckedCreateInput = {
    id?: string
    name: string
    type: $Enums.QualityGateType
    status?: $Enums.QualityStatus
    rules: JsonNullValueInput | InputJsonValue
    config?: NullableJsonNullValueInput | InputJsonValue
    score?: number | null
    issues?: NullableJsonNullValueInput | InputJsonValue
    report?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    projectId: string
    taskId?: string | null
  }

  export type QualityGateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumQualityGateTypeFieldUpdateOperationsInput | $Enums.QualityGateType
    status?: EnumQualityStatusFieldUpdateOperationsInput | $Enums.QualityStatus
    rules?: JsonNullValueInput | InputJsonValue
    config?: NullableJsonNullValueInput | InputJsonValue
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    issues?: NullableJsonNullValueInput | InputJsonValue
    report?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutQualityGatesNestedInput
    task?: TaskUpdateOneWithoutQualityGatesNestedInput
  }

  export type QualityGateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumQualityGateTypeFieldUpdateOperationsInput | $Enums.QualityGateType
    status?: EnumQualityStatusFieldUpdateOperationsInput | $Enums.QualityStatus
    rules?: JsonNullValueInput | InputJsonValue
    config?: NullableJsonNullValueInput | InputJsonValue
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    issues?: NullableJsonNullValueInput | InputJsonValue
    report?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectId?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QualityGateCreateManyInput = {
    id?: string
    name: string
    type: $Enums.QualityGateType
    status?: $Enums.QualityStatus
    rules: JsonNullValueInput | InputJsonValue
    config?: NullableJsonNullValueInput | InputJsonValue
    score?: number | null
    issues?: NullableJsonNullValueInput | InputJsonValue
    report?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    projectId: string
    taskId?: string | null
  }

  export type QualityGateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumQualityGateTypeFieldUpdateOperationsInput | $Enums.QualityGateType
    status?: EnumQualityStatusFieldUpdateOperationsInput | $Enums.QualityStatus
    rules?: JsonNullValueInput | InputJsonValue
    config?: NullableJsonNullValueInput | InputJsonValue
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    issues?: NullableJsonNullValueInput | InputJsonValue
    report?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QualityGateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumQualityGateTypeFieldUpdateOperationsInput | $Enums.QualityGateType
    status?: EnumQualityStatusFieldUpdateOperationsInput | $Enums.QualityStatus
    rules?: JsonNullValueInput | InputJsonValue
    config?: NullableJsonNullValueInput | InputJsonValue
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    issues?: NullableJsonNullValueInput | InputJsonValue
    report?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectId?: StringFieldUpdateOperationsInput | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AITeamCreateInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.TeamStatus
    strategy: JsonNullValueInput | InputJsonValue
    preferences?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: TeamMemberCreateNestedManyWithoutTeamInput
  }

  export type AITeamUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.TeamStatus
    strategy: JsonNullValueInput | InputJsonValue
    preferences?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: TeamMemberUncheckedCreateNestedManyWithoutTeamInput
  }

  export type AITeamUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTeamStatusFieldUpdateOperationsInput | $Enums.TeamStatus
    strategy?: JsonNullValueInput | InputJsonValue
    preferences?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: TeamMemberUpdateManyWithoutTeamNestedInput
  }

  export type AITeamUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTeamStatusFieldUpdateOperationsInput | $Enums.TeamStatus
    strategy?: JsonNullValueInput | InputJsonValue
    preferences?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: TeamMemberUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type AITeamCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.TeamStatus
    strategy: JsonNullValueInput | InputJsonValue
    preferences?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AITeamUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTeamStatusFieldUpdateOperationsInput | $Enums.TeamStatus
    strategy?: JsonNullValueInput | InputJsonValue
    preferences?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AITeamUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTeamStatusFieldUpdateOperationsInput | $Enums.TeamStatus
    strategy?: JsonNullValueInput | InputJsonValue
    preferences?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamMemberCreateInput = {
    id?: string
    role: $Enums.MemberRole
    aiProvider: $Enums.AIProvider
    model: string
    specialties?: NullableJsonNullValueInput | InputJsonValue
    performance?: NullableJsonNullValueInput | InputJsonValue
    team: AITeamCreateNestedOneWithoutMembersInput
    user?: UserCreateNestedOneWithoutTeamMembersInput
  }

  export type TeamMemberUncheckedCreateInput = {
    id?: string
    role: $Enums.MemberRole
    aiProvider: $Enums.AIProvider
    model: string
    specialties?: NullableJsonNullValueInput | InputJsonValue
    performance?: NullableJsonNullValueInput | InputJsonValue
    teamId: string
    userId?: string | null
  }

  export type TeamMemberUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMemberRoleFieldUpdateOperationsInput | $Enums.MemberRole
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: StringFieldUpdateOperationsInput | string
    specialties?: NullableJsonNullValueInput | InputJsonValue
    performance?: NullableJsonNullValueInput | InputJsonValue
    team?: AITeamUpdateOneRequiredWithoutMembersNestedInput
    user?: UserUpdateOneWithoutTeamMembersNestedInput
  }

  export type TeamMemberUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMemberRoleFieldUpdateOperationsInput | $Enums.MemberRole
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: StringFieldUpdateOperationsInput | string
    specialties?: NullableJsonNullValueInput | InputJsonValue
    performance?: NullableJsonNullValueInput | InputJsonValue
    teamId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TeamMemberCreateManyInput = {
    id?: string
    role: $Enums.MemberRole
    aiProvider: $Enums.AIProvider
    model: string
    specialties?: NullableJsonNullValueInput | InputJsonValue
    performance?: NullableJsonNullValueInput | InputJsonValue
    teamId: string
    userId?: string | null
  }

  export type TeamMemberUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMemberRoleFieldUpdateOperationsInput | $Enums.MemberRole
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: StringFieldUpdateOperationsInput | string
    specialties?: NullableJsonNullValueInput | InputJsonValue
    performance?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TeamMemberUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMemberRoleFieldUpdateOperationsInput | $Enums.MemberRole
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: StringFieldUpdateOperationsInput | string
    specialties?: NullableJsonNullValueInput | InputJsonValue
    performance?: NullableJsonNullValueInput | InputJsonValue
    teamId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DeploymentCreateInput = {
    id?: string
    version: string
    status?: $Enums.DeploymentStatus
    environment: string
    config?: NullableJsonNullValueInput | InputJsonValue
    logs?: NullableJsonNullValueInput | InputJsonValue
    url?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deployedAt?: Date | string | null
    project: ProjectCreateNestedOneWithoutDeploymentsInput
  }

  export type DeploymentUncheckedCreateInput = {
    id?: string
    version: string
    status?: $Enums.DeploymentStatus
    environment: string
    config?: NullableJsonNullValueInput | InputJsonValue
    logs?: NullableJsonNullValueInput | InputJsonValue
    url?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deployedAt?: Date | string | null
    projectId: string
  }

  export type DeploymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    status?: EnumDeploymentStatusFieldUpdateOperationsInput | $Enums.DeploymentStatus
    environment?: StringFieldUpdateOperationsInput | string
    config?: NullableJsonNullValueInput | InputJsonValue
    logs?: NullableJsonNullValueInput | InputJsonValue
    url?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deployedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    project?: ProjectUpdateOneRequiredWithoutDeploymentsNestedInput
  }

  export type DeploymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    status?: EnumDeploymentStatusFieldUpdateOperationsInput | $Enums.DeploymentStatus
    environment?: StringFieldUpdateOperationsInput | string
    config?: NullableJsonNullValueInput | InputJsonValue
    logs?: NullableJsonNullValueInput | InputJsonValue
    url?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deployedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    projectId?: StringFieldUpdateOperationsInput | string
  }

  export type DeploymentCreateManyInput = {
    id?: string
    version: string
    status?: $Enums.DeploymentStatus
    environment: string
    config?: NullableJsonNullValueInput | InputJsonValue
    logs?: NullableJsonNullValueInput | InputJsonValue
    url?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deployedAt?: Date | string | null
    projectId: string
  }

  export type DeploymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    status?: EnumDeploymentStatusFieldUpdateOperationsInput | $Enums.DeploymentStatus
    environment?: StringFieldUpdateOperationsInput | string
    config?: NullableJsonNullValueInput | InputJsonValue
    logs?: NullableJsonNullValueInput | InputJsonValue
    url?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deployedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DeploymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    status?: EnumDeploymentStatusFieldUpdateOperationsInput | $Enums.DeploymentStatus
    environment?: StringFieldUpdateOperationsInput | string
    config?: NullableJsonNullValueInput | InputJsonValue
    logs?: NullableJsonNullValueInput | InputJsonValue
    url?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deployedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    projectId?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectFileCreateInput = {
    id?: string
    path: string
    name: string
    type?: string | null
    size?: number | null
    checksum?: string | null
    language?: string | null
    framework?: string | null
    purpose?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutFilesInput
  }

  export type ProjectFileUncheckedCreateInput = {
    id?: string
    path: string
    name: string
    type?: string | null
    size?: number | null
    checksum?: string | null
    language?: string | null
    framework?: string | null
    purpose?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projectId: string
  }

  export type ProjectFileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    checksum?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    framework?: NullableStringFieldUpdateOperationsInput | string | null
    purpose?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutFilesNestedInput
  }

  export type ProjectFileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    checksum?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    framework?: NullableStringFieldUpdateOperationsInput | string | null
    purpose?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectId?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectFileCreateManyInput = {
    id?: string
    path: string
    name: string
    type?: string | null
    size?: number | null
    checksum?: string | null
    language?: string | null
    framework?: string | null
    purpose?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projectId: string
  }

  export type ProjectFileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    checksum?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    framework?: NullableStringFieldUpdateOperationsInput | string | null
    purpose?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    checksum?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    framework?: NullableStringFieldUpdateOperationsInput | string | null
    purpose?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectId?: StringFieldUpdateOperationsInput | string
  }

  export type SessionCreateInput = {
    id?: string
    sessionId: string
    data?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    expiresAt: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    sessionId: string
    data?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    expiresAt: Date | string
    userId: string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    data?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    data?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type SessionCreateManyInput = {
    id?: string
    sessionId: string
    data?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    expiresAt: Date | string
    userId: string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    data?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    data?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ProjectListRelationFilter = {
    every?: ProjectWhereInput
    some?: ProjectWhereInput
    none?: ProjectWhereInput
  }

  export type TaskListRelationFilter = {
    every?: TaskWhereInput
    some?: TaskWhereInput
    none?: TaskWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type TeamMemberListRelationFilter = {
    every?: TeamMemberWhereInput
    some?: TeamMemberWhereInput
    none?: TeamMemberWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProjectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TaskOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TeamMemberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    avatar?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    avatar?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    avatar?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumProjectStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectStatusFilter<$PrismaModel> | $Enums.ProjectStatus
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type DeploymentListRelationFilter = {
    every?: DeploymentWhereInput
    some?: DeploymentWhereInput
    none?: DeploymentWhereInput
  }

  export type QualityGateListRelationFilter = {
    every?: QualityGateWhereInput
    some?: QualityGateWhereInput
    none?: QualityGateWhereInput
  }

  export type ProjectFileListRelationFilter = {
    every?: ProjectFileWhereInput
    some?: ProjectFileWhereInput
    none?: ProjectFileWhereInput
  }

  export type DeploymentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QualityGateOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectFileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    status?: SortOrder
    repository?: SortOrder
    framework?: SortOrder
    language?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    status?: SortOrder
    repository?: SortOrder
    framework?: SortOrder
    language?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    status?: SortOrder
    repository?: SortOrder
    framework?: SortOrder
    language?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type EnumProjectStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProjectStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectStatusFilter<$PrismaModel>
    _max?: NestedEnumProjectStatusFilter<$PrismaModel>
  }

  export type EnumTaskStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusFilter<$PrismaModel> | $Enums.TaskStatus
  }

  export type EnumPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | EnumPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityFilter<$PrismaModel> | $Enums.Priority
  }

  export type EnumAIProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.AIProvider | EnumAIProviderFieldRefInput<$PrismaModel>
    in?: $Enums.AIProvider[] | ListEnumAIProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.AIProvider[] | ListEnumAIProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumAIProviderFilter<$PrismaModel> | $Enums.AIProvider
  }

  export type EnumTaskTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskType | EnumTaskTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTypeFilter<$PrismaModel> | $Enums.TaskType
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ProjectRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type TaskExecutionListRelationFilter = {
    every?: TaskExecutionWhereInput
    some?: TaskExecutionWhereInput
    none?: TaskExecutionWhereInput
  }

  export type TaskExecutionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TaskCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    aiProvider?: SortOrder
    model?: SortOrder
    type?: SortOrder
    context?: SortOrder
    requirements?: SortOrder
    constraints?: SortOrder
    result?: SortOrder
    diff?: SortOrder
    artifacts?: SortOrder
    tokenUsage?: SortOrder
    cost?: SortOrder
    duration?: SortOrder
    quality?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrder
    projectId?: SortOrder
    userId?: SortOrder
  }

  export type TaskAvgOrderByAggregateInput = {
    tokenUsage?: SortOrder
    cost?: SortOrder
    duration?: SortOrder
    quality?: SortOrder
  }

  export type TaskMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    aiProvider?: SortOrder
    model?: SortOrder
    type?: SortOrder
    diff?: SortOrder
    tokenUsage?: SortOrder
    cost?: SortOrder
    duration?: SortOrder
    quality?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrder
    projectId?: SortOrder
    userId?: SortOrder
  }

  export type TaskMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    aiProvider?: SortOrder
    model?: SortOrder
    type?: SortOrder
    diff?: SortOrder
    tokenUsage?: SortOrder
    cost?: SortOrder
    duration?: SortOrder
    quality?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    completedAt?: SortOrder
    projectId?: SortOrder
    userId?: SortOrder
  }

  export type TaskSumOrderByAggregateInput = {
    tokenUsage?: SortOrder
    cost?: SortOrder
    duration?: SortOrder
    quality?: SortOrder
  }

  export type EnumTaskStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel> | $Enums.TaskStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskStatusFilter<$PrismaModel>
    _max?: NestedEnumTaskStatusFilter<$PrismaModel>
  }

  export type EnumPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | EnumPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityWithAggregatesFilter<$PrismaModel> | $Enums.Priority
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPriorityFilter<$PrismaModel>
    _max?: NestedEnumPriorityFilter<$PrismaModel>
  }

  export type EnumAIProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AIProvider | EnumAIProviderFieldRefInput<$PrismaModel>
    in?: $Enums.AIProvider[] | ListEnumAIProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.AIProvider[] | ListEnumAIProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumAIProviderWithAggregatesFilter<$PrismaModel> | $Enums.AIProvider
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAIProviderFilter<$PrismaModel>
    _max?: NestedEnumAIProviderFilter<$PrismaModel>
  }

  export type EnumTaskTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskType | EnumTaskTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTypeWithAggregatesFilter<$PrismaModel> | $Enums.TaskType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskTypeFilter<$PrismaModel>
    _max?: NestedEnumTaskTypeFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumExecutionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ExecutionStatus | EnumExecutionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExecutionStatus[] | ListEnumExecutionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExecutionStatus[] | ListEnumExecutionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExecutionStatusFilter<$PrismaModel> | $Enums.ExecutionStatus
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type TaskRelationFilter = {
    is?: TaskWhereInput
    isNot?: TaskWhereInput
  }

  export type TaskExecutionCountOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    input?: SortOrder
    output?: SortOrder
    errorMessage?: SortOrder
    logs?: SortOrder
    metrics?: SortOrder
    taskId?: SortOrder
  }

  export type TaskExecutionMaxOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    errorMessage?: SortOrder
    taskId?: SortOrder
  }

  export type TaskExecutionMinOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    errorMessage?: SortOrder
    taskId?: SortOrder
  }

  export type EnumExecutionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExecutionStatus | EnumExecutionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExecutionStatus[] | ListEnumExecutionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExecutionStatus[] | ListEnumExecutionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExecutionStatusWithAggregatesFilter<$PrismaModel> | $Enums.ExecutionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumExecutionStatusFilter<$PrismaModel>
    _max?: NestedEnumExecutionStatusFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumQualityGateTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.QualityGateType | EnumQualityGateTypeFieldRefInput<$PrismaModel>
    in?: $Enums.QualityGateType[] | ListEnumQualityGateTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.QualityGateType[] | ListEnumQualityGateTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQualityGateTypeFilter<$PrismaModel> | $Enums.QualityGateType
  }

  export type EnumQualityStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.QualityStatus | EnumQualityStatusFieldRefInput<$PrismaModel>
    in?: $Enums.QualityStatus[] | ListEnumQualityStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.QualityStatus[] | ListEnumQualityStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumQualityStatusFilter<$PrismaModel> | $Enums.QualityStatus
  }

  export type TaskNullableRelationFilter = {
    is?: TaskWhereInput | null
    isNot?: TaskWhereInput | null
  }

  export type QualityGateCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    status?: SortOrder
    rules?: SortOrder
    config?: SortOrder
    score?: SortOrder
    issues?: SortOrder
    report?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projectId?: SortOrder
    taskId?: SortOrder
  }

  export type QualityGateAvgOrderByAggregateInput = {
    score?: SortOrder
  }

  export type QualityGateMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    status?: SortOrder
    score?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projectId?: SortOrder
    taskId?: SortOrder
  }

  export type QualityGateMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    type?: SortOrder
    status?: SortOrder
    score?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projectId?: SortOrder
    taskId?: SortOrder
  }

  export type QualityGateSumOrderByAggregateInput = {
    score?: SortOrder
  }

  export type EnumQualityGateTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QualityGateType | EnumQualityGateTypeFieldRefInput<$PrismaModel>
    in?: $Enums.QualityGateType[] | ListEnumQualityGateTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.QualityGateType[] | ListEnumQualityGateTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQualityGateTypeWithAggregatesFilter<$PrismaModel> | $Enums.QualityGateType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQualityGateTypeFilter<$PrismaModel>
    _max?: NestedEnumQualityGateTypeFilter<$PrismaModel>
  }

  export type EnumQualityStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QualityStatus | EnumQualityStatusFieldRefInput<$PrismaModel>
    in?: $Enums.QualityStatus[] | ListEnumQualityStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.QualityStatus[] | ListEnumQualityStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumQualityStatusWithAggregatesFilter<$PrismaModel> | $Enums.QualityStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQualityStatusFilter<$PrismaModel>
    _max?: NestedEnumQualityStatusFilter<$PrismaModel>
  }

  export type EnumTeamStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TeamStatus | EnumTeamStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TeamStatus[] | ListEnumTeamStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TeamStatus[] | ListEnumTeamStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTeamStatusFilter<$PrismaModel> | $Enums.TeamStatus
  }

  export type AITeamCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    status?: SortOrder
    strategy?: SortOrder
    preferences?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AITeamMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AITeamMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumTeamStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TeamStatus | EnumTeamStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TeamStatus[] | ListEnumTeamStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TeamStatus[] | ListEnumTeamStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTeamStatusWithAggregatesFilter<$PrismaModel> | $Enums.TeamStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTeamStatusFilter<$PrismaModel>
    _max?: NestedEnumTeamStatusFilter<$PrismaModel>
  }

  export type EnumMemberRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.MemberRole | EnumMemberRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MemberRole[] | ListEnumMemberRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MemberRole[] | ListEnumMemberRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMemberRoleFilter<$PrismaModel> | $Enums.MemberRole
  }

  export type AITeamRelationFilter = {
    is?: AITeamWhereInput
    isNot?: AITeamWhereInput
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type TeamMemberCountOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    aiProvider?: SortOrder
    model?: SortOrder
    specialties?: SortOrder
    performance?: SortOrder
    teamId?: SortOrder
    userId?: SortOrder
  }

  export type TeamMemberMaxOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    aiProvider?: SortOrder
    model?: SortOrder
    teamId?: SortOrder
    userId?: SortOrder
  }

  export type TeamMemberMinOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    aiProvider?: SortOrder
    model?: SortOrder
    teamId?: SortOrder
    userId?: SortOrder
  }

  export type EnumMemberRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MemberRole | EnumMemberRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MemberRole[] | ListEnumMemberRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MemberRole[] | ListEnumMemberRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMemberRoleWithAggregatesFilter<$PrismaModel> | $Enums.MemberRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMemberRoleFilter<$PrismaModel>
    _max?: NestedEnumMemberRoleFilter<$PrismaModel>
  }

  export type EnumDeploymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DeploymentStatus | EnumDeploymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeploymentStatus[] | ListEnumDeploymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeploymentStatus[] | ListEnumDeploymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDeploymentStatusFilter<$PrismaModel> | $Enums.DeploymentStatus
  }

  export type DeploymentCountOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    status?: SortOrder
    environment?: SortOrder
    config?: SortOrder
    logs?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deployedAt?: SortOrder
    projectId?: SortOrder
  }

  export type DeploymentMaxOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    status?: SortOrder
    environment?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deployedAt?: SortOrder
    projectId?: SortOrder
  }

  export type DeploymentMinOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
    status?: SortOrder
    environment?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deployedAt?: SortOrder
    projectId?: SortOrder
  }

  export type EnumDeploymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeploymentStatus | EnumDeploymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeploymentStatus[] | ListEnumDeploymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeploymentStatus[] | ListEnumDeploymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDeploymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.DeploymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeploymentStatusFilter<$PrismaModel>
    _max?: NestedEnumDeploymentStatusFilter<$PrismaModel>
  }

  export type ProjectFileProjectIdPathCompoundUniqueInput = {
    projectId: string
    path: string
  }

  export type ProjectFileCountOrderByAggregateInput = {
    id?: SortOrder
    path?: SortOrder
    name?: SortOrder
    type?: SortOrder
    size?: SortOrder
    checksum?: SortOrder
    language?: SortOrder
    framework?: SortOrder
    purpose?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projectId?: SortOrder
  }

  export type ProjectFileAvgOrderByAggregateInput = {
    size?: SortOrder
  }

  export type ProjectFileMaxOrderByAggregateInput = {
    id?: SortOrder
    path?: SortOrder
    name?: SortOrder
    type?: SortOrder
    size?: SortOrder
    checksum?: SortOrder
    language?: SortOrder
    framework?: SortOrder
    purpose?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projectId?: SortOrder
  }

  export type ProjectFileMinOrderByAggregateInput = {
    id?: SortOrder
    path?: SortOrder
    name?: SortOrder
    type?: SortOrder
    size?: SortOrder
    checksum?: SortOrder
    language?: SortOrder
    framework?: SortOrder
    purpose?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projectId?: SortOrder
  }

  export type ProjectFileSumOrderByAggregateInput = {
    size?: SortOrder
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    data?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    userId?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    userId?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    userId?: SortOrder
  }

  export type ProjectCreateNestedManyWithoutUserInput = {
    create?: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput> | ProjectCreateWithoutUserInput[] | ProjectUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutUserInput | ProjectCreateOrConnectWithoutUserInput[]
    createMany?: ProjectCreateManyUserInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type TaskCreateNestedManyWithoutUserInput = {
    create?: XOR<TaskCreateWithoutUserInput, TaskUncheckedCreateWithoutUserInput> | TaskCreateWithoutUserInput[] | TaskUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutUserInput | TaskCreateOrConnectWithoutUserInput[]
    createMany?: TaskCreateManyUserInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type TeamMemberCreateNestedManyWithoutUserInput = {
    create?: XOR<TeamMemberCreateWithoutUserInput, TeamMemberUncheckedCreateWithoutUserInput> | TeamMemberCreateWithoutUserInput[] | TeamMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutUserInput | TeamMemberCreateOrConnectWithoutUserInput[]
    createMany?: TeamMemberCreateManyUserInputEnvelope
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput> | ProjectCreateWithoutUserInput[] | ProjectUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutUserInput | ProjectCreateOrConnectWithoutUserInput[]
    createMany?: ProjectCreateManyUserInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TaskCreateWithoutUserInput, TaskUncheckedCreateWithoutUserInput> | TaskCreateWithoutUserInput[] | TaskUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutUserInput | TaskCreateOrConnectWithoutUserInput[]
    createMany?: TaskCreateManyUserInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type TeamMemberUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TeamMemberCreateWithoutUserInput, TeamMemberUncheckedCreateWithoutUserInput> | TeamMemberCreateWithoutUserInput[] | TeamMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutUserInput | TeamMemberCreateOrConnectWithoutUserInput[]
    createMany?: TeamMemberCreateManyUserInputEnvelope
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ProjectUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput> | ProjectCreateWithoutUserInput[] | ProjectUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutUserInput | ProjectCreateOrConnectWithoutUserInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutUserInput | ProjectUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProjectCreateManyUserInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutUserInput | ProjectUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutUserInput | ProjectUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type TaskUpdateManyWithoutUserNestedInput = {
    create?: XOR<TaskCreateWithoutUserInput, TaskUncheckedCreateWithoutUserInput> | TaskCreateWithoutUserInput[] | TaskUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutUserInput | TaskCreateOrConnectWithoutUserInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutUserInput | TaskUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TaskCreateManyUserInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutUserInput | TaskUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutUserInput | TaskUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type TeamMemberUpdateManyWithoutUserNestedInput = {
    create?: XOR<TeamMemberCreateWithoutUserInput, TeamMemberUncheckedCreateWithoutUserInput> | TeamMemberCreateWithoutUserInput[] | TeamMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutUserInput | TeamMemberCreateOrConnectWithoutUserInput[]
    upsert?: TeamMemberUpsertWithWhereUniqueWithoutUserInput | TeamMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TeamMemberCreateManyUserInputEnvelope
    set?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    disconnect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    delete?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    update?: TeamMemberUpdateWithWhereUniqueWithoutUserInput | TeamMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TeamMemberUpdateManyWithWhereWithoutUserInput | TeamMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput> | ProjectCreateWithoutUserInput[] | ProjectUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutUserInput | ProjectCreateOrConnectWithoutUserInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutUserInput | ProjectUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProjectCreateManyUserInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutUserInput | ProjectUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutUserInput | ProjectUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TaskCreateWithoutUserInput, TaskUncheckedCreateWithoutUserInput> | TaskCreateWithoutUserInput[] | TaskUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutUserInput | TaskCreateOrConnectWithoutUserInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutUserInput | TaskUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TaskCreateManyUserInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutUserInput | TaskUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutUserInput | TaskUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type TeamMemberUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TeamMemberCreateWithoutUserInput, TeamMemberUncheckedCreateWithoutUserInput> | TeamMemberCreateWithoutUserInput[] | TeamMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutUserInput | TeamMemberCreateOrConnectWithoutUserInput[]
    upsert?: TeamMemberUpsertWithWhereUniqueWithoutUserInput | TeamMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TeamMemberCreateManyUserInputEnvelope
    set?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    disconnect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    delete?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    update?: TeamMemberUpdateWithWhereUniqueWithoutUserInput | TeamMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TeamMemberUpdateManyWithWhereWithoutUserInput | TeamMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutProjectsInput = {
    create?: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectsInput
    connect?: UserWhereUniqueInput
  }

  export type TaskCreateNestedManyWithoutProjectInput = {
    create?: XOR<TaskCreateWithoutProjectInput, TaskUncheckedCreateWithoutProjectInput> | TaskCreateWithoutProjectInput[] | TaskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutProjectInput | TaskCreateOrConnectWithoutProjectInput[]
    createMany?: TaskCreateManyProjectInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type DeploymentCreateNestedManyWithoutProjectInput = {
    create?: XOR<DeploymentCreateWithoutProjectInput, DeploymentUncheckedCreateWithoutProjectInput> | DeploymentCreateWithoutProjectInput[] | DeploymentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DeploymentCreateOrConnectWithoutProjectInput | DeploymentCreateOrConnectWithoutProjectInput[]
    createMany?: DeploymentCreateManyProjectInputEnvelope
    connect?: DeploymentWhereUniqueInput | DeploymentWhereUniqueInput[]
  }

  export type QualityGateCreateNestedManyWithoutProjectInput = {
    create?: XOR<QualityGateCreateWithoutProjectInput, QualityGateUncheckedCreateWithoutProjectInput> | QualityGateCreateWithoutProjectInput[] | QualityGateUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: QualityGateCreateOrConnectWithoutProjectInput | QualityGateCreateOrConnectWithoutProjectInput[]
    createMany?: QualityGateCreateManyProjectInputEnvelope
    connect?: QualityGateWhereUniqueInput | QualityGateWhereUniqueInput[]
  }

  export type ProjectFileCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput> | ProjectFileCreateWithoutProjectInput[] | ProjectFileUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutProjectInput | ProjectFileCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectFileCreateManyProjectInputEnvelope
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<TaskCreateWithoutProjectInput, TaskUncheckedCreateWithoutProjectInput> | TaskCreateWithoutProjectInput[] | TaskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutProjectInput | TaskCreateOrConnectWithoutProjectInput[]
    createMany?: TaskCreateManyProjectInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type DeploymentUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<DeploymentCreateWithoutProjectInput, DeploymentUncheckedCreateWithoutProjectInput> | DeploymentCreateWithoutProjectInput[] | DeploymentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DeploymentCreateOrConnectWithoutProjectInput | DeploymentCreateOrConnectWithoutProjectInput[]
    createMany?: DeploymentCreateManyProjectInputEnvelope
    connect?: DeploymentWhereUniqueInput | DeploymentWhereUniqueInput[]
  }

  export type QualityGateUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<QualityGateCreateWithoutProjectInput, QualityGateUncheckedCreateWithoutProjectInput> | QualityGateCreateWithoutProjectInput[] | QualityGateUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: QualityGateCreateOrConnectWithoutProjectInput | QualityGateCreateOrConnectWithoutProjectInput[]
    createMany?: QualityGateCreateManyProjectInputEnvelope
    connect?: QualityGateWhereUniqueInput | QualityGateWhereUniqueInput[]
  }

  export type ProjectFileUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput> | ProjectFileCreateWithoutProjectInput[] | ProjectFileUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutProjectInput | ProjectFileCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectFileCreateManyProjectInputEnvelope
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
  }

  export type EnumProjectStatusFieldUpdateOperationsInput = {
    set?: $Enums.ProjectStatus
  }

  export type UserUpdateOneRequiredWithoutProjectsNestedInput = {
    create?: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectsInput
    upsert?: UserUpsertWithoutProjectsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProjectsInput, UserUpdateWithoutProjectsInput>, UserUncheckedUpdateWithoutProjectsInput>
  }

  export type TaskUpdateManyWithoutProjectNestedInput = {
    create?: XOR<TaskCreateWithoutProjectInput, TaskUncheckedCreateWithoutProjectInput> | TaskCreateWithoutProjectInput[] | TaskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutProjectInput | TaskCreateOrConnectWithoutProjectInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutProjectInput | TaskUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: TaskCreateManyProjectInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutProjectInput | TaskUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutProjectInput | TaskUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type DeploymentUpdateManyWithoutProjectNestedInput = {
    create?: XOR<DeploymentCreateWithoutProjectInput, DeploymentUncheckedCreateWithoutProjectInput> | DeploymentCreateWithoutProjectInput[] | DeploymentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DeploymentCreateOrConnectWithoutProjectInput | DeploymentCreateOrConnectWithoutProjectInput[]
    upsert?: DeploymentUpsertWithWhereUniqueWithoutProjectInput | DeploymentUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: DeploymentCreateManyProjectInputEnvelope
    set?: DeploymentWhereUniqueInput | DeploymentWhereUniqueInput[]
    disconnect?: DeploymentWhereUniqueInput | DeploymentWhereUniqueInput[]
    delete?: DeploymentWhereUniqueInput | DeploymentWhereUniqueInput[]
    connect?: DeploymentWhereUniqueInput | DeploymentWhereUniqueInput[]
    update?: DeploymentUpdateWithWhereUniqueWithoutProjectInput | DeploymentUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: DeploymentUpdateManyWithWhereWithoutProjectInput | DeploymentUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: DeploymentScalarWhereInput | DeploymentScalarWhereInput[]
  }

  export type QualityGateUpdateManyWithoutProjectNestedInput = {
    create?: XOR<QualityGateCreateWithoutProjectInput, QualityGateUncheckedCreateWithoutProjectInput> | QualityGateCreateWithoutProjectInput[] | QualityGateUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: QualityGateCreateOrConnectWithoutProjectInput | QualityGateCreateOrConnectWithoutProjectInput[]
    upsert?: QualityGateUpsertWithWhereUniqueWithoutProjectInput | QualityGateUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: QualityGateCreateManyProjectInputEnvelope
    set?: QualityGateWhereUniqueInput | QualityGateWhereUniqueInput[]
    disconnect?: QualityGateWhereUniqueInput | QualityGateWhereUniqueInput[]
    delete?: QualityGateWhereUniqueInput | QualityGateWhereUniqueInput[]
    connect?: QualityGateWhereUniqueInput | QualityGateWhereUniqueInput[]
    update?: QualityGateUpdateWithWhereUniqueWithoutProjectInput | QualityGateUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: QualityGateUpdateManyWithWhereWithoutProjectInput | QualityGateUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: QualityGateScalarWhereInput | QualityGateScalarWhereInput[]
  }

  export type ProjectFileUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput> | ProjectFileCreateWithoutProjectInput[] | ProjectFileUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutProjectInput | ProjectFileCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectFileUpsertWithWhereUniqueWithoutProjectInput | ProjectFileUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectFileCreateManyProjectInputEnvelope
    set?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    disconnect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    delete?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    update?: ProjectFileUpdateWithWhereUniqueWithoutProjectInput | ProjectFileUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectFileUpdateManyWithWhereWithoutProjectInput | ProjectFileUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<TaskCreateWithoutProjectInput, TaskUncheckedCreateWithoutProjectInput> | TaskCreateWithoutProjectInput[] | TaskUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutProjectInput | TaskCreateOrConnectWithoutProjectInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutProjectInput | TaskUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: TaskCreateManyProjectInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutProjectInput | TaskUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutProjectInput | TaskUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type DeploymentUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<DeploymentCreateWithoutProjectInput, DeploymentUncheckedCreateWithoutProjectInput> | DeploymentCreateWithoutProjectInput[] | DeploymentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DeploymentCreateOrConnectWithoutProjectInput | DeploymentCreateOrConnectWithoutProjectInput[]
    upsert?: DeploymentUpsertWithWhereUniqueWithoutProjectInput | DeploymentUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: DeploymentCreateManyProjectInputEnvelope
    set?: DeploymentWhereUniqueInput | DeploymentWhereUniqueInput[]
    disconnect?: DeploymentWhereUniqueInput | DeploymentWhereUniqueInput[]
    delete?: DeploymentWhereUniqueInput | DeploymentWhereUniqueInput[]
    connect?: DeploymentWhereUniqueInput | DeploymentWhereUniqueInput[]
    update?: DeploymentUpdateWithWhereUniqueWithoutProjectInput | DeploymentUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: DeploymentUpdateManyWithWhereWithoutProjectInput | DeploymentUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: DeploymentScalarWhereInput | DeploymentScalarWhereInput[]
  }

  export type QualityGateUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<QualityGateCreateWithoutProjectInput, QualityGateUncheckedCreateWithoutProjectInput> | QualityGateCreateWithoutProjectInput[] | QualityGateUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: QualityGateCreateOrConnectWithoutProjectInput | QualityGateCreateOrConnectWithoutProjectInput[]
    upsert?: QualityGateUpsertWithWhereUniqueWithoutProjectInput | QualityGateUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: QualityGateCreateManyProjectInputEnvelope
    set?: QualityGateWhereUniqueInput | QualityGateWhereUniqueInput[]
    disconnect?: QualityGateWhereUniqueInput | QualityGateWhereUniqueInput[]
    delete?: QualityGateWhereUniqueInput | QualityGateWhereUniqueInput[]
    connect?: QualityGateWhereUniqueInput | QualityGateWhereUniqueInput[]
    update?: QualityGateUpdateWithWhereUniqueWithoutProjectInput | QualityGateUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: QualityGateUpdateManyWithWhereWithoutProjectInput | QualityGateUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: QualityGateScalarWhereInput | QualityGateScalarWhereInput[]
  }

  export type ProjectFileUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput> | ProjectFileCreateWithoutProjectInput[] | ProjectFileUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectFileCreateOrConnectWithoutProjectInput | ProjectFileCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectFileUpsertWithWhereUniqueWithoutProjectInput | ProjectFileUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectFileCreateManyProjectInputEnvelope
    set?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    disconnect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    delete?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    connect?: ProjectFileWhereUniqueInput | ProjectFileWhereUniqueInput[]
    update?: ProjectFileUpdateWithWhereUniqueWithoutProjectInput | ProjectFileUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectFileUpdateManyWithWhereWithoutProjectInput | ProjectFileUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
  }

  export type ProjectCreateNestedOneWithoutTasksInput = {
    create?: XOR<ProjectCreateWithoutTasksInput, ProjectUncheckedCreateWithoutTasksInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutTasksInput
    connect?: ProjectWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTasksInput = {
    create?: XOR<UserCreateWithoutTasksInput, UserUncheckedCreateWithoutTasksInput>
    connectOrCreate?: UserCreateOrConnectWithoutTasksInput
    connect?: UserWhereUniqueInput
  }

  export type QualityGateCreateNestedManyWithoutTaskInput = {
    create?: XOR<QualityGateCreateWithoutTaskInput, QualityGateUncheckedCreateWithoutTaskInput> | QualityGateCreateWithoutTaskInput[] | QualityGateUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: QualityGateCreateOrConnectWithoutTaskInput | QualityGateCreateOrConnectWithoutTaskInput[]
    createMany?: QualityGateCreateManyTaskInputEnvelope
    connect?: QualityGateWhereUniqueInput | QualityGateWhereUniqueInput[]
  }

  export type TaskExecutionCreateNestedManyWithoutTaskInput = {
    create?: XOR<TaskExecutionCreateWithoutTaskInput, TaskExecutionUncheckedCreateWithoutTaskInput> | TaskExecutionCreateWithoutTaskInput[] | TaskExecutionUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: TaskExecutionCreateOrConnectWithoutTaskInput | TaskExecutionCreateOrConnectWithoutTaskInput[]
    createMany?: TaskExecutionCreateManyTaskInputEnvelope
    connect?: TaskExecutionWhereUniqueInput | TaskExecutionWhereUniqueInput[]
  }

  export type QualityGateUncheckedCreateNestedManyWithoutTaskInput = {
    create?: XOR<QualityGateCreateWithoutTaskInput, QualityGateUncheckedCreateWithoutTaskInput> | QualityGateCreateWithoutTaskInput[] | QualityGateUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: QualityGateCreateOrConnectWithoutTaskInput | QualityGateCreateOrConnectWithoutTaskInput[]
    createMany?: QualityGateCreateManyTaskInputEnvelope
    connect?: QualityGateWhereUniqueInput | QualityGateWhereUniqueInput[]
  }

  export type TaskExecutionUncheckedCreateNestedManyWithoutTaskInput = {
    create?: XOR<TaskExecutionCreateWithoutTaskInput, TaskExecutionUncheckedCreateWithoutTaskInput> | TaskExecutionCreateWithoutTaskInput[] | TaskExecutionUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: TaskExecutionCreateOrConnectWithoutTaskInput | TaskExecutionCreateOrConnectWithoutTaskInput[]
    createMany?: TaskExecutionCreateManyTaskInputEnvelope
    connect?: TaskExecutionWhereUniqueInput | TaskExecutionWhereUniqueInput[]
  }

  export type EnumTaskStatusFieldUpdateOperationsInput = {
    set?: $Enums.TaskStatus
  }

  export type EnumPriorityFieldUpdateOperationsInput = {
    set?: $Enums.Priority
  }

  export type EnumAIProviderFieldUpdateOperationsInput = {
    set?: $Enums.AIProvider
  }

  export type EnumTaskTypeFieldUpdateOperationsInput = {
    set?: $Enums.TaskType
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ProjectUpdateOneRequiredWithoutTasksNestedInput = {
    create?: XOR<ProjectCreateWithoutTasksInput, ProjectUncheckedCreateWithoutTasksInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutTasksInput
    upsert?: ProjectUpsertWithoutTasksInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutTasksInput, ProjectUpdateWithoutTasksInput>, ProjectUncheckedUpdateWithoutTasksInput>
  }

  export type UserUpdateOneRequiredWithoutTasksNestedInput = {
    create?: XOR<UserCreateWithoutTasksInput, UserUncheckedCreateWithoutTasksInput>
    connectOrCreate?: UserCreateOrConnectWithoutTasksInput
    upsert?: UserUpsertWithoutTasksInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTasksInput, UserUpdateWithoutTasksInput>, UserUncheckedUpdateWithoutTasksInput>
  }

  export type QualityGateUpdateManyWithoutTaskNestedInput = {
    create?: XOR<QualityGateCreateWithoutTaskInput, QualityGateUncheckedCreateWithoutTaskInput> | QualityGateCreateWithoutTaskInput[] | QualityGateUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: QualityGateCreateOrConnectWithoutTaskInput | QualityGateCreateOrConnectWithoutTaskInput[]
    upsert?: QualityGateUpsertWithWhereUniqueWithoutTaskInput | QualityGateUpsertWithWhereUniqueWithoutTaskInput[]
    createMany?: QualityGateCreateManyTaskInputEnvelope
    set?: QualityGateWhereUniqueInput | QualityGateWhereUniqueInput[]
    disconnect?: QualityGateWhereUniqueInput | QualityGateWhereUniqueInput[]
    delete?: QualityGateWhereUniqueInput | QualityGateWhereUniqueInput[]
    connect?: QualityGateWhereUniqueInput | QualityGateWhereUniqueInput[]
    update?: QualityGateUpdateWithWhereUniqueWithoutTaskInput | QualityGateUpdateWithWhereUniqueWithoutTaskInput[]
    updateMany?: QualityGateUpdateManyWithWhereWithoutTaskInput | QualityGateUpdateManyWithWhereWithoutTaskInput[]
    deleteMany?: QualityGateScalarWhereInput | QualityGateScalarWhereInput[]
  }

  export type TaskExecutionUpdateManyWithoutTaskNestedInput = {
    create?: XOR<TaskExecutionCreateWithoutTaskInput, TaskExecutionUncheckedCreateWithoutTaskInput> | TaskExecutionCreateWithoutTaskInput[] | TaskExecutionUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: TaskExecutionCreateOrConnectWithoutTaskInput | TaskExecutionCreateOrConnectWithoutTaskInput[]
    upsert?: TaskExecutionUpsertWithWhereUniqueWithoutTaskInput | TaskExecutionUpsertWithWhereUniqueWithoutTaskInput[]
    createMany?: TaskExecutionCreateManyTaskInputEnvelope
    set?: TaskExecutionWhereUniqueInput | TaskExecutionWhereUniqueInput[]
    disconnect?: TaskExecutionWhereUniqueInput | TaskExecutionWhereUniqueInput[]
    delete?: TaskExecutionWhereUniqueInput | TaskExecutionWhereUniqueInput[]
    connect?: TaskExecutionWhereUniqueInput | TaskExecutionWhereUniqueInput[]
    update?: TaskExecutionUpdateWithWhereUniqueWithoutTaskInput | TaskExecutionUpdateWithWhereUniqueWithoutTaskInput[]
    updateMany?: TaskExecutionUpdateManyWithWhereWithoutTaskInput | TaskExecutionUpdateManyWithWhereWithoutTaskInput[]
    deleteMany?: TaskExecutionScalarWhereInput | TaskExecutionScalarWhereInput[]
  }

  export type QualityGateUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: XOR<QualityGateCreateWithoutTaskInput, QualityGateUncheckedCreateWithoutTaskInput> | QualityGateCreateWithoutTaskInput[] | QualityGateUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: QualityGateCreateOrConnectWithoutTaskInput | QualityGateCreateOrConnectWithoutTaskInput[]
    upsert?: QualityGateUpsertWithWhereUniqueWithoutTaskInput | QualityGateUpsertWithWhereUniqueWithoutTaskInput[]
    createMany?: QualityGateCreateManyTaskInputEnvelope
    set?: QualityGateWhereUniqueInput | QualityGateWhereUniqueInput[]
    disconnect?: QualityGateWhereUniqueInput | QualityGateWhereUniqueInput[]
    delete?: QualityGateWhereUniqueInput | QualityGateWhereUniqueInput[]
    connect?: QualityGateWhereUniqueInput | QualityGateWhereUniqueInput[]
    update?: QualityGateUpdateWithWhereUniqueWithoutTaskInput | QualityGateUpdateWithWhereUniqueWithoutTaskInput[]
    updateMany?: QualityGateUpdateManyWithWhereWithoutTaskInput | QualityGateUpdateManyWithWhereWithoutTaskInput[]
    deleteMany?: QualityGateScalarWhereInput | QualityGateScalarWhereInput[]
  }

  export type TaskExecutionUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: XOR<TaskExecutionCreateWithoutTaskInput, TaskExecutionUncheckedCreateWithoutTaskInput> | TaskExecutionCreateWithoutTaskInput[] | TaskExecutionUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: TaskExecutionCreateOrConnectWithoutTaskInput | TaskExecutionCreateOrConnectWithoutTaskInput[]
    upsert?: TaskExecutionUpsertWithWhereUniqueWithoutTaskInput | TaskExecutionUpsertWithWhereUniqueWithoutTaskInput[]
    createMany?: TaskExecutionCreateManyTaskInputEnvelope
    set?: TaskExecutionWhereUniqueInput | TaskExecutionWhereUniqueInput[]
    disconnect?: TaskExecutionWhereUniqueInput | TaskExecutionWhereUniqueInput[]
    delete?: TaskExecutionWhereUniqueInput | TaskExecutionWhereUniqueInput[]
    connect?: TaskExecutionWhereUniqueInput | TaskExecutionWhereUniqueInput[]
    update?: TaskExecutionUpdateWithWhereUniqueWithoutTaskInput | TaskExecutionUpdateWithWhereUniqueWithoutTaskInput[]
    updateMany?: TaskExecutionUpdateManyWithWhereWithoutTaskInput | TaskExecutionUpdateManyWithWhereWithoutTaskInput[]
    deleteMany?: TaskExecutionScalarWhereInput | TaskExecutionScalarWhereInput[]
  }

  export type TaskCreateNestedOneWithoutExecutionsInput = {
    create?: XOR<TaskCreateWithoutExecutionsInput, TaskUncheckedCreateWithoutExecutionsInput>
    connectOrCreate?: TaskCreateOrConnectWithoutExecutionsInput
    connect?: TaskWhereUniqueInput
  }

  export type EnumExecutionStatusFieldUpdateOperationsInput = {
    set?: $Enums.ExecutionStatus
  }

  export type TaskUpdateOneRequiredWithoutExecutionsNestedInput = {
    create?: XOR<TaskCreateWithoutExecutionsInput, TaskUncheckedCreateWithoutExecutionsInput>
    connectOrCreate?: TaskCreateOrConnectWithoutExecutionsInput
    upsert?: TaskUpsertWithoutExecutionsInput
    connect?: TaskWhereUniqueInput
    update?: XOR<XOR<TaskUpdateToOneWithWhereWithoutExecutionsInput, TaskUpdateWithoutExecutionsInput>, TaskUncheckedUpdateWithoutExecutionsInput>
  }

  export type ProjectCreateNestedOneWithoutQualityGatesInput = {
    create?: XOR<ProjectCreateWithoutQualityGatesInput, ProjectUncheckedCreateWithoutQualityGatesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutQualityGatesInput
    connect?: ProjectWhereUniqueInput
  }

  export type TaskCreateNestedOneWithoutQualityGatesInput = {
    create?: XOR<TaskCreateWithoutQualityGatesInput, TaskUncheckedCreateWithoutQualityGatesInput>
    connectOrCreate?: TaskCreateOrConnectWithoutQualityGatesInput
    connect?: TaskWhereUniqueInput
  }

  export type EnumQualityGateTypeFieldUpdateOperationsInput = {
    set?: $Enums.QualityGateType
  }

  export type EnumQualityStatusFieldUpdateOperationsInput = {
    set?: $Enums.QualityStatus
  }

  export type ProjectUpdateOneRequiredWithoutQualityGatesNestedInput = {
    create?: XOR<ProjectCreateWithoutQualityGatesInput, ProjectUncheckedCreateWithoutQualityGatesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutQualityGatesInput
    upsert?: ProjectUpsertWithoutQualityGatesInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutQualityGatesInput, ProjectUpdateWithoutQualityGatesInput>, ProjectUncheckedUpdateWithoutQualityGatesInput>
  }

  export type TaskUpdateOneWithoutQualityGatesNestedInput = {
    create?: XOR<TaskCreateWithoutQualityGatesInput, TaskUncheckedCreateWithoutQualityGatesInput>
    connectOrCreate?: TaskCreateOrConnectWithoutQualityGatesInput
    upsert?: TaskUpsertWithoutQualityGatesInput
    disconnect?: TaskWhereInput | boolean
    delete?: TaskWhereInput | boolean
    connect?: TaskWhereUniqueInput
    update?: XOR<XOR<TaskUpdateToOneWithWhereWithoutQualityGatesInput, TaskUpdateWithoutQualityGatesInput>, TaskUncheckedUpdateWithoutQualityGatesInput>
  }

  export type TeamMemberCreateNestedManyWithoutTeamInput = {
    create?: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput> | TeamMemberCreateWithoutTeamInput[] | TeamMemberUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutTeamInput | TeamMemberCreateOrConnectWithoutTeamInput[]
    createMany?: TeamMemberCreateManyTeamInputEnvelope
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
  }

  export type TeamMemberUncheckedCreateNestedManyWithoutTeamInput = {
    create?: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput> | TeamMemberCreateWithoutTeamInput[] | TeamMemberUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutTeamInput | TeamMemberCreateOrConnectWithoutTeamInput[]
    createMany?: TeamMemberCreateManyTeamInputEnvelope
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
  }

  export type EnumTeamStatusFieldUpdateOperationsInput = {
    set?: $Enums.TeamStatus
  }

  export type TeamMemberUpdateManyWithoutTeamNestedInput = {
    create?: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput> | TeamMemberCreateWithoutTeamInput[] | TeamMemberUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutTeamInput | TeamMemberCreateOrConnectWithoutTeamInput[]
    upsert?: TeamMemberUpsertWithWhereUniqueWithoutTeamInput | TeamMemberUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: TeamMemberCreateManyTeamInputEnvelope
    set?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    disconnect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    delete?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    update?: TeamMemberUpdateWithWhereUniqueWithoutTeamInput | TeamMemberUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: TeamMemberUpdateManyWithWhereWithoutTeamInput | TeamMemberUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
  }

  export type TeamMemberUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput> | TeamMemberCreateWithoutTeamInput[] | TeamMemberUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutTeamInput | TeamMemberCreateOrConnectWithoutTeamInput[]
    upsert?: TeamMemberUpsertWithWhereUniqueWithoutTeamInput | TeamMemberUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: TeamMemberCreateManyTeamInputEnvelope
    set?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    disconnect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    delete?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    update?: TeamMemberUpdateWithWhereUniqueWithoutTeamInput | TeamMemberUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: TeamMemberUpdateManyWithWhereWithoutTeamInput | TeamMemberUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
  }

  export type AITeamCreateNestedOneWithoutMembersInput = {
    create?: XOR<AITeamCreateWithoutMembersInput, AITeamUncheckedCreateWithoutMembersInput>
    connectOrCreate?: AITeamCreateOrConnectWithoutMembersInput
    connect?: AITeamWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTeamMembersInput = {
    create?: XOR<UserCreateWithoutTeamMembersInput, UserUncheckedCreateWithoutTeamMembersInput>
    connectOrCreate?: UserCreateOrConnectWithoutTeamMembersInput
    connect?: UserWhereUniqueInput
  }

  export type EnumMemberRoleFieldUpdateOperationsInput = {
    set?: $Enums.MemberRole
  }

  export type AITeamUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<AITeamCreateWithoutMembersInput, AITeamUncheckedCreateWithoutMembersInput>
    connectOrCreate?: AITeamCreateOrConnectWithoutMembersInput
    upsert?: AITeamUpsertWithoutMembersInput
    connect?: AITeamWhereUniqueInput
    update?: XOR<XOR<AITeamUpdateToOneWithWhereWithoutMembersInput, AITeamUpdateWithoutMembersInput>, AITeamUncheckedUpdateWithoutMembersInput>
  }

  export type UserUpdateOneWithoutTeamMembersNestedInput = {
    create?: XOR<UserCreateWithoutTeamMembersInput, UserUncheckedCreateWithoutTeamMembersInput>
    connectOrCreate?: UserCreateOrConnectWithoutTeamMembersInput
    upsert?: UserUpsertWithoutTeamMembersInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTeamMembersInput, UserUpdateWithoutTeamMembersInput>, UserUncheckedUpdateWithoutTeamMembersInput>
  }

  export type ProjectCreateNestedOneWithoutDeploymentsInput = {
    create?: XOR<ProjectCreateWithoutDeploymentsInput, ProjectUncheckedCreateWithoutDeploymentsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutDeploymentsInput
    connect?: ProjectWhereUniqueInput
  }

  export type EnumDeploymentStatusFieldUpdateOperationsInput = {
    set?: $Enums.DeploymentStatus
  }

  export type ProjectUpdateOneRequiredWithoutDeploymentsNestedInput = {
    create?: XOR<ProjectCreateWithoutDeploymentsInput, ProjectUncheckedCreateWithoutDeploymentsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutDeploymentsInput
    upsert?: ProjectUpsertWithoutDeploymentsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutDeploymentsInput, ProjectUpdateWithoutDeploymentsInput>, ProjectUncheckedUpdateWithoutDeploymentsInput>
  }

  export type ProjectCreateNestedOneWithoutFilesInput = {
    create?: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutFilesInput
    connect?: ProjectWhereUniqueInput
  }

  export type ProjectUpdateOneRequiredWithoutFilesNestedInput = {
    create?: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutFilesInput
    upsert?: ProjectUpsertWithoutFilesInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutFilesInput, ProjectUpdateWithoutFilesInput>, ProjectUncheckedUpdateWithoutFilesInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumProjectStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectStatusFilter<$PrismaModel> | $Enums.ProjectStatus
  }

  export type NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProjectStatus[] | ListEnumProjectStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProjectStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectStatusFilter<$PrismaModel>
    _max?: NestedEnumProjectStatusFilter<$PrismaModel>
  }

  export type NestedEnumTaskStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusFilter<$PrismaModel> | $Enums.TaskStatus
  }

  export type NestedEnumPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | EnumPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityFilter<$PrismaModel> | $Enums.Priority
  }

  export type NestedEnumAIProviderFilter<$PrismaModel = never> = {
    equals?: $Enums.AIProvider | EnumAIProviderFieldRefInput<$PrismaModel>
    in?: $Enums.AIProvider[] | ListEnumAIProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.AIProvider[] | ListEnumAIProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumAIProviderFilter<$PrismaModel> | $Enums.AIProvider
  }

  export type NestedEnumTaskTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskType | EnumTaskTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTypeFilter<$PrismaModel> | $Enums.TaskType
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel> | $Enums.TaskStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskStatusFilter<$PrismaModel>
    _max?: NestedEnumTaskStatusFilter<$PrismaModel>
  }

  export type NestedEnumPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | EnumPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumPriorityWithAggregatesFilter<$PrismaModel> | $Enums.Priority
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPriorityFilter<$PrismaModel>
    _max?: NestedEnumPriorityFilter<$PrismaModel>
  }

  export type NestedEnumAIProviderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AIProvider | EnumAIProviderFieldRefInput<$PrismaModel>
    in?: $Enums.AIProvider[] | ListEnumAIProviderFieldRefInput<$PrismaModel>
    notIn?: $Enums.AIProvider[] | ListEnumAIProviderFieldRefInput<$PrismaModel>
    not?: NestedEnumAIProviderWithAggregatesFilter<$PrismaModel> | $Enums.AIProvider
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAIProviderFilter<$PrismaModel>
    _max?: NestedEnumAIProviderFilter<$PrismaModel>
  }

  export type NestedEnumTaskTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskType | EnumTaskTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskType[] | ListEnumTaskTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskTypeWithAggregatesFilter<$PrismaModel> | $Enums.TaskType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskTypeFilter<$PrismaModel>
    _max?: NestedEnumTaskTypeFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumExecutionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ExecutionStatus | EnumExecutionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExecutionStatus[] | ListEnumExecutionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExecutionStatus[] | ListEnumExecutionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExecutionStatusFilter<$PrismaModel> | $Enums.ExecutionStatus
  }

  export type NestedEnumExecutionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExecutionStatus | EnumExecutionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExecutionStatus[] | ListEnumExecutionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExecutionStatus[] | ListEnumExecutionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExecutionStatusWithAggregatesFilter<$PrismaModel> | $Enums.ExecutionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumExecutionStatusFilter<$PrismaModel>
    _max?: NestedEnumExecutionStatusFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumQualityGateTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.QualityGateType | EnumQualityGateTypeFieldRefInput<$PrismaModel>
    in?: $Enums.QualityGateType[] | ListEnumQualityGateTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.QualityGateType[] | ListEnumQualityGateTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQualityGateTypeFilter<$PrismaModel> | $Enums.QualityGateType
  }

  export type NestedEnumQualityStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.QualityStatus | EnumQualityStatusFieldRefInput<$PrismaModel>
    in?: $Enums.QualityStatus[] | ListEnumQualityStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.QualityStatus[] | ListEnumQualityStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumQualityStatusFilter<$PrismaModel> | $Enums.QualityStatus
  }

  export type NestedEnumQualityGateTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QualityGateType | EnumQualityGateTypeFieldRefInput<$PrismaModel>
    in?: $Enums.QualityGateType[] | ListEnumQualityGateTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.QualityGateType[] | ListEnumQualityGateTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQualityGateTypeWithAggregatesFilter<$PrismaModel> | $Enums.QualityGateType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQualityGateTypeFilter<$PrismaModel>
    _max?: NestedEnumQualityGateTypeFilter<$PrismaModel>
  }

  export type NestedEnumQualityStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QualityStatus | EnumQualityStatusFieldRefInput<$PrismaModel>
    in?: $Enums.QualityStatus[] | ListEnumQualityStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.QualityStatus[] | ListEnumQualityStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumQualityStatusWithAggregatesFilter<$PrismaModel> | $Enums.QualityStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQualityStatusFilter<$PrismaModel>
    _max?: NestedEnumQualityStatusFilter<$PrismaModel>
  }

  export type NestedEnumTeamStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TeamStatus | EnumTeamStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TeamStatus[] | ListEnumTeamStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TeamStatus[] | ListEnumTeamStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTeamStatusFilter<$PrismaModel> | $Enums.TeamStatus
  }

  export type NestedEnumTeamStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TeamStatus | EnumTeamStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TeamStatus[] | ListEnumTeamStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TeamStatus[] | ListEnumTeamStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTeamStatusWithAggregatesFilter<$PrismaModel> | $Enums.TeamStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTeamStatusFilter<$PrismaModel>
    _max?: NestedEnumTeamStatusFilter<$PrismaModel>
  }

  export type NestedEnumMemberRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.MemberRole | EnumMemberRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MemberRole[] | ListEnumMemberRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MemberRole[] | ListEnumMemberRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMemberRoleFilter<$PrismaModel> | $Enums.MemberRole
  }

  export type NestedEnumMemberRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MemberRole | EnumMemberRoleFieldRefInput<$PrismaModel>
    in?: $Enums.MemberRole[] | ListEnumMemberRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.MemberRole[] | ListEnumMemberRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumMemberRoleWithAggregatesFilter<$PrismaModel> | $Enums.MemberRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMemberRoleFilter<$PrismaModel>
    _max?: NestedEnumMemberRoleFilter<$PrismaModel>
  }

  export type NestedEnumDeploymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.DeploymentStatus | EnumDeploymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeploymentStatus[] | ListEnumDeploymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeploymentStatus[] | ListEnumDeploymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDeploymentStatusFilter<$PrismaModel> | $Enums.DeploymentStatus
  }

  export type NestedEnumDeploymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DeploymentStatus | EnumDeploymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.DeploymentStatus[] | ListEnumDeploymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.DeploymentStatus[] | ListEnumDeploymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumDeploymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.DeploymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDeploymentStatusFilter<$PrismaModel>
    _max?: NestedEnumDeploymentStatusFilter<$PrismaModel>
  }

  export type ProjectCreateWithoutUserInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.ProjectStatus
    repository?: string | null
    framework?: string | null
    language?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: TaskCreateNestedManyWithoutProjectInput
    deployments?: DeploymentCreateNestedManyWithoutProjectInput
    qualityGates?: QualityGateCreateNestedManyWithoutProjectInput
    files?: ProjectFileCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.ProjectStatus
    repository?: string | null
    framework?: string | null
    language?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: TaskUncheckedCreateNestedManyWithoutProjectInput
    deployments?: DeploymentUncheckedCreateNestedManyWithoutProjectInput
    qualityGates?: QualityGateUncheckedCreateNestedManyWithoutProjectInput
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutUserInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput>
  }

  export type ProjectCreateManyUserInputEnvelope = {
    data: ProjectCreateManyUserInput | ProjectCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TaskCreateWithoutUserInput = {
    id?: string
    title: string
    description?: string | null
    status?: $Enums.TaskStatus
    priority?: $Enums.Priority
    aiProvider: $Enums.AIProvider
    model?: string | null
    type: $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: number | null
    cost?: number | null
    duration?: number | null
    quality?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    project: ProjectCreateNestedOneWithoutTasksInput
    qualityGates?: QualityGateCreateNestedManyWithoutTaskInput
    executions?: TaskExecutionCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    description?: string | null
    status?: $Enums.TaskStatus
    priority?: $Enums.Priority
    aiProvider: $Enums.AIProvider
    model?: string | null
    type: $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: number | null
    cost?: number | null
    duration?: number | null
    quality?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    projectId: string
    qualityGates?: QualityGateUncheckedCreateNestedManyWithoutTaskInput
    executions?: TaskExecutionUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskCreateOrConnectWithoutUserInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutUserInput, TaskUncheckedCreateWithoutUserInput>
  }

  export type TaskCreateManyUserInputEnvelope = {
    data: TaskCreateManyUserInput | TaskCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    sessionId: string
    data?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    sessionId: string
    data?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TeamMemberCreateWithoutUserInput = {
    id?: string
    role: $Enums.MemberRole
    aiProvider: $Enums.AIProvider
    model: string
    specialties?: NullableJsonNullValueInput | InputJsonValue
    performance?: NullableJsonNullValueInput | InputJsonValue
    team: AITeamCreateNestedOneWithoutMembersInput
  }

  export type TeamMemberUncheckedCreateWithoutUserInput = {
    id?: string
    role: $Enums.MemberRole
    aiProvider: $Enums.AIProvider
    model: string
    specialties?: NullableJsonNullValueInput | InputJsonValue
    performance?: NullableJsonNullValueInput | InputJsonValue
    teamId: string
  }

  export type TeamMemberCreateOrConnectWithoutUserInput = {
    where: TeamMemberWhereUniqueInput
    create: XOR<TeamMemberCreateWithoutUserInput, TeamMemberUncheckedCreateWithoutUserInput>
  }

  export type TeamMemberCreateManyUserInputEnvelope = {
    data: TeamMemberCreateManyUserInput | TeamMemberCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithWhereUniqueWithoutUserInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutUserInput, ProjectUncheckedUpdateWithoutUserInput>
    create: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutUserInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutUserInput, ProjectUncheckedUpdateWithoutUserInput>
  }

  export type ProjectUpdateManyWithWhereWithoutUserInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutUserInput>
  }

  export type ProjectScalarWhereInput = {
    AND?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    OR?: ProjectScalarWhereInput[]
    NOT?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    id?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    repository?: StringNullableFilter<"Project"> | string | null
    framework?: StringNullableFilter<"Project"> | string | null
    language?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    userId?: StringFilter<"Project"> | string
  }

  export type TaskUpsertWithWhereUniqueWithoutUserInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutUserInput, TaskUncheckedUpdateWithoutUserInput>
    create: XOR<TaskCreateWithoutUserInput, TaskUncheckedCreateWithoutUserInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutUserInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutUserInput, TaskUncheckedUpdateWithoutUserInput>
  }

  export type TaskUpdateManyWithWhereWithoutUserInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutUserInput>
  }

  export type TaskScalarWhereInput = {
    AND?: TaskScalarWhereInput | TaskScalarWhereInput[]
    OR?: TaskScalarWhereInput[]
    NOT?: TaskScalarWhereInput | TaskScalarWhereInput[]
    id?: StringFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    description?: StringNullableFilter<"Task"> | string | null
    status?: EnumTaskStatusFilter<"Task"> | $Enums.TaskStatus
    priority?: EnumPriorityFilter<"Task"> | $Enums.Priority
    aiProvider?: EnumAIProviderFilter<"Task"> | $Enums.AIProvider
    model?: StringNullableFilter<"Task"> | string | null
    type?: EnumTaskTypeFilter<"Task"> | $Enums.TaskType
    context?: JsonNullableFilter<"Task">
    requirements?: JsonNullableFilter<"Task">
    constraints?: JsonNullableFilter<"Task">
    result?: JsonNullableFilter<"Task">
    diff?: StringNullableFilter<"Task"> | string | null
    artifacts?: JsonNullableFilter<"Task">
    tokenUsage?: IntNullableFilter<"Task"> | number | null
    cost?: FloatNullableFilter<"Task"> | number | null
    duration?: IntNullableFilter<"Task"> | number | null
    quality?: FloatNullableFilter<"Task"> | number | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeFilter<"Task"> | Date | string
    completedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    projectId?: StringFilter<"Task"> | string
    userId?: StringFilter<"Task"> | string
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionId?: StringFilter<"Session"> | string
    data?: JsonNullableFilter<"Session">
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    createdAt?: DateTimeFilter<"Session"> | Date | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    userId?: StringFilter<"Session"> | string
  }

  export type TeamMemberUpsertWithWhereUniqueWithoutUserInput = {
    where: TeamMemberWhereUniqueInput
    update: XOR<TeamMemberUpdateWithoutUserInput, TeamMemberUncheckedUpdateWithoutUserInput>
    create: XOR<TeamMemberCreateWithoutUserInput, TeamMemberUncheckedCreateWithoutUserInput>
  }

  export type TeamMemberUpdateWithWhereUniqueWithoutUserInput = {
    where: TeamMemberWhereUniqueInput
    data: XOR<TeamMemberUpdateWithoutUserInput, TeamMemberUncheckedUpdateWithoutUserInput>
  }

  export type TeamMemberUpdateManyWithWhereWithoutUserInput = {
    where: TeamMemberScalarWhereInput
    data: XOR<TeamMemberUpdateManyMutationInput, TeamMemberUncheckedUpdateManyWithoutUserInput>
  }

  export type TeamMemberScalarWhereInput = {
    AND?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
    OR?: TeamMemberScalarWhereInput[]
    NOT?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
    id?: StringFilter<"TeamMember"> | string
    role?: EnumMemberRoleFilter<"TeamMember"> | $Enums.MemberRole
    aiProvider?: EnumAIProviderFilter<"TeamMember"> | $Enums.AIProvider
    model?: StringFilter<"TeamMember"> | string
    specialties?: JsonNullableFilter<"TeamMember">
    performance?: JsonNullableFilter<"TeamMember">
    teamId?: StringFilter<"TeamMember"> | string
    userId?: StringNullableFilter<"TeamMember"> | string | null
  }

  export type UserCreateWithoutProjectsInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: TaskCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    teamMembers?: TeamMemberCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutProjectsInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tasks?: TaskUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    teamMembers?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutProjectsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
  }

  export type TaskCreateWithoutProjectInput = {
    id?: string
    title: string
    description?: string | null
    status?: $Enums.TaskStatus
    priority?: $Enums.Priority
    aiProvider: $Enums.AIProvider
    model?: string | null
    type: $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: number | null
    cost?: number | null
    duration?: number | null
    quality?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    user: UserCreateNestedOneWithoutTasksInput
    qualityGates?: QualityGateCreateNestedManyWithoutTaskInput
    executions?: TaskExecutionCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateWithoutProjectInput = {
    id?: string
    title: string
    description?: string | null
    status?: $Enums.TaskStatus
    priority?: $Enums.Priority
    aiProvider: $Enums.AIProvider
    model?: string | null
    type: $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: number | null
    cost?: number | null
    duration?: number | null
    quality?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    userId: string
    qualityGates?: QualityGateUncheckedCreateNestedManyWithoutTaskInput
    executions?: TaskExecutionUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskCreateOrConnectWithoutProjectInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutProjectInput, TaskUncheckedCreateWithoutProjectInput>
  }

  export type TaskCreateManyProjectInputEnvelope = {
    data: TaskCreateManyProjectInput | TaskCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type DeploymentCreateWithoutProjectInput = {
    id?: string
    version: string
    status?: $Enums.DeploymentStatus
    environment: string
    config?: NullableJsonNullValueInput | InputJsonValue
    logs?: NullableJsonNullValueInput | InputJsonValue
    url?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deployedAt?: Date | string | null
  }

  export type DeploymentUncheckedCreateWithoutProjectInput = {
    id?: string
    version: string
    status?: $Enums.DeploymentStatus
    environment: string
    config?: NullableJsonNullValueInput | InputJsonValue
    logs?: NullableJsonNullValueInput | InputJsonValue
    url?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deployedAt?: Date | string | null
  }

  export type DeploymentCreateOrConnectWithoutProjectInput = {
    where: DeploymentWhereUniqueInput
    create: XOR<DeploymentCreateWithoutProjectInput, DeploymentUncheckedCreateWithoutProjectInput>
  }

  export type DeploymentCreateManyProjectInputEnvelope = {
    data: DeploymentCreateManyProjectInput | DeploymentCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type QualityGateCreateWithoutProjectInput = {
    id?: string
    name: string
    type: $Enums.QualityGateType
    status?: $Enums.QualityStatus
    rules: JsonNullValueInput | InputJsonValue
    config?: NullableJsonNullValueInput | InputJsonValue
    score?: number | null
    issues?: NullableJsonNullValueInput | InputJsonValue
    report?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    task?: TaskCreateNestedOneWithoutQualityGatesInput
  }

  export type QualityGateUncheckedCreateWithoutProjectInput = {
    id?: string
    name: string
    type: $Enums.QualityGateType
    status?: $Enums.QualityStatus
    rules: JsonNullValueInput | InputJsonValue
    config?: NullableJsonNullValueInput | InputJsonValue
    score?: number | null
    issues?: NullableJsonNullValueInput | InputJsonValue
    report?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    taskId?: string | null
  }

  export type QualityGateCreateOrConnectWithoutProjectInput = {
    where: QualityGateWhereUniqueInput
    create: XOR<QualityGateCreateWithoutProjectInput, QualityGateUncheckedCreateWithoutProjectInput>
  }

  export type QualityGateCreateManyProjectInputEnvelope = {
    data: QualityGateCreateManyProjectInput | QualityGateCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type ProjectFileCreateWithoutProjectInput = {
    id?: string
    path: string
    name: string
    type?: string | null
    size?: number | null
    checksum?: string | null
    language?: string | null
    framework?: string | null
    purpose?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectFileUncheckedCreateWithoutProjectInput = {
    id?: string
    path: string
    name: string
    type?: string | null
    size?: number | null
    checksum?: string | null
    language?: string | null
    framework?: string | null
    purpose?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectFileCreateOrConnectWithoutProjectInput = {
    where: ProjectFileWhereUniqueInput
    create: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput>
  }

  export type ProjectFileCreateManyProjectInputEnvelope = {
    data: ProjectFileCreateManyProjectInput | ProjectFileCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutProjectsInput = {
    update: XOR<UserUpdateWithoutProjectsInput, UserUncheckedUpdateWithoutProjectsInput>
    create: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProjectsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProjectsInput, UserUncheckedUpdateWithoutProjectsInput>
  }

  export type UserUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: TaskUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    teamMembers?: TeamMemberUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: TaskUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    teamMembers?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TaskUpsertWithWhereUniqueWithoutProjectInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutProjectInput, TaskUncheckedUpdateWithoutProjectInput>
    create: XOR<TaskCreateWithoutProjectInput, TaskUncheckedCreateWithoutProjectInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutProjectInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutProjectInput, TaskUncheckedUpdateWithoutProjectInput>
  }

  export type TaskUpdateManyWithWhereWithoutProjectInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutProjectInput>
  }

  export type DeploymentUpsertWithWhereUniqueWithoutProjectInput = {
    where: DeploymentWhereUniqueInput
    update: XOR<DeploymentUpdateWithoutProjectInput, DeploymentUncheckedUpdateWithoutProjectInput>
    create: XOR<DeploymentCreateWithoutProjectInput, DeploymentUncheckedCreateWithoutProjectInput>
  }

  export type DeploymentUpdateWithWhereUniqueWithoutProjectInput = {
    where: DeploymentWhereUniqueInput
    data: XOR<DeploymentUpdateWithoutProjectInput, DeploymentUncheckedUpdateWithoutProjectInput>
  }

  export type DeploymentUpdateManyWithWhereWithoutProjectInput = {
    where: DeploymentScalarWhereInput
    data: XOR<DeploymentUpdateManyMutationInput, DeploymentUncheckedUpdateManyWithoutProjectInput>
  }

  export type DeploymentScalarWhereInput = {
    AND?: DeploymentScalarWhereInput | DeploymentScalarWhereInput[]
    OR?: DeploymentScalarWhereInput[]
    NOT?: DeploymentScalarWhereInput | DeploymentScalarWhereInput[]
    id?: StringFilter<"Deployment"> | string
    version?: StringFilter<"Deployment"> | string
    status?: EnumDeploymentStatusFilter<"Deployment"> | $Enums.DeploymentStatus
    environment?: StringFilter<"Deployment"> | string
    config?: JsonNullableFilter<"Deployment">
    logs?: JsonNullableFilter<"Deployment">
    url?: StringNullableFilter<"Deployment"> | string | null
    createdAt?: DateTimeFilter<"Deployment"> | Date | string
    updatedAt?: DateTimeFilter<"Deployment"> | Date | string
    deployedAt?: DateTimeNullableFilter<"Deployment"> | Date | string | null
    projectId?: StringFilter<"Deployment"> | string
  }

  export type QualityGateUpsertWithWhereUniqueWithoutProjectInput = {
    where: QualityGateWhereUniqueInput
    update: XOR<QualityGateUpdateWithoutProjectInput, QualityGateUncheckedUpdateWithoutProjectInput>
    create: XOR<QualityGateCreateWithoutProjectInput, QualityGateUncheckedCreateWithoutProjectInput>
  }

  export type QualityGateUpdateWithWhereUniqueWithoutProjectInput = {
    where: QualityGateWhereUniqueInput
    data: XOR<QualityGateUpdateWithoutProjectInput, QualityGateUncheckedUpdateWithoutProjectInput>
  }

  export type QualityGateUpdateManyWithWhereWithoutProjectInput = {
    where: QualityGateScalarWhereInput
    data: XOR<QualityGateUpdateManyMutationInput, QualityGateUncheckedUpdateManyWithoutProjectInput>
  }

  export type QualityGateScalarWhereInput = {
    AND?: QualityGateScalarWhereInput | QualityGateScalarWhereInput[]
    OR?: QualityGateScalarWhereInput[]
    NOT?: QualityGateScalarWhereInput | QualityGateScalarWhereInput[]
    id?: StringFilter<"QualityGate"> | string
    name?: StringFilter<"QualityGate"> | string
    type?: EnumQualityGateTypeFilter<"QualityGate"> | $Enums.QualityGateType
    status?: EnumQualityStatusFilter<"QualityGate"> | $Enums.QualityStatus
    rules?: JsonFilter<"QualityGate">
    config?: JsonNullableFilter<"QualityGate">
    score?: FloatNullableFilter<"QualityGate"> | number | null
    issues?: JsonNullableFilter<"QualityGate">
    report?: JsonNullableFilter<"QualityGate">
    createdAt?: DateTimeFilter<"QualityGate"> | Date | string
    updatedAt?: DateTimeFilter<"QualityGate"> | Date | string
    projectId?: StringFilter<"QualityGate"> | string
    taskId?: StringNullableFilter<"QualityGate"> | string | null
  }

  export type ProjectFileUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProjectFileWhereUniqueInput
    update: XOR<ProjectFileUpdateWithoutProjectInput, ProjectFileUncheckedUpdateWithoutProjectInput>
    create: XOR<ProjectFileCreateWithoutProjectInput, ProjectFileUncheckedCreateWithoutProjectInput>
  }

  export type ProjectFileUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProjectFileWhereUniqueInput
    data: XOR<ProjectFileUpdateWithoutProjectInput, ProjectFileUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectFileUpdateManyWithWhereWithoutProjectInput = {
    where: ProjectFileScalarWhereInput
    data: XOR<ProjectFileUpdateManyMutationInput, ProjectFileUncheckedUpdateManyWithoutProjectInput>
  }

  export type ProjectFileScalarWhereInput = {
    AND?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
    OR?: ProjectFileScalarWhereInput[]
    NOT?: ProjectFileScalarWhereInput | ProjectFileScalarWhereInput[]
    id?: StringFilter<"ProjectFile"> | string
    path?: StringFilter<"ProjectFile"> | string
    name?: StringFilter<"ProjectFile"> | string
    type?: StringNullableFilter<"ProjectFile"> | string | null
    size?: IntNullableFilter<"ProjectFile"> | number | null
    checksum?: StringNullableFilter<"ProjectFile"> | string | null
    language?: StringNullableFilter<"ProjectFile"> | string | null
    framework?: StringNullableFilter<"ProjectFile"> | string | null
    purpose?: StringNullableFilter<"ProjectFile"> | string | null
    createdAt?: DateTimeFilter<"ProjectFile"> | Date | string
    updatedAt?: DateTimeFilter<"ProjectFile"> | Date | string
    projectId?: StringFilter<"ProjectFile"> | string
  }

  export type ProjectCreateWithoutTasksInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.ProjectStatus
    repository?: string | null
    framework?: string | null
    language?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutProjectsInput
    deployments?: DeploymentCreateNestedManyWithoutProjectInput
    qualityGates?: QualityGateCreateNestedManyWithoutProjectInput
    files?: ProjectFileCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutTasksInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.ProjectStatus
    repository?: string | null
    framework?: string | null
    language?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    deployments?: DeploymentUncheckedCreateNestedManyWithoutProjectInput
    qualityGates?: QualityGateUncheckedCreateNestedManyWithoutProjectInput
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutTasksInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutTasksInput, ProjectUncheckedCreateWithoutTasksInput>
  }

  export type UserCreateWithoutTasksInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    teamMembers?: TeamMemberCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTasksInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    teamMembers?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTasksInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTasksInput, UserUncheckedCreateWithoutTasksInput>
  }

  export type QualityGateCreateWithoutTaskInput = {
    id?: string
    name: string
    type: $Enums.QualityGateType
    status?: $Enums.QualityStatus
    rules: JsonNullValueInput | InputJsonValue
    config?: NullableJsonNullValueInput | InputJsonValue
    score?: number | null
    issues?: NullableJsonNullValueInput | InputJsonValue
    report?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutQualityGatesInput
  }

  export type QualityGateUncheckedCreateWithoutTaskInput = {
    id?: string
    name: string
    type: $Enums.QualityGateType
    status?: $Enums.QualityStatus
    rules: JsonNullValueInput | InputJsonValue
    config?: NullableJsonNullValueInput | InputJsonValue
    score?: number | null
    issues?: NullableJsonNullValueInput | InputJsonValue
    report?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    projectId: string
  }

  export type QualityGateCreateOrConnectWithoutTaskInput = {
    where: QualityGateWhereUniqueInput
    create: XOR<QualityGateCreateWithoutTaskInput, QualityGateUncheckedCreateWithoutTaskInput>
  }

  export type QualityGateCreateManyTaskInputEnvelope = {
    data: QualityGateCreateManyTaskInput | QualityGateCreateManyTaskInput[]
    skipDuplicates?: boolean
  }

  export type TaskExecutionCreateWithoutTaskInput = {
    id?: string
    status?: $Enums.ExecutionStatus
    startedAt?: Date | string
    completedAt?: Date | string | null
    input: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    logs?: NullableJsonNullValueInput | InputJsonValue
    metrics?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TaskExecutionUncheckedCreateWithoutTaskInput = {
    id?: string
    status?: $Enums.ExecutionStatus
    startedAt?: Date | string
    completedAt?: Date | string | null
    input: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    logs?: NullableJsonNullValueInput | InputJsonValue
    metrics?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TaskExecutionCreateOrConnectWithoutTaskInput = {
    where: TaskExecutionWhereUniqueInput
    create: XOR<TaskExecutionCreateWithoutTaskInput, TaskExecutionUncheckedCreateWithoutTaskInput>
  }

  export type TaskExecutionCreateManyTaskInputEnvelope = {
    data: TaskExecutionCreateManyTaskInput | TaskExecutionCreateManyTaskInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithoutTasksInput = {
    update: XOR<ProjectUpdateWithoutTasksInput, ProjectUncheckedUpdateWithoutTasksInput>
    create: XOR<ProjectCreateWithoutTasksInput, ProjectUncheckedCreateWithoutTasksInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutTasksInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutTasksInput, ProjectUncheckedUpdateWithoutTasksInput>
  }

  export type ProjectUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    framework?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProjectsNestedInput
    deployments?: DeploymentUpdateManyWithoutProjectNestedInput
    qualityGates?: QualityGateUpdateManyWithoutProjectNestedInput
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    framework?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    deployments?: DeploymentUncheckedUpdateManyWithoutProjectNestedInput
    qualityGates?: QualityGateUncheckedUpdateManyWithoutProjectNestedInput
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type UserUpsertWithoutTasksInput = {
    update: XOR<UserUpdateWithoutTasksInput, UserUncheckedUpdateWithoutTasksInput>
    create: XOR<UserCreateWithoutTasksInput, UserUncheckedCreateWithoutTasksInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTasksInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTasksInput, UserUncheckedUpdateWithoutTasksInput>
  }

  export type UserUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    teamMembers?: TeamMemberUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    teamMembers?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
  }

  export type QualityGateUpsertWithWhereUniqueWithoutTaskInput = {
    where: QualityGateWhereUniqueInput
    update: XOR<QualityGateUpdateWithoutTaskInput, QualityGateUncheckedUpdateWithoutTaskInput>
    create: XOR<QualityGateCreateWithoutTaskInput, QualityGateUncheckedCreateWithoutTaskInput>
  }

  export type QualityGateUpdateWithWhereUniqueWithoutTaskInput = {
    where: QualityGateWhereUniqueInput
    data: XOR<QualityGateUpdateWithoutTaskInput, QualityGateUncheckedUpdateWithoutTaskInput>
  }

  export type QualityGateUpdateManyWithWhereWithoutTaskInput = {
    where: QualityGateScalarWhereInput
    data: XOR<QualityGateUpdateManyMutationInput, QualityGateUncheckedUpdateManyWithoutTaskInput>
  }

  export type TaskExecutionUpsertWithWhereUniqueWithoutTaskInput = {
    where: TaskExecutionWhereUniqueInput
    update: XOR<TaskExecutionUpdateWithoutTaskInput, TaskExecutionUncheckedUpdateWithoutTaskInput>
    create: XOR<TaskExecutionCreateWithoutTaskInput, TaskExecutionUncheckedCreateWithoutTaskInput>
  }

  export type TaskExecutionUpdateWithWhereUniqueWithoutTaskInput = {
    where: TaskExecutionWhereUniqueInput
    data: XOR<TaskExecutionUpdateWithoutTaskInput, TaskExecutionUncheckedUpdateWithoutTaskInput>
  }

  export type TaskExecutionUpdateManyWithWhereWithoutTaskInput = {
    where: TaskExecutionScalarWhereInput
    data: XOR<TaskExecutionUpdateManyMutationInput, TaskExecutionUncheckedUpdateManyWithoutTaskInput>
  }

  export type TaskExecutionScalarWhereInput = {
    AND?: TaskExecutionScalarWhereInput | TaskExecutionScalarWhereInput[]
    OR?: TaskExecutionScalarWhereInput[]
    NOT?: TaskExecutionScalarWhereInput | TaskExecutionScalarWhereInput[]
    id?: StringFilter<"TaskExecution"> | string
    status?: EnumExecutionStatusFilter<"TaskExecution"> | $Enums.ExecutionStatus
    startedAt?: DateTimeFilter<"TaskExecution"> | Date | string
    completedAt?: DateTimeNullableFilter<"TaskExecution"> | Date | string | null
    input?: JsonFilter<"TaskExecution">
    output?: JsonNullableFilter<"TaskExecution">
    errorMessage?: StringNullableFilter<"TaskExecution"> | string | null
    logs?: JsonNullableFilter<"TaskExecution">
    metrics?: JsonNullableFilter<"TaskExecution">
    taskId?: StringFilter<"TaskExecution"> | string
  }

  export type TaskCreateWithoutExecutionsInput = {
    id?: string
    title: string
    description?: string | null
    status?: $Enums.TaskStatus
    priority?: $Enums.Priority
    aiProvider: $Enums.AIProvider
    model?: string | null
    type: $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: number | null
    cost?: number | null
    duration?: number | null
    quality?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    project: ProjectCreateNestedOneWithoutTasksInput
    user: UserCreateNestedOneWithoutTasksInput
    qualityGates?: QualityGateCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateWithoutExecutionsInput = {
    id?: string
    title: string
    description?: string | null
    status?: $Enums.TaskStatus
    priority?: $Enums.Priority
    aiProvider: $Enums.AIProvider
    model?: string | null
    type: $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: number | null
    cost?: number | null
    duration?: number | null
    quality?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    projectId: string
    userId: string
    qualityGates?: QualityGateUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskCreateOrConnectWithoutExecutionsInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutExecutionsInput, TaskUncheckedCreateWithoutExecutionsInput>
  }

  export type TaskUpsertWithoutExecutionsInput = {
    update: XOR<TaskUpdateWithoutExecutionsInput, TaskUncheckedUpdateWithoutExecutionsInput>
    create: XOR<TaskCreateWithoutExecutionsInput, TaskUncheckedCreateWithoutExecutionsInput>
    where?: TaskWhereInput
  }

  export type TaskUpdateToOneWithWhereWithoutExecutionsInput = {
    where?: TaskWhereInput
    data: XOR<TaskUpdateWithoutExecutionsInput, TaskUncheckedUpdateWithoutExecutionsInput>
  }

  export type TaskUpdateWithoutExecutionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: NullableStringFieldUpdateOperationsInput | string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableIntFieldUpdateOperationsInput | number | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    quality?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    project?: ProjectUpdateOneRequiredWithoutTasksNestedInput
    user?: UserUpdateOneRequiredWithoutTasksNestedInput
    qualityGates?: QualityGateUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateWithoutExecutionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: NullableStringFieldUpdateOperationsInput | string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableIntFieldUpdateOperationsInput | number | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    quality?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    projectId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    qualityGates?: QualityGateUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type ProjectCreateWithoutQualityGatesInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.ProjectStatus
    repository?: string | null
    framework?: string | null
    language?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutProjectsInput
    tasks?: TaskCreateNestedManyWithoutProjectInput
    deployments?: DeploymentCreateNestedManyWithoutProjectInput
    files?: ProjectFileCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutQualityGatesInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.ProjectStatus
    repository?: string | null
    framework?: string | null
    language?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    tasks?: TaskUncheckedCreateNestedManyWithoutProjectInput
    deployments?: DeploymentUncheckedCreateNestedManyWithoutProjectInput
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutQualityGatesInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutQualityGatesInput, ProjectUncheckedCreateWithoutQualityGatesInput>
  }

  export type TaskCreateWithoutQualityGatesInput = {
    id?: string
    title: string
    description?: string | null
    status?: $Enums.TaskStatus
    priority?: $Enums.Priority
    aiProvider: $Enums.AIProvider
    model?: string | null
    type: $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: number | null
    cost?: number | null
    duration?: number | null
    quality?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    project: ProjectCreateNestedOneWithoutTasksInput
    user: UserCreateNestedOneWithoutTasksInput
    executions?: TaskExecutionCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateWithoutQualityGatesInput = {
    id?: string
    title: string
    description?: string | null
    status?: $Enums.TaskStatus
    priority?: $Enums.Priority
    aiProvider: $Enums.AIProvider
    model?: string | null
    type: $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: number | null
    cost?: number | null
    duration?: number | null
    quality?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    projectId: string
    userId: string
    executions?: TaskExecutionUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskCreateOrConnectWithoutQualityGatesInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutQualityGatesInput, TaskUncheckedCreateWithoutQualityGatesInput>
  }

  export type ProjectUpsertWithoutQualityGatesInput = {
    update: XOR<ProjectUpdateWithoutQualityGatesInput, ProjectUncheckedUpdateWithoutQualityGatesInput>
    create: XOR<ProjectCreateWithoutQualityGatesInput, ProjectUncheckedCreateWithoutQualityGatesInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutQualityGatesInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutQualityGatesInput, ProjectUncheckedUpdateWithoutQualityGatesInput>
  }

  export type ProjectUpdateWithoutQualityGatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    framework?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProjectsNestedInput
    tasks?: TaskUpdateManyWithoutProjectNestedInput
    deployments?: DeploymentUpdateManyWithoutProjectNestedInput
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutQualityGatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    framework?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    tasks?: TaskUncheckedUpdateManyWithoutProjectNestedInput
    deployments?: DeploymentUncheckedUpdateManyWithoutProjectNestedInput
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type TaskUpsertWithoutQualityGatesInput = {
    update: XOR<TaskUpdateWithoutQualityGatesInput, TaskUncheckedUpdateWithoutQualityGatesInput>
    create: XOR<TaskCreateWithoutQualityGatesInput, TaskUncheckedCreateWithoutQualityGatesInput>
    where?: TaskWhereInput
  }

  export type TaskUpdateToOneWithWhereWithoutQualityGatesInput = {
    where?: TaskWhereInput
    data: XOR<TaskUpdateWithoutQualityGatesInput, TaskUncheckedUpdateWithoutQualityGatesInput>
  }

  export type TaskUpdateWithoutQualityGatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: NullableStringFieldUpdateOperationsInput | string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableIntFieldUpdateOperationsInput | number | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    quality?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    project?: ProjectUpdateOneRequiredWithoutTasksNestedInput
    user?: UserUpdateOneRequiredWithoutTasksNestedInput
    executions?: TaskExecutionUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateWithoutQualityGatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: NullableStringFieldUpdateOperationsInput | string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableIntFieldUpdateOperationsInput | number | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    quality?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    projectId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    executions?: TaskExecutionUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type TeamMemberCreateWithoutTeamInput = {
    id?: string
    role: $Enums.MemberRole
    aiProvider: $Enums.AIProvider
    model: string
    specialties?: NullableJsonNullValueInput | InputJsonValue
    performance?: NullableJsonNullValueInput | InputJsonValue
    user?: UserCreateNestedOneWithoutTeamMembersInput
  }

  export type TeamMemberUncheckedCreateWithoutTeamInput = {
    id?: string
    role: $Enums.MemberRole
    aiProvider: $Enums.AIProvider
    model: string
    specialties?: NullableJsonNullValueInput | InputJsonValue
    performance?: NullableJsonNullValueInput | InputJsonValue
    userId?: string | null
  }

  export type TeamMemberCreateOrConnectWithoutTeamInput = {
    where: TeamMemberWhereUniqueInput
    create: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput>
  }

  export type TeamMemberCreateManyTeamInputEnvelope = {
    data: TeamMemberCreateManyTeamInput | TeamMemberCreateManyTeamInput[]
    skipDuplicates?: boolean
  }

  export type TeamMemberUpsertWithWhereUniqueWithoutTeamInput = {
    where: TeamMemberWhereUniqueInput
    update: XOR<TeamMemberUpdateWithoutTeamInput, TeamMemberUncheckedUpdateWithoutTeamInput>
    create: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput>
  }

  export type TeamMemberUpdateWithWhereUniqueWithoutTeamInput = {
    where: TeamMemberWhereUniqueInput
    data: XOR<TeamMemberUpdateWithoutTeamInput, TeamMemberUncheckedUpdateWithoutTeamInput>
  }

  export type TeamMemberUpdateManyWithWhereWithoutTeamInput = {
    where: TeamMemberScalarWhereInput
    data: XOR<TeamMemberUpdateManyMutationInput, TeamMemberUncheckedUpdateManyWithoutTeamInput>
  }

  export type AITeamCreateWithoutMembersInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.TeamStatus
    strategy: JsonNullValueInput | InputJsonValue
    preferences?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AITeamUncheckedCreateWithoutMembersInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.TeamStatus
    strategy: JsonNullValueInput | InputJsonValue
    preferences?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AITeamCreateOrConnectWithoutMembersInput = {
    where: AITeamWhereUniqueInput
    create: XOR<AITeamCreateWithoutMembersInput, AITeamUncheckedCreateWithoutMembersInput>
  }

  export type UserCreateWithoutTeamMembersInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutUserInput
    tasks?: TaskCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTeamMembersInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutUserInput
    tasks?: TaskUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTeamMembersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTeamMembersInput, UserUncheckedCreateWithoutTeamMembersInput>
  }

  export type AITeamUpsertWithoutMembersInput = {
    update: XOR<AITeamUpdateWithoutMembersInput, AITeamUncheckedUpdateWithoutMembersInput>
    create: XOR<AITeamCreateWithoutMembersInput, AITeamUncheckedCreateWithoutMembersInput>
    where?: AITeamWhereInput
  }

  export type AITeamUpdateToOneWithWhereWithoutMembersInput = {
    where?: AITeamWhereInput
    data: XOR<AITeamUpdateWithoutMembersInput, AITeamUncheckedUpdateWithoutMembersInput>
  }

  export type AITeamUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTeamStatusFieldUpdateOperationsInput | $Enums.TeamStatus
    strategy?: JsonNullValueInput | InputJsonValue
    preferences?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AITeamUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTeamStatusFieldUpdateOperationsInput | $Enums.TeamStatus
    strategy?: JsonNullValueInput | InputJsonValue
    preferences?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutTeamMembersInput = {
    update: XOR<UserUpdateWithoutTeamMembersInput, UserUncheckedUpdateWithoutTeamMembersInput>
    create: XOR<UserCreateWithoutTeamMembersInput, UserUncheckedCreateWithoutTeamMembersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTeamMembersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTeamMembersInput, UserUncheckedUpdateWithoutTeamMembersInput>
  }

  export type UserUpdateWithoutTeamMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutUserNestedInput
    tasks?: TaskUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTeamMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutUserNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProjectCreateWithoutDeploymentsInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.ProjectStatus
    repository?: string | null
    framework?: string | null
    language?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutProjectsInput
    tasks?: TaskCreateNestedManyWithoutProjectInput
    qualityGates?: QualityGateCreateNestedManyWithoutProjectInput
    files?: ProjectFileCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutDeploymentsInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.ProjectStatus
    repository?: string | null
    framework?: string | null
    language?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    tasks?: TaskUncheckedCreateNestedManyWithoutProjectInput
    qualityGates?: QualityGateUncheckedCreateNestedManyWithoutProjectInput
    files?: ProjectFileUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutDeploymentsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutDeploymentsInput, ProjectUncheckedCreateWithoutDeploymentsInput>
  }

  export type ProjectUpsertWithoutDeploymentsInput = {
    update: XOR<ProjectUpdateWithoutDeploymentsInput, ProjectUncheckedUpdateWithoutDeploymentsInput>
    create: XOR<ProjectCreateWithoutDeploymentsInput, ProjectUncheckedCreateWithoutDeploymentsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutDeploymentsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutDeploymentsInput, ProjectUncheckedUpdateWithoutDeploymentsInput>
  }

  export type ProjectUpdateWithoutDeploymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    framework?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProjectsNestedInput
    tasks?: TaskUpdateManyWithoutProjectNestedInput
    qualityGates?: QualityGateUpdateManyWithoutProjectNestedInput
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutDeploymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    framework?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    tasks?: TaskUncheckedUpdateManyWithoutProjectNestedInput
    qualityGates?: QualityGateUncheckedUpdateManyWithoutProjectNestedInput
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateWithoutFilesInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.ProjectStatus
    repository?: string | null
    framework?: string | null
    language?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutProjectsInput
    tasks?: TaskCreateNestedManyWithoutProjectInput
    deployments?: DeploymentCreateNestedManyWithoutProjectInput
    qualityGates?: QualityGateCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutFilesInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.ProjectStatus
    repository?: string | null
    framework?: string | null
    language?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    tasks?: TaskUncheckedCreateNestedManyWithoutProjectInput
    deployments?: DeploymentUncheckedCreateNestedManyWithoutProjectInput
    qualityGates?: QualityGateUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutFilesInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
  }

  export type ProjectUpsertWithoutFilesInput = {
    update: XOR<ProjectUpdateWithoutFilesInput, ProjectUncheckedUpdateWithoutFilesInput>
    create: XOR<ProjectCreateWithoutFilesInput, ProjectUncheckedCreateWithoutFilesInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutFilesInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutFilesInput, ProjectUncheckedUpdateWithoutFilesInput>
  }

  export type ProjectUpdateWithoutFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    framework?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProjectsNestedInput
    tasks?: TaskUpdateManyWithoutProjectNestedInput
    deployments?: DeploymentUpdateManyWithoutProjectNestedInput
    qualityGates?: QualityGateUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    framework?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    tasks?: TaskUncheckedUpdateManyWithoutProjectNestedInput
    deployments?: DeploymentUncheckedUpdateManyWithoutProjectNestedInput
    qualityGates?: QualityGateUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutUserInput
    tasks?: TaskCreateNestedManyWithoutUserInput
    teamMembers?: TeamMemberCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    email: string
    name?: string | null
    avatar?: string | null
    role?: $Enums.UserRole
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutUserInput
    tasks?: TaskUncheckedCreateNestedManyWithoutUserInput
    teamMembers?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutUserNestedInput
    tasks?: TaskUpdateManyWithoutUserNestedInput
    teamMembers?: TeamMemberUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutUserNestedInput
    tasks?: TaskUncheckedUpdateManyWithoutUserNestedInput
    teamMembers?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ProjectCreateManyUserInput = {
    id?: string
    name: string
    description?: string | null
    status?: $Enums.ProjectStatus
    repository?: string | null
    framework?: string | null
    language?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskCreateManyUserInput = {
    id?: string
    title: string
    description?: string | null
    status?: $Enums.TaskStatus
    priority?: $Enums.Priority
    aiProvider: $Enums.AIProvider
    model?: string | null
    type: $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: number | null
    cost?: number | null
    duration?: number | null
    quality?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    projectId: string
  }

  export type SessionCreateManyUserInput = {
    id?: string
    sessionId: string
    data?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type TeamMemberCreateManyUserInput = {
    id?: string
    role: $Enums.MemberRole
    aiProvider: $Enums.AIProvider
    model: string
    specialties?: NullableJsonNullValueInput | InputJsonValue
    performance?: NullableJsonNullValueInput | InputJsonValue
    teamId: string
  }

  export type ProjectUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    framework?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: TaskUpdateManyWithoutProjectNestedInput
    deployments?: DeploymentUpdateManyWithoutProjectNestedInput
    qualityGates?: QualityGateUpdateManyWithoutProjectNestedInput
    files?: ProjectFileUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    framework?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tasks?: TaskUncheckedUpdateManyWithoutProjectNestedInput
    deployments?: DeploymentUncheckedUpdateManyWithoutProjectNestedInput
    qualityGates?: QualityGateUncheckedUpdateManyWithoutProjectNestedInput
    files?: ProjectFileUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    framework?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: NullableStringFieldUpdateOperationsInput | string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableIntFieldUpdateOperationsInput | number | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    quality?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    project?: ProjectUpdateOneRequiredWithoutTasksNestedInput
    qualityGates?: QualityGateUpdateManyWithoutTaskNestedInput
    executions?: TaskExecutionUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: NullableStringFieldUpdateOperationsInput | string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableIntFieldUpdateOperationsInput | number | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    quality?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    projectId?: StringFieldUpdateOperationsInput | string
    qualityGates?: QualityGateUncheckedUpdateManyWithoutTaskNestedInput
    executions?: TaskExecutionUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: NullableStringFieldUpdateOperationsInput | string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableIntFieldUpdateOperationsInput | number | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    quality?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    projectId?: StringFieldUpdateOperationsInput | string
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    data?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    data?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    data?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamMemberUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMemberRoleFieldUpdateOperationsInput | $Enums.MemberRole
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: StringFieldUpdateOperationsInput | string
    specialties?: NullableJsonNullValueInput | InputJsonValue
    performance?: NullableJsonNullValueInput | InputJsonValue
    team?: AITeamUpdateOneRequiredWithoutMembersNestedInput
  }

  export type TeamMemberUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMemberRoleFieldUpdateOperationsInput | $Enums.MemberRole
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: StringFieldUpdateOperationsInput | string
    specialties?: NullableJsonNullValueInput | InputJsonValue
    performance?: NullableJsonNullValueInput | InputJsonValue
    teamId?: StringFieldUpdateOperationsInput | string
  }

  export type TeamMemberUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMemberRoleFieldUpdateOperationsInput | $Enums.MemberRole
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: StringFieldUpdateOperationsInput | string
    specialties?: NullableJsonNullValueInput | InputJsonValue
    performance?: NullableJsonNullValueInput | InputJsonValue
    teamId?: StringFieldUpdateOperationsInput | string
  }

  export type TaskCreateManyProjectInput = {
    id?: string
    title: string
    description?: string | null
    status?: $Enums.TaskStatus
    priority?: $Enums.Priority
    aiProvider: $Enums.AIProvider
    model?: string | null
    type: $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: number | null
    cost?: number | null
    duration?: number | null
    quality?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    completedAt?: Date | string | null
    userId: string
  }

  export type DeploymentCreateManyProjectInput = {
    id?: string
    version: string
    status?: $Enums.DeploymentStatus
    environment: string
    config?: NullableJsonNullValueInput | InputJsonValue
    logs?: NullableJsonNullValueInput | InputJsonValue
    url?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deployedAt?: Date | string | null
  }

  export type QualityGateCreateManyProjectInput = {
    id?: string
    name: string
    type: $Enums.QualityGateType
    status?: $Enums.QualityStatus
    rules: JsonNullValueInput | InputJsonValue
    config?: NullableJsonNullValueInput | InputJsonValue
    score?: number | null
    issues?: NullableJsonNullValueInput | InputJsonValue
    report?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    taskId?: string | null
  }

  export type ProjectFileCreateManyProjectInput = {
    id?: string
    path: string
    name: string
    type?: string | null
    size?: number | null
    checksum?: string | null
    language?: string | null
    framework?: string | null
    purpose?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TaskUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: NullableStringFieldUpdateOperationsInput | string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableIntFieldUpdateOperationsInput | number | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    quality?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutTasksNestedInput
    qualityGates?: QualityGateUpdateManyWithoutTaskNestedInput
    executions?: TaskExecutionUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: NullableStringFieldUpdateOperationsInput | string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableIntFieldUpdateOperationsInput | number | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    quality?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userId?: StringFieldUpdateOperationsInput | string
    qualityGates?: QualityGateUncheckedUpdateManyWithoutTaskNestedInput
    executions?: TaskExecutionUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    priority?: EnumPriorityFieldUpdateOperationsInput | $Enums.Priority
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumTaskTypeFieldUpdateOperationsInput | $Enums.TaskType
    context?: NullableJsonNullValueInput | InputJsonValue
    requirements?: NullableJsonNullValueInput | InputJsonValue
    constraints?: NullableJsonNullValueInput | InputJsonValue
    result?: NullableJsonNullValueInput | InputJsonValue
    diff?: NullableStringFieldUpdateOperationsInput | string | null
    artifacts?: NullableJsonNullValueInput | InputJsonValue
    tokenUsage?: NullableIntFieldUpdateOperationsInput | number | null
    cost?: NullableFloatFieldUpdateOperationsInput | number | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    quality?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type DeploymentUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    status?: EnumDeploymentStatusFieldUpdateOperationsInput | $Enums.DeploymentStatus
    environment?: StringFieldUpdateOperationsInput | string
    config?: NullableJsonNullValueInput | InputJsonValue
    logs?: NullableJsonNullValueInput | InputJsonValue
    url?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deployedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DeploymentUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    status?: EnumDeploymentStatusFieldUpdateOperationsInput | $Enums.DeploymentStatus
    environment?: StringFieldUpdateOperationsInput | string
    config?: NullableJsonNullValueInput | InputJsonValue
    logs?: NullableJsonNullValueInput | InputJsonValue
    url?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deployedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DeploymentUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    status?: EnumDeploymentStatusFieldUpdateOperationsInput | $Enums.DeploymentStatus
    environment?: StringFieldUpdateOperationsInput | string
    config?: NullableJsonNullValueInput | InputJsonValue
    logs?: NullableJsonNullValueInput | InputJsonValue
    url?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deployedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type QualityGateUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumQualityGateTypeFieldUpdateOperationsInput | $Enums.QualityGateType
    status?: EnumQualityStatusFieldUpdateOperationsInput | $Enums.QualityStatus
    rules?: JsonNullValueInput | InputJsonValue
    config?: NullableJsonNullValueInput | InputJsonValue
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    issues?: NullableJsonNullValueInput | InputJsonValue
    report?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    task?: TaskUpdateOneWithoutQualityGatesNestedInput
  }

  export type QualityGateUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumQualityGateTypeFieldUpdateOperationsInput | $Enums.QualityGateType
    status?: EnumQualityStatusFieldUpdateOperationsInput | $Enums.QualityStatus
    rules?: JsonNullValueInput | InputJsonValue
    config?: NullableJsonNullValueInput | InputJsonValue
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    issues?: NullableJsonNullValueInput | InputJsonValue
    report?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QualityGateUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumQualityGateTypeFieldUpdateOperationsInput | $Enums.QualityGateType
    status?: EnumQualityStatusFieldUpdateOperationsInput | $Enums.QualityStatus
    rules?: JsonNullValueInput | InputJsonValue
    config?: NullableJsonNullValueInput | InputJsonValue
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    issues?: NullableJsonNullValueInput | InputJsonValue
    report?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    taskId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectFileUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    checksum?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    framework?: NullableStringFieldUpdateOperationsInput | string | null
    purpose?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFileUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    checksum?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    framework?: NullableStringFieldUpdateOperationsInput | string | null
    purpose?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectFileUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: NullableStringFieldUpdateOperationsInput | string | null
    size?: NullableIntFieldUpdateOperationsInput | number | null
    checksum?: NullableStringFieldUpdateOperationsInput | string | null
    language?: NullableStringFieldUpdateOperationsInput | string | null
    framework?: NullableStringFieldUpdateOperationsInput | string | null
    purpose?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QualityGateCreateManyTaskInput = {
    id?: string
    name: string
    type: $Enums.QualityGateType
    status?: $Enums.QualityStatus
    rules: JsonNullValueInput | InputJsonValue
    config?: NullableJsonNullValueInput | InputJsonValue
    score?: number | null
    issues?: NullableJsonNullValueInput | InputJsonValue
    report?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    projectId: string
  }

  export type TaskExecutionCreateManyTaskInput = {
    id?: string
    status?: $Enums.ExecutionStatus
    startedAt?: Date | string
    completedAt?: Date | string | null
    input: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    logs?: NullableJsonNullValueInput | InputJsonValue
    metrics?: NullableJsonNullValueInput | InputJsonValue
  }

  export type QualityGateUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumQualityGateTypeFieldUpdateOperationsInput | $Enums.QualityGateType
    status?: EnumQualityStatusFieldUpdateOperationsInput | $Enums.QualityStatus
    rules?: JsonNullValueInput | InputJsonValue
    config?: NullableJsonNullValueInput | InputJsonValue
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    issues?: NullableJsonNullValueInput | InputJsonValue
    report?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutQualityGatesNestedInput
  }

  export type QualityGateUncheckedUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumQualityGateTypeFieldUpdateOperationsInput | $Enums.QualityGateType
    status?: EnumQualityStatusFieldUpdateOperationsInput | $Enums.QualityStatus
    rules?: JsonNullValueInput | InputJsonValue
    config?: NullableJsonNullValueInput | InputJsonValue
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    issues?: NullableJsonNullValueInput | InputJsonValue
    report?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectId?: StringFieldUpdateOperationsInput | string
  }

  export type QualityGateUncheckedUpdateManyWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    type?: EnumQualityGateTypeFieldUpdateOperationsInput | $Enums.QualityGateType
    status?: EnumQualityStatusFieldUpdateOperationsInput | $Enums.QualityStatus
    rules?: JsonNullValueInput | InputJsonValue
    config?: NullableJsonNullValueInput | InputJsonValue
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    issues?: NullableJsonNullValueInput | InputJsonValue
    report?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectId?: StringFieldUpdateOperationsInput | string
  }

  export type TaskExecutionUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumExecutionStatusFieldUpdateOperationsInput | $Enums.ExecutionStatus
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    logs?: NullableJsonNullValueInput | InputJsonValue
    metrics?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TaskExecutionUncheckedUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumExecutionStatusFieldUpdateOperationsInput | $Enums.ExecutionStatus
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    logs?: NullableJsonNullValueInput | InputJsonValue
    metrics?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TaskExecutionUncheckedUpdateManyWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumExecutionStatusFieldUpdateOperationsInput | $Enums.ExecutionStatus
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    input?: JsonNullValueInput | InputJsonValue
    output?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    logs?: NullableJsonNullValueInput | InputJsonValue
    metrics?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TeamMemberCreateManyTeamInput = {
    id?: string
    role: $Enums.MemberRole
    aiProvider: $Enums.AIProvider
    model: string
    specialties?: NullableJsonNullValueInput | InputJsonValue
    performance?: NullableJsonNullValueInput | InputJsonValue
    userId?: string | null
  }

  export type TeamMemberUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMemberRoleFieldUpdateOperationsInput | $Enums.MemberRole
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: StringFieldUpdateOperationsInput | string
    specialties?: NullableJsonNullValueInput | InputJsonValue
    performance?: NullableJsonNullValueInput | InputJsonValue
    user?: UserUpdateOneWithoutTeamMembersNestedInput
  }

  export type TeamMemberUncheckedUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMemberRoleFieldUpdateOperationsInput | $Enums.MemberRole
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: StringFieldUpdateOperationsInput | string
    specialties?: NullableJsonNullValueInput | InputJsonValue
    performance?: NullableJsonNullValueInput | InputJsonValue
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TeamMemberUncheckedUpdateManyWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumMemberRoleFieldUpdateOperationsInput | $Enums.MemberRole
    aiProvider?: EnumAIProviderFieldUpdateOperationsInput | $Enums.AIProvider
    model?: StringFieldUpdateOperationsInput | string
    specialties?: NullableJsonNullValueInput | InputJsonValue
    performance?: NullableJsonNullValueInput | InputJsonValue
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProjectCountOutputTypeDefaultArgs instead
     */
    export type ProjectCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProjectCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TaskCountOutputTypeDefaultArgs instead
     */
    export type TaskCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TaskCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AITeamCountOutputTypeDefaultArgs instead
     */
    export type AITeamCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AITeamCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProjectDefaultArgs instead
     */
    export type ProjectArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProjectDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TaskDefaultArgs instead
     */
    export type TaskArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TaskDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TaskExecutionDefaultArgs instead
     */
    export type TaskExecutionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TaskExecutionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use QualityGateDefaultArgs instead
     */
    export type QualityGateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = QualityGateDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AITeamDefaultArgs instead
     */
    export type AITeamArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AITeamDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TeamMemberDefaultArgs instead
     */
    export type TeamMemberArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TeamMemberDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DeploymentDefaultArgs instead
     */
    export type DeploymentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DeploymentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProjectFileDefaultArgs instead
     */
    export type ProjectFileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProjectFileDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SessionDefaultArgs instead
     */
    export type SessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SessionDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}