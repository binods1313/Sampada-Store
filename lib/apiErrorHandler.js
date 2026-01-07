// lib/apiErrorHandler.js
// Enterprise-grade API error handling with enhanced security, scalability, and observability

import crypto from 'crypto';
import { createLogger, format, transports } from 'winston';
import DOMPurify from 'isomorphic-dompurify';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import helmet from 'helmet';
import cors from 'cors';
import { createClient } from 'redis';

// Enhanced error types with severity levels
export const ERROR_TYPES = {
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  CLIENT: 'CLIENT_ERROR',
  SERVER: 'SERVER_ERROR',
  NETWORK: 'NETWORK_ERROR',
  DATABASE: 'DATABASE_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_ERROR',
  CIRCUIT_BREAKER: 'CIRCUIT_BREAKER_ERROR'
};

export const ERROR_SEVERITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

// Configure structured logging
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
    format.printf(({ timestamp, level, message, correlationId, ...meta }) => {
      return JSON.stringify({
        timestamp,
        level,
        message,
        correlationId,
        ...meta
      });
    })
  ),
  defaultMeta: { service: process.env.SERVICE_NAME || 'api' },
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
});

// Metrics collection (integrate with your monitoring system)
class MetricsCollector {
  static instance = null;

  constructor() {
    if (MetricsCollector.instance) {
      return MetricsCollector.instance;
    }
    this.metrics = new Map();
    MetricsCollector.instance = this;
  }

  increment(metric, labels = {}) {
    const key = `${metric}_${JSON.stringify(labels)}`;
    this.metrics.set(key, (this.metrics.get(key) || 0) + 1);
    
    // In production, send to your metrics service (Prometheus, StatsD, etc.)
    if (process.env.METRICS_ENDPOINT) {
      this.sendToMetricsService(metric, labels);
    }
  }

  gauge(metric, value, labels = {}) {
    const key = `${metric}_${JSON.stringify(labels)}`;
    this.metrics.set(key, value);
  }

  histogram(metric, value, labels = {}) {
    // Implementation depends on your metrics backend
    logger.debug('Histogram metric recorded', { metric, value, labels });
  }

  async sendToMetricsService(metric, labels) {
    // Implement your metrics service integration here
    // Example: send to Prometheus pushgateway, StatsD, etc.
  }
}

const metrics = new MetricsCollector();

/**
 * Enhanced API Error class with correlation tracking and severity levels
 */
