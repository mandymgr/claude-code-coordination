/**
 * Telemetry utilities for tracing and monitoring
 */

export const TelemetryUtils = {
  async traceAsync<T>(operationName: string, fn: () => Promise<T>): Promise<T> {
    const startTime = Date.now();
    console.log(`[TRACE] Starting ${operationName}`);
    
    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      console.log(`[TRACE] Completed ${operationName} in ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[TRACE] Failed ${operationName} in ${duration}ms:`, error);
      throw error;
    }
  },

  trace<T>(operationName: string, fn: () => T): T {
    const startTime = Date.now();
    console.log(`[TRACE] Starting ${operationName}`);
    
    try {
      const result = fn();
      const duration = Date.now() - startTime;
      console.log(`[TRACE] Completed ${operationName} in ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[TRACE] Failed ${operationName} in ${duration}ms:`, error);
      throw error;
    }
  }
};