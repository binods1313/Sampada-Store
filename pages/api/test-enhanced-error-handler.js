// pages/api/test-enhanced-error-handler.js
// Test endpoint to verify the enhanced apiErrorHandler functionality

import apiErrorHandler from '../../lib/apiErrorHandler';

// Destructure needed functions
const {
  createEnterpriseAPIHandler,
  API_ERRORS,
  asyncHandler,
  validateRequest,
  allowMethods,
  sendSuccess,
  sendError,
  logger
} = apiErrorHandler;

// Simple validation schema simulation (you can replace with Joi if needed)
const mockValidation = {
  validate: (data, options) => {
    const errors = [];
    if (!data.name || data.name.length < 2) {
      errors.push({
        path: ['name'],
        message: 'Name must be at least 2 characters',
        context: { value: data.name }
      });
    }
    if (!data.email || !data.email.includes('@')) {
      errors.push({
        path: ['email'],
        message: 'Valid email is required',
        context: { value: data.email }
      });
    }
    
    return errors.length > 0 
      ? { error: { details: errors } }
      : { value: data };
  }
};

// Test handlers
const handlers = {
  GET: asyncHandler(async (req, res) => {
    try {
      logger.info('GET request to test-enhanced-error-handler', {
        correlationId: req.correlationId
      });
      
      sendSuccess(res, {
        message: 'Enhanced API Error Handler is working!',
        features: [
          'Structured logging with Winston',
          'Request correlation tracking',
          'Input sanitization with DOMPurify',
          'Rate limiting with Redis support',
          'Security headers with Helmet',
          'CORS configuration',
          'Circuit breaker pattern',
          'Comprehensive error mapping',
          'Metrics collection',
          'Health checks'
        ],
        correlationId: req.correlationId
      });
    } catch (error) {
      console.error('Error in GET handler:', error);
      sendError(res, error);
    }
  }),

  POST: [
    allowMethods(['POST']),
    validateRequest(mockValidation, { validateBody: true }),
    asyncHandler(async (req, res) => {
      try {
        const { name, email } = req.body;
        
        logger.info('POST request processed successfully', {
          correlationId: req.correlationId,
          name,
          email
        });
        
        sendSuccess(res, {
          message: 'Data validated and processed successfully',
          data: { name, email },
          correlationId: req.correlationId
        }, 'Success', 201);
      } catch (error) {
        console.error('Error in POST handler:', error);
        sendError(res, error);
      }
    })
  ],

  // Test error scenarios
  DELETE: asyncHandler(async (req, res) => {
    try {
      const { errorType } = req.query;
      
      let error;
      switch (errorType) {
        case 'validation':
          error = API_ERRORS.VALIDATION_FAILED({
            field: 'test',
            message: 'Test validation error'
          });
          break;
        
        case 'auth':
          error = API_ERRORS.UNAUTHORIZED('Test authentication error');
          break;
        
        case 'forbidden':
          error = API_ERRORS.FORBIDDEN('Test authorization error');
          break;
        
        case 'notfound':
          error = API_ERRORS.NOT_FOUND('Test resource not found');
          break;
        
        case 'ratelimit':
          error = API_ERRORS.RATE_LIMITED('Test rate limit exceeded');
          break;
        
        case 'server':
          error = API_ERRORS.INTERNAL_ERROR('Test server error');
          break;
        
        default:
          error = new Error('Test unhandled error');
          break;
      }
      
      // Add correlation ID
      error.correlationId = req.correlationId;
      
      // Send error response
      sendError(res, error, error.statusCode || 500);
    } catch (error) {
      console.error('Error in DELETE handler:', error);
      sendError(res, error);
    }
  })
};

// Create enterprise API handler with full configuration
const enterpriseHandler = createEnterpriseAPIHandler({
  enableCors: true,
  enableSecurity: true,
  enableRateLimit: true,
  enableRequestLogging: true,
  enableInputSanitization: true,
  corsOptions: {
    origin: ['http://localhost:3000'],
    credentials: true
  },
  rateLimitOptions: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP'
  }
});

export default enterpriseHandler(handlers);