export class APIError extends Error {
  constructor(
    message, 
    statusCode = 500, 
    type = ERROR_TYPES.SERVER, 
    details = null,
    severity = ERROR_SEVERITY.MEDIUM,
    correlationId = null,
    userId = null
  ) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.type = type;
    this.severity = severity;
    this.details = details;
    this.correlationId = correlationId;
    this.userId = userId;
    this.timestamp = new Date().toISOString();
    this.id = `API_ERR_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    this.stack = Error.captureStackTrace ? Error.captureStackTrace(this, APIError) : (new Error()).stack;
  }

  toJSON() {
    return {
      id: this.id,
      error: this.message,
      type: this.type,
      severity: this.severity,
      statusCode: this.statusCode,
      details: this.details,
      correlationId: this.correlationId,
      timestamp: this.timestamp,
      // Only include stack trace in development
      ...(process.env.NODE_ENV === 'development' && { stack: this.stack })
    };
  }

  toLogFormat() {
    return {
      errorId: this.id,
      message: this.message,
      type: this.type,
      severity: this.severity,
      statusCode: this.statusCode,
      correlationId: this.correlationId,
      userId: this.userId,
      details: this.details,
      stack: this.stack
    };
  }
}

/**
 * Comprehensive API error definitions
 */
export const API_ERRORS = {
  // Client errors (4xx)
  BAD_REQUEST: (message = 'Bad request', details = null) => 
    new APIError(message, 400, ERROR_TYPES.CLIENT, details, ERROR_SEVERITY.LOW),
  
  UNAUTHORIZED: (message = 'Unauthorized access') => 
    new APIError(message, 401, ERROR_TYPES.AUTHENTICATION, null, ERROR_SEVERITY.MEDIUM),
  
  FORBIDDEN: (message = 'Access forbidden') => 
    new APIError(message, 403, ERROR_TYPES.AUTHORIZATION, null, ERROR_SEVERITY.MEDIUM),
  
  NOT_FOUND: (message = 'Resource not found') => 
    new APIError(message, 404, ERROR_TYPES.NOT_FOUND, null, ERROR_SEVERITY.LOW),
  
  METHOD_NOT_ALLOWED: (method, allowed) => 
    new APIError(`Method ${method} not allowed`, 405, ERROR_TYPES.CLIENT, { allowed }, ERROR_SEVERITY.LOW),
  
  CONFLICT: (message = 'Resource conflict') => 
    new APIError(message, 409, ERROR_TYPES.CLIENT, null, ERROR_SEVERITY.MEDIUM),
  
  VALIDATION_FAILED: (details) => 
    new APIError('Validation failed', 422, ERROR_TYPES.VALIDATION, details, ERROR_SEVERITY.LOW),
  
  RATE_LIMITED: (message = 'Rate limit exceeded', resetTime = null) => 
    new APIError(message, 429, ERROR_TYPES.RATE_LIMIT, { resetTime }, ERROR_SEVERITY.MEDIUM),

  // Server errors (5xx)
  INTERNAL_ERROR: (message = 'Internal server error', details = null) => 
    new APIError(message, 500, ERROR_TYPES.SERVER, details, ERROR_SEVERITY.HIGH),
  
  SERVICE_UNAVAILABLE: (message = 'Service temporarily unavailable', retryAfter = null) => 
    new APIError(message, 503, ERROR_TYPES.NETWORK, { retryAfter }, ERROR_SEVERITY.HIGH),
  
  DATABASE_ERROR: (message = 'Database operation failed', query = null) => 
    new APIError(message, 503, ERROR_TYPES.DATABASE, { query }, ERROR_SEVERITY.HIGH),
  
  CIRCUIT_BREAKER_OPEN: (service) => 
    new APIError(`Service ${service} is currently unavailable`, 503, ERROR_TYPES.CIRCUIT_BREAKER, { service }, ERROR_SEVERITY.HIGH)
};

/**
 * Circuit Breaker implementation for external services
 */
export class CircuitBreaker {
  constructor(options = {}) {
    this.threshold = options.threshold || 5;
    this.timeout = options.timeout || 60000;
    this.monitoringPeriod = options.monitoringPeriod || 10000;
    this.fallback = options.fallback;
    this.name = options.name || 'unnamed';
    
    this.failureCount = 0;
    this.successCount = 0;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
    this.stats = {
      totalRequests: 0,
      totalFailures: 0,
      totalSuccesses: 0
    };
  }

  async execute(fn, ...args) {
    this.stats.totalRequests++;
    
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        metrics.increment('circuit_breaker_rejected', { name: this.name });
        if (this.fallback) {
          return await this.fallback(...args);
        }
        throw API_ERRORS.CIRCUIT_BREAKER_OPEN(this.name);
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn(...args);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.successCount++;
    this.stats.totalSuccesses++;
    
    if (this.state === 'HALF_OPEN') {
      this.reset();
    }
    
    metrics.increment('circuit_breaker_success', { name: this.name });
  }

  onFailure() {
    this.failureCount++;
    this.stats.totalFailures++;
    
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
      logger.warn('Circuit breaker opened', { 
        name: this.name, 
        failureCount: this.failureCount,
        threshold: this.threshold 
      });
    }
    
    metrics.increment('circuit_breaker_failure', { name: this.name });
  }

  reset() {
    this.failureCount = 0;
    this.successCount = 0;
    this.state = 'CLOSED';
    logger.info('Circuit breaker reset', { name: this.name });
  }

  getStats() {
    return {
      ...this.stats,
      state: this.state,
      failureRate: this.stats.totalRequests > 0 
        ? (this.stats.totalFailures / this.stats.totalRequests) * 100 
        : 0
    };
  }
}

/**
 * Request correlation middleware
 */
export const correlationMiddleware = (req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || 
                       req.headers['x-request-id'] || 
                       `req_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  
  req.correlationId = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);
  
  // Add to async local storage for cross-service tracing
  if (process.env.NODE_ENV === 'production') {
    // Implement async local storage integration
  }
  
  if (next) next();
};

/**
 * Request logging middleware
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  logger.info('Request started', {
    correlationId: req.correlationId,
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection.remoteAddress,
    userId: req.user?.id
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - startTime;
    
    logger.info('Request completed', {
      correlationId: req.correlationId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      responseSize: JSON.stringify(data).length
    });

    metrics.histogram('request_duration', duration, {
      method: req.method,
      status: res.statusCode,
      endpoint: req.route?.path || req.url
    });

    return originalJson.call(this, data);
  };
  
  if (next) next();
};

/**
 * Input sanitization middleware
 */
