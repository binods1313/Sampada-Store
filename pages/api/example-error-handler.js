// pages/api/example.js
// Example Next.js API route using the error handler

import { withErrorHandler, API_ERRORS, sendSuccess, sendError } from '../../lib/nextApiErrorHandler';

// Your API logic
const handler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        // Simulate some business logic
        const data = { 
          message: 'Hello from protected API!',
          timestamp: new Date().toISOString(),
          correlationId: req.correlationId
        };
        
        return sendSuccess(res, data, 'Data retrieved successfully');
      } catch (error) {
        throw API_ERRORS.INTERNAL_ERROR('Failed to retrieve data', error.message);
      }

    case 'POST':
      try {
        const { name, email } = req.body;
        
        // Basic validation
        if (!name || !email) {
          throw API_ERRORS.VALIDATION_FAILED({
            name: !name ? 'Name is required' : null,
            email: !email ? 'Email is required' : null
          });
        }

        // Simulate processing
        const result = { 
          id: Math.random().toString(36).substr(2, 9),
          name, 
          email,
          created: new Date().toISOString()
        };
        
        return sendSuccess(res, result, 'User created successfully', 201);
      } catch (error) {
        if (error instanceof Error && error.name === 'APIError') {
          throw error; // Re-throw API errors
        }
        throw API_ERRORS.INTERNAL_ERROR('Failed to create user', error.message);
      }

    default:
      // This will be handled by withErrorHandler automatically
      throw API_ERRORS.METHOD_NOT_ALLOWED(method, ['GET', 'POST']);
  }
};

// Wrap with error handler
export default withErrorHandler(handler, {
  methods: ['GET', 'POST'],
  cors: true,
  sanitizeInput: true
});