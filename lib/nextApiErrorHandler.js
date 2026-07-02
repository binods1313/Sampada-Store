// lib/nextApiErrorHandler.js
// Next.js-compatible API error handling system

import crypto from 'crypto';

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

// Simple logger for Next.js environment
const logger = {
  error: (message, meta = {}) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  },
  warn: (message, meta = {}) => {
    console.warn(JSON.stringify({
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  },
  info: (message, meta = {}) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  },
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(JSON.stringify({
        level: 'debug',
        message,
        timestamp: new Date().toISOString(),
        ...meta
      }));
    }
  }
};

/**
 * Enhanced API Error class with correlation tracking
 */
export class APIError extends Error {
  constructor(
    message, 
    statusCode = 500, 
    type = ERROR_TYPES.SERVER, 
    details = null,
    severity = ERROR_SEVERITY.MEDIUM,
    correlationId = null
  ) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.type = type;
    this.severity = severity;
    this.details = details;
    this.correlationId = correlationId;
    this.timestamp = new Date().toISOString();
    this.id = `API_ERR_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError);
    }
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
}

/**
 * API error definitions
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
    new APIError(message, 503, ERROR_TYPES.DATABASE, { query }, ERROR_SEVERITY.HIGH)
};

/**
 * Generate correlation ID for request tracking
 */
export const generateCorrelationId = () => {
  return `req_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
};

/**
 * Input sanitization for Next.js
 */
export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized = {};
    Object.keys(input).forEach(key => {
      sanitized[key] = sanitizeInput(input[key]);
    });
    return sanitized;
  }
  return input;
};

/**
 * Simple rate limiting for Next.js (in-memory)
 */
class SimpleRateLimit {
  constructor(windowMs = 15 * 60 * 1000, max = 100) {
    this.windowMs = windowMs;
    this.max = max;
    this.requests = new Map();
    
    // Clean up old entries every minute
    setInterval(() => {
      const now = Date.now();
      for (const [key, data] of this.requests.entries()) {
        if (now - data.windowStart > this.windowMs) {
          this.requests.delete(key);
        }
      }
    }, 60000);
  }

  check(identifier) {
    const now = Date.now();
    const key = identifier;
    const current = this.requests.get(key);

    if (!current || now - current.windowStart > this.windowMs) {
      this.requests.set(key, { count: 1, windowStart: now });
      return { allowed: true, remaining: this.max - 1 };
    }

    if (current.count >= this.max) {
      return { 
        allowed: false, 
        remaining: 0,
        resetTime: new Date(current.windowStart + this.windowMs)
      };
    }

    current.count++;
    return { allowed: true, remaining: this.max - current.count };
  }
}

const defaultRateLimit = new SimpleRateLimit();

/**
 * Next.js API handler wrapper with error handling
 */
export const withErrorHandler = (handler, options = {}) => {
  const {
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    rateLimit = defaultRateLimit,
    cors = true,
    sanitizeInput: enableSanitization = true
  } = options;

  return async (req, res) => {
    let correlationId = generateCorrelationId();
    
    try {
      // Add correlation ID to response headers
      res.setHeader('X-Correlation-ID', correlationId);

      // CORS handling
      if (cors) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Correlation-ID');
        
        if (req.method === 'OPTIONS') {
          return res.status(200).end();
        }
      }

      // Method validation
      if (!methods.includes(req.method)) {
        res.setHeader('Allow', methods.join(', '));
        const error = API_ERRORS.METHOD_NOT_ALLOWED(req.method, methods);
        error.correlationId = correlationId;
        throw error;
      }

      // Rate limiting
      if (rateLimit) {
        const clientId = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'anonymous';
        const rateLimitResult = rateLimit.check(clientId);
        
        res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining);
        
        if (!rateLimitResult.allowed) {
          const error = API_ERRORS.RATE_LIMITED('Rate limit exceeded', rateLimitResult.resetTime);
          error.correlationId = correlationId;
          throw error;
        }
      }

      // Input sanitization
      if (enableSanitization) {
        if (req.body) {
          req.body = sanitizeInput(req.body);
        }
        if (req.query) {
          req.query = sanitizeInput(req.query);
        }
      }

      // Add correlation ID to request
      req.correlationId = correlationId;

      // Log request
      logger.info('API Request', {
        correlationId,
        method: req.method,
        url: req.url,
        userAgent: req.headers['user-agent'],
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      });

      // Execute handler
      const result = await handler(req, res);
      return result;

    } catch (error) {
      return handleError(error, req, res, correlationId);
    }
  };
};

/**
 * Error handler for Next.js API routes
 */
const handleError = (error, req, res, correlationId) => {
  let apiError;
  
  if (error instanceof APIError) {
    apiError = error;
    apiError.correlationId = correlationId;
  } else {
    apiError = mapErrorToAPIError(error, correlationId);
  }

  // Log the error
  logger.error('API Error', {
    ...apiError,
    url: req.url,
    method: req.method,
    userAgent: req.headers['user-agent'],
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
  });

  // Send error response
  return res.status(apiError.statusCode).json({
    success: false,
    ...apiError.toJSON()
  });
};

/**
 * Map different error types to APIError
 */
const mapErrorToAPIError = (error, correlationId) => {
  // Next.js specific errors
  if (error.code === 'ENOENT') {
    return new APIError(
      'Resource not found',
      404,
      ERROR_TYPES.NOT_FOUND,
      null,
      ERROR_SEVERITY.LOW,
      correlationId
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
      correlationId
    );
  }

  // Default to internal server error
  return new APIError(
    process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    500,
    ERROR_TYPES.SERVER,
    process.env.NODE_ENV === 'development' ? { stack: error.stack } : null,
    ERROR_SEVERITY.HIGH,
    correlationId
  );
};

/**
 * Response helpers
 */
export const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
    correlationId: res.getHeader('X-Correlation-ID')
  });
};

export const sendError = (res, error, statusCode = 500) => {
  const errorResponse = error instanceof APIError 
    ? error.toJSON() 
    : {
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString(),
        correlationId: res.getHeader('X-Correlation-ID')
      };
  
  return res.status(statusCode).json({
    success: false,
    ...errorResponse
  });
};

/**
 * Async wrapper for Next.js API routes
 */
export const asyncHandler = (fn) => {
  return async (req, res) => {
    try {
      return await fn(req, res);
    } catch (error) {
      const correlationId = req.correlationId || generateCorrelationId();
      return handleError(error, req, res, correlationId);
    }
  };
};

// Export everything
export default {
  APIError,
  API_ERRORS,
  ERROR_TYPES,
  ERROR_SEVERITY,
  withErrorHandler,
  asyncHandler,
  sendSuccess,
  sendError,
  sanitizeInput,
  generateCorrelationId,
  logger
};