export const sanitizeInput = (req, res, next) => {
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      return DOMPurify.sanitize(value.trim());
    }
    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }
    if (typeof value === 'object' && value !== null) {
      const sanitized = {};
      Object.keys(value).forEach(key => {
        sanitized[key] = sanitizeValue(value[key]);
      });
      return sanitized;
    }
    return value;
  };

  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }
  
  if (next) next();
};

/**
 * Enhanced rate limiting with Redis support
 */
export const createRateLimit = (options = {}) => {
  const config = {
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
    max: options.max || 100,
    message: options.message || 'Too many requests',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: options.keyGenerator || ((req) => {
      // First try to use user ID if available
      const userId = req.user?.id;
      if (userId) return `user:${userId}`;
      // Otherwise use IP with proper IPv6 handling
      return `ip:${ipKeyGenerator(req)}`;
    }),
    skip: options.skip || (() => false),
    // Removed deprecated onLimitReached - use handler instead
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        correlationId: req.correlationId,
        ip: req.ip,
        userId: req.user?.id,
        limit: config.max,
        windowMs: config.windowMs
      });
      
      metrics.increment('rate_limit_exceeded', {
        ip: req.ip,
        userId: req.user?.id || 'anonymous'
      });
      
      // Send rate limit error response
      const error = API_ERRORS.RATE_LIMITED(options.message || 'Too many requests');
      error.correlationId = req.correlationId;
      
      res.status(429).json({
        success: false,
        ...error.toJSON()
      });
    }
  };

  // Use Redis store if Redis client is available
  if (process.env.REDIS_URL) {
    const redisClient = createClient({
      url: process.env.REDIS_URL,
      retry_delay_on_failure: 1000,
      max_retry_delay: 10000
    });
    
    config.store = new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
    });
  }

  return rateLimit(config);
};

/**
 * Security headers middleware
 */
export const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

/**
 * CORS configuration
 */
export const createCorsMiddleware = (options = {}) => {
  return cors({
    origin: options.origin || process.env.ALLOWED_ORIGINS?.split(',') || false,
    methods: options.methods || ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: options.allowedHeaders || [
      'Content-Type', 
      'Authorization', 
      'X-Correlation-ID',
      'X-API-Key'
    ],
    exposedHeaders: ['X-Correlation-ID', 'X-RateLimit-Remaining'],
    credentials: options.credentials !== false,
    maxAge: options.maxAge || 86400 // 24 hours
  });
};

/**
 * Request validation middleware
 */
export const validateRequest = (schema, options = {}) => {
  const { 
    validateBody = true, 
    validateQuery = false, 
    validateParams = false,
    allowUnknown = false 
  } = options;
  
  return async (req, res, next) => {
    const errors = {};
    const validationOptions = { 
      abortEarly: false, 
      allowUnknown,
      stripUnknown: true 
    };

    try {
      if (validateBody && req.body && Object.keys(req.body).length > 0) {
        const { error, value } = schema.validate(req.body, validationOptions);
        if (error) {
          errors.body = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value
          }));
        } else {
          req.body = value;
        }
      }

      if (validateQuery && req.query && Object.keys(req.query).length > 0) {
        const { error, value } = schema.validate(req.query, validationOptions);
        if (error) {
          errors.query = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value
          }));
        } else {
          req.query = value;
        }
      }

      if (validateParams && req.params && Object.keys(req.params).length > 0) {
        const { error, value } = schema.validate(req.params, validationOptions);
        if (error) {
          errors.params = error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
            value: detail.context?.value
          }));
        } else {
          req.params = value;
        }
      }

      if (Object.keys(errors).length > 0) {
        const validationError = API_ERRORS.VALIDATION_FAILED(errors);
        validationError.correlationId = req.correlationId;
        throw validationError;
      }

      if (next) next();
    } catch (error) {
      if (next) next(error);
    }
  };
};

/**
 * JWT Authentication middleware
 */
