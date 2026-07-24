import pino from "pino";
import type { Request, Response, NextFunction } from "express";

// --- Configuration ---

const isDev = process.env.NODE_ENV !== "production";
const logLevel = process.env.LOG_LEVEL || (isDev ? "debug" : "info");

// --- Sensitive Data Redaction ---

const SENSITIVE_KEYS = [
  "password",
  "secret",
  "token",
  "authorization",
  "cookie",
  "api_key",
  "apikey",
  "private_key",
  "privatekey",
  "secret_key",
  "secretkey",
  "DATABASE_URL",
  "DEPLOYER_SECRET_KEY",
];

/**
 * Recursively redact sensitive data from objects
 */
function redactSensitiveData(obj: any): any {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(redactSensitiveData);
  }

  const redacted: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const keyLower = key.toLowerCase();
    const isSensitive = SENSITIVE_KEYS.some((sk) => keyLower.includes(sk));

    if (isSensitive) {
      redacted[key] = "[REDACTED]";
    } else if (value && typeof value === "object") {
      redacted[key] = redactSensitiveData(value);
    } else {
      redacted[key] = value;
    }
  }
  return redacted;
}

// --- Pino Logger Instance ---

export const logger = pino({
  level: logLevel,
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
          ignore: "pid,hostname",
        },
      }
    : undefined,
  formatters: {
    level: (label) => {
      return { level: label };
    },
    bindings: (bindings) => {
      return {
        pid: bindings.pid,
        hostname: bindings.hostname,
        node_version: process.version,
      };
    },
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      headers: redactSensitiveData(req.headers),
      remoteAddress: req.remoteAddress,
      remotePort: req.remotePort,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
      headers: redactSensitiveData(res.getHeaders()),
    }),
    err: pino.stdSerializers.err,
  },
  redact: {
    paths: SENSITIVE_KEYS,
    censor: "[REDACTED]",
  },
});

// --- Request/Response Logging Middleware ---

/**
 * Express middleware that logs all HTTP requests and responses
 * Includes method, path, status code, response time, and client IP
 */
export function requestLoggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();
  const reqId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Attach request ID to request object for tracing
  (req as any).id = reqId;

  // Create child logger with request context
  const reqLogger = logger.child({
    reqId,
    module: "http",
  });

  // Log incoming request
  reqLogger.info(
    {
      method: req.method,
      url: req.originalUrl || req.url,
      headers: redactSensitiveData(req.headers),
      query: req.query,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get("user-agent"),
    },
    `→ ${req.method} ${req.originalUrl || req.url}`
  );

  // Capture response details when finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";

    reqLogger[logLevel](
      {
        method: req.method,
        url: req.originalUrl || req.url,
        statusCode: res.statusCode,
        duration_ms: duration,
        ip: req.ip || req.socket.remoteAddress,
        contentLength: res.get("content-length"),
      },
      `← ${req.method} ${req.originalUrl || req.url} ${res.statusCode} ${duration}ms`
    );
  });

  next();
}

// --- Database Query Logging ---

/**
 * Wrapper for logging database queries with execution time
 * @param queryName - Descriptive name for the query
 * @param queryFn - Async function that executes the query
 * @returns Query result
 */
export async function logDatabaseQuery<T>(
  queryName: string,
  queryFn: () => Promise<T>,
  sql?: string,
  params?: any[]
): Promise<T> {
  const start = Date.now();
  const dbLogger = logger.child({ module: "database" });

  dbLogger.debug(
    {
      query: queryName,
      sql: sql ? sql.substring(0, 200) : undefined,
      params: params ? redactSensitiveData(params) : undefined,
    },
    `Executing query: ${queryName}`
  );

  try {
    const result = await queryFn();
    const duration = Date.now() - start;

    if (duration > 1000) {
      // Warn on slow queries (>1s)
      dbLogger.warn(
        {
          query: queryName,
          duration_ms: duration,
        },
        `Slow query detected: ${queryName} took ${duration}ms`
      );
    } else {
      dbLogger.debug(
        {
          query: queryName,
          duration_ms: duration,
        },
        `Query completed: ${queryName} in ${duration}ms`
      );
    }

    return result;
  } catch (error) {
    const duration = Date.now() - start;
    dbLogger.error(
      {
        query: queryName,
        duration_ms: duration,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      `Query failed: ${queryName} after ${duration}ms`
    );
    throw error;
  }
}

// --- Stellar Transaction Logging ---

/**
 * Log Stellar blockchain transactions with results
 * @param txType - Type of transaction (e.g., "create_shipment", "accept_shipment")
 * @param txDetails - Transaction details to log
 * @param result - Transaction result (hash, status, etc.)
 */
export function logStellarTransaction(
  txType: string,
  txDetails: {
    shipmentId?: string;
    sourceAddress?: string;
    method?: string;
    [key: string]: any;
  },
  result?: {
    hash?: string;
    status?: string;
    error?: string;
    [key: string]: any;
  }
): void {
  const stellarLogger = logger.child({ module: "stellar" });

  if (result?.error) {
    stellarLogger.error(
      {
        txType,
        ...redactSensitiveData(txDetails),
        result: redactSensitiveData(result),
      },
      `Stellar transaction failed: ${txType} - ${result.error}`
    );
  } else {
    stellarLogger.info(
      {
        txType,
        ...redactSensitiveData(txDetails),
        result: redactSensitiveData(result),
      },
      `Stellar transaction ${result?.status || "completed"}: ${txType} - ${result?.hash || "no hash"}`
    );
  }
}

// --- Error Logging ---

/**
 * Log errors with full stack traces and context
 * @param error - Error object or message
 * @param context - Additional context information
 */
export function logError(
  error: Error | string,
  context?: {
    module?: string;
    operation?: string;
    [key: string]: any;
  }
): void {
  const errorLogger = logger.child({
    module: context?.module || "app",
  });

  if (error instanceof Error) {
    errorLogger.error(
      {
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },
        context: context ? redactSensitiveData(context) : undefined,
      },
      `Error: ${error.message}`
    );
  } else {
    errorLogger.error(
      {
        error: String(error),
        context: context ? redactSensitiveData(context) : undefined,
      },
      `Error: ${error}`
    );
  }
}

// --- Utility Functions ---

/**
 * Create a child logger with module context
 * @param module - Module name for context
 * @returns Child logger instance
 */
export function createModuleLogger(module: string) {
  return logger.child({ module });
}

// Export for backward compatibility
export default logger;
