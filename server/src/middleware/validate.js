import { AppError } from '../utils/AppError.js';

/**
 * Validates request body, query, or params using a Zod schema or array of field names
 * @param {import('zod').ZodSchema | string[]} schemaOrFields 
 */
export const validate = (schemaOrFields) => {
  return (req, res, next) => {
    // If a Zod schema object is passed
    if (schemaOrFields && typeof schemaOrFields.safeParse === 'function') {
      const result = schemaOrFields.safeParse(req.body);
      if (!result.success) {
        const issues = result.error?.issues || result.error?.errors || [];
        const errorMessages = issues.length > 0 
          ? issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
          : result.error?.message || 'Invalid input data';
        return next(new AppError(`Validation Error: ${errorMessages}`, 400));
      }
      // Replace req.body with parsed/sanitized data
      req.body = result.data;
      return next();
    }

    // Array of string fields fallback validation
    if (Array.isArray(schemaOrFields)) {
      const missing = schemaOrFields.filter((field) => req.body[field] === undefined || req.body[field] === '');
      if (missing.length > 0) {
        return next(new AppError(`Missing required fields: ${missing.join(', ')}`, 400));
      }
      return next();
    }

    next();
  };
};