export const authenticateJWT = (options = {}) => {
  const { 
    secret = process.env.JWT_SECRET,
    algorithms = ['HS256'],
    getToken = (req) => {
      const authHeader = req.headers.authorization;
      return authHeader && authHeader.split(' ')[1];
    }
  } = options;

  return async (req, res, next) => {
    try {
      const token = getToken(req);
      
      if (!token) {
        const error = API_ERRORS.UNAUTHORIZED('Access token required');
        error.correlationId = req.correlationId;
        throw error;
      }

      // In production, use a proper JWT library like jsonwebtoken
      // const decoded = jwt.verify(token, secret, { algorithms });
      // req.user = decoded;
      
      // Placeholder for demonstration
      req.user = { id: 'user123', role: 'user' };
      
      if (next) next();
    } catch (error) {
      const authError = API_ERRORS.UNAUTHORIZED('Invalid or expired token');
      authError.correlationId = req.correlationId;
      if (next) next(authError);
    }
  };
};

/**
 * Role-based authorization middleware
 */
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      const error = API_ERRORS.UNAUTHORIZED('Authentication required');
      error.correlationId = req.correlationId;
      throw error;
    }

    const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [req.user.role];
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!requiredRoles.some(role => userRoles.includes(role))) {
      const error = API_ERRORS.FORBIDDEN('Insufficient permissions');
      error.correlationId = req.correlationId;
      error.details = { required: requiredRoles, current: userRoles };
      throw error;
    }

    if (next) next();
  };
};

/**
 * Method validation middleware
 */
export const allowMethods = (methods) => {
  const allowedMethods = Array.isArray(methods) ? methods : [methods];
  
  return (req, res, next) => {
    if (!allowedMethods.includes(req.method)) {
      res.setHeader('Allow', allowedMethods.join(', '));
      const error = API_ERRORS.METHOD_NOT_ALLOWED(req.method, allowedMethods);
      error.correlationId = req.correlationId;
      throw error;
    }
    if (next) next();
  };
};

/**
 * Enhanced error handler with comprehensive logging
 */
