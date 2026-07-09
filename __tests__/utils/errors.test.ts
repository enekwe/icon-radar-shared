/**
 * Error Classes Tests
 */

import {
  ApiError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  ExternalAPIError,
  DatabaseError,
  ErrorFactory,
  isOperationalError,
  toApiError,
  HttpStatus,
} from '../../src/utils/errors';

describe('Error Classes', () => {
  describe('ApiError', () => {
    it('should create an ApiError with all properties', () => {
      const error = new ApiError('Test error', 400, 'TEST_ERROR', true, 'corr-123', { foo: 'bar' });

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.isOperational).toBe(true);
      expect(error.correlationId).toBe('corr-123');
      expect(error.metadata).toEqual({ foo: 'bar' });
    });

    it('should convert to JSON correctly', () => {
      const error = new ApiError('Test error', 400, 'TEST_ERROR', true, 'corr-123');
      const json = error.toJSON();

      expect(json).toEqual({
        success: false,
        error: 'Test error',
        code: 'TEST_ERROR',
        statusCode: 400,
        correlationId: 'corr-123',
        metadata: undefined,
      });
    });
  });

  describe('NotFoundError', () => {
    it('should create a NotFoundError with correct status code', () => {
      const error = new NotFoundError('Resource not found');

      expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(error.code).toBe('NOT_FOUND');
      expect(error.message).toBe('Resource not found');
    });
  });

  describe('ValidationError', () => {
    it('should create a ValidationError with field errors', () => {
      const errors = [
        { field: 'email', message: 'Invalid email' },
        { field: 'password', message: 'Too short' },
      ];
      const error = new ValidationError('Validation failed', errors);

      expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.errors).toEqual(errors);
    });

    it('should include errors in JSON output', () => {
      const errors = [{ field: 'email', message: 'Invalid email' }];
      const error = new ValidationError('Validation failed', errors);
      const json = error.toJSON();

      expect(json.errors).toEqual(errors);
    });
  });

  describe('ExternalAPIError', () => {
    it('should create an ExternalAPIError with service info', () => {
      const error = new ExternalAPIError('crunchbase', 'API call failed', '/search', new Error('Timeout'));

      expect(error.service).toBe('crunchbase');
      expect(error.endpoint).toBe('/search');
      expect(error.statusCode).toBe(HttpStatus.BAD_GATEWAY);
    });
  });

  describe('isOperationalError', () => {
    it('should return true for operational errors', () => {
      const error = new NotFoundError('Not found');
      expect(isOperationalError(error)).toBe(true);
    });

    it('should return false for non-operational errors', () => {
      const error = new Error('Unknown error');
      expect(isOperationalError(error)).toBe(false);
    });
  });

  describe('toApiError', () => {
    it('should convert Error to ApiError', () => {
      const error = new Error('Something went wrong');
      const apiError = toApiError(error);

      expect(apiError).toBeInstanceOf(ApiError);
      expect(apiError.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should return ApiError as-is', () => {
      const error = new NotFoundError('Not found');
      const apiError = toApiError(error);

      expect(apiError).toBe(error);
    });
  });

  describe('ErrorFactory', () => {
    it('should create NotFoundError', () => {
      const error = ErrorFactory.notFound('User not found');
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe('User not found');
    });

    it('should create ValidationError', () => {
      const errors = [{ field: 'email', message: 'Invalid' }];
      const error = ErrorFactory.validation('Validation failed', errors);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.errors).toEqual(errors);
    });
  });
});