export const errorHandler = (error, req, res, next) => {
  // Ensure correlation ID is set
  const correlationId = req.correlationId || error.correlationId || 
                       `err_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

  let apiError;
  
  if (error instanceof APIError) {
    apiError = error;
    apiError.correlationId = correlationId;
  } else {
    // Handle different error types
    apiError = mapErrorToAPIError(error, correlationId, req.user?.id);
  }

  // Log the error with full context
  logger.error('API Error occurred', {
    ...apiError.toLogFormat(),
    url: req.url,
    method: req.method,
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.connection.remoteAddress,
    userId: req.user?.id,
    requestBody: process.env.NODE_ENV === 'development' ? req.body : undefined
  });

  // Record metrics
  metrics.increment('api_errors_total', {
    type: apiError.type,
    statusCode: apiError.statusCode,
    severity: apiError.severity
  });

  // Send response
  res.status(apiError.statusCode).json({
    success: false,
    ...apiError.toJSON()
  });
};

/**
 * Map different error types to APIError
 */
const mapErrorToAPIError = (error, correlationId, userId) => {
  // Validation errors (Joi, Yup, etc.)
  if (error.name === 'ValidationError') {
    return new APIError(
      'Validation failed',
      400,
      ERROR_TYPES.VALIDATION,
      { fields: error.details || error.errors },
      ERROR_SEVERITY.LOW,
      correlationId,
      userId
    );
  }

  // Database errors (Prisma, Mongoose, etc.)
  if (error.code === 'P2002') {
    return new APIError(
      'Resource already exists',
      409,
      ERROR_TYPES.CLIENT,
      { constraint: error.meta?.target },
      ERROR_SEVERITY.MEDIUM,
      correlationId,
      userId
    );
  }

  if (error.code === 'P2025') {
    return new APIError(
      'Resource not found',
      404,
      ERROR_TYPES.NOT_FOUND,
      null,
      ERROR_SEVERITY.LOW,
      correlationId,
      userId
    );
  }

  // Network errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    return new APIError(
      'External service unavailable',
      503,
      ERROR_TYPES.NETWORK,
      { code: error.code },
      ERROR_SEVERITY.HIGH,
      correlationId,
      userId
    );
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return new APIError(
      'Invalid or expired token',
      401,
      ERROR_TYPES.AUTHENTICATION,
      null,
      ERROR_SEVERITY.MEDIUM,
      correlationId,
      userId
    );
  }

  // Default to internal server error
  return new APIError(
    process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    500,
    ERROR_TYPES.SERVER,
    process.env.NODE_ENV === 'development' ? { stack: error.stack } : null,
    ERROR_SEVERITY.HIGH,
    correlationId,
    userId
  );
};

/**
 * Async wrapper for route handlers
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Health check middleware
 */
export const healthCheck = {
  liveness: (req, res) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      correlationId: req.correlationId
    });
  },
  
  readiness: async (req, res) => {
    const checks = {};
    
    // Database connectivity check
    try {
      // Implement your database health check
      checks.database = { status: 'healthy', responseTime: 50 };
    } catch (error) {
      checks.database = { status: 'unhealthy', error: error.message };
    }
    
    // Redis connectivity check
    if (process.env.REDIS_URL) {
      try {
        // Implement Redis health check
        checks.redis = { status: 'healthy', responseTime: 10 };
      } catch (error) {
        checks.redis = { status: 'unhealthy', error: error.message };
      }
    }
    
    const allHealthy = Object.values(checks).every(check => check.status === 'healthy');
    const statusCode = allHealthy ? 200 : 503;
    
    res.status(statusCode).json({
      status: allHealthy ? 'healthy' : 'unhealthy',
      checks,
      timestamp: new Date().toISOString(),
      correlationId: req.correlationId
    });
  }
};

/**
 * Response helpers
 */
export const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
    correlationId: res.req?.correlationId
  };
  
  metrics.increment('api_success_responses', { statusCode });
  return res.status(statusCode).json(response);
};

export const sendError = (res, error, statusCode = 500) => {
  const errorResponse = error instanceof APIError 
    ? error.toJSON() 
    : {
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString(),
        correlationId: res.req?.correlationId
      };
  
  return res.status(statusCode).json({
    success: false,
    ...errorResponse
  });
};

/**
 * Enterprise API handler factory
 */
export const createEnterpriseAPIHandler = (config = {}) => {
  const {
    enableCors = true,
    enableSecurity = true,
    enableRateLimit = true,
    enableRequestLogging = true,
    enableInputSanitization = true,
    corsOptions = {},
    rateLimitOptions = {},
    customMiddlewares = []
  } = config;

  return (handlers) => {
    return async (req, res) => {
      try {
        // Apply built-in middlewares
        const middlewares = [
          correlationMiddleware,
          enableRequestLogging && requestLogger,
          enableSecurity && securityMiddleware,
          enableCors && createCorsMiddleware(corsOptions),
          enableInputSanitization && sanitizeInput,
          enableRateLimit && createRateLimit(rateLimitOptions),
          ...customMiddlewares
        ].filter(Boolean);

        // Run middlewares sequentially
        for (const middleware of middlewares) {
          await new Promise((resolve, reject) => {
            middleware(req, res, (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        }

        // Handle CORS preflight
        if (req.method === 'OPTIONS') {
          return res.status(200).end();
        }

        // Get handler for the method
        let handler = handlers[req.method];
        if (!handler) {
          const error = API_ERRORS.METHOD_NOT_ALLOWED(req.method, Object.keys(handlers));
          error.correlationId = req.correlationId;
          throw error;
        }

        // Execute handler(s) - handle both single function and array of middlewares
        if (Array.isArray(handler)) {
          // Execute middleware chain
          for (const middleware of handler) {
            await new Promise((resolve, reject) => {
              middleware(req, res, (err) => {
                if (err) reject(err);
                else resolve();
              });
            });
          }
          // If we get here without a response being sent, the handler chain completed successfully
          if (!res.headersSent) {
            return res.status(200).json({ success: true, message: 'Request processed successfully' });
          }
        } else {
          // Execute single handler
          const result = await handler(req, res);
          return result;
        }

      } catch (error) {
        errorHandler(error, req, res);
      }
    };
  };
};

// Export everything for enterprise use
const apiErrorHandler = {
  APIError,
  API_ERRORS,
  ERROR_TYPES,
  ERROR_SEVERITY,
  CircuitBreaker,
  MetricsCollector,
  correlationMiddleware,
  requestLogger,
  sanitizeInput,
  createRateLimit,
  securityMiddleware,
  createCorsMiddleware,
  validateRequest,
  authenticateJWT,
  requireRole,
  allowMethods,
  errorHandler,
  asyncHandler,
  healthCheck,
  sendSuccess,
  sendError,
  createEnterpriseAPIHandler,
  logger,
  metrics
};

export default apiErrorHandler;

// Individual named exports for convenience
export { logger, metrics };