/**
 * Validators Tests
 */

import { z } from 'zod';
import {
  Validators,
  UserSchemas,
  AthleteSchemas,
  validate,
  safeValidate,
  transformZodErrors,
} from '../../src/utils/validators';

describe('Validators', () => {
  describe('Validators.uuid', () => {
    it('should validate correct UUID', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      expect(() => Validators.uuid.parse(uuid)).not.toThrow();
    });

    it('should reject invalid UUID', () => {
      expect(() => Validators.uuid.parse('invalid')).toThrow();
    });
  });

  describe('Validators.email', () => {
    it('should validate correct email', () => {
      expect(() => Validators.email.parse('test@example.com')).not.toThrow();
    });

    it('should reject invalid email', () => {
      expect(() => Validators.email.parse('invalid-email')).toThrow();
    });
  });

  describe('Validators.password', () => {
    it('should validate strong password', () => {
      expect(() => Validators.password.parse('Password123')).not.toThrow();
    });

    it('should reject weak password', () => {
      expect(() => Validators.password.parse('weak')).toThrow();
      expect(() => Validators.password.parse('nodigits')).toThrow();
    });
  });

  describe('UserSchemas.createUser', () => {
    it('should validate correct user data', () => {
      const data = {
        email: 'test@example.com',
        password: 'Password123',
        role: 'user',
      };

      expect(() => UserSchemas.createUser.parse(data)).not.toThrow();
    });

    it('should reject invalid user data', () => {
      const data = {
        email: 'invalid',
        password: 'weak',
      };

      expect(() => UserSchemas.createUser.parse(data)).toThrow();
    });
  });

  describe('AthleteSchemas.createAthlete', () => {
    it('should validate correct athlete data', () => {
      const data = {
        name: 'LeBron James',
        sport: 'Basketball',
        status: 'active',
      };

      expect(() => AthleteSchemas.createAthlete.parse(data)).not.toThrow();
    });

    it('should apply default status', () => {
      const data = {
        name: 'LeBron James',
        sport: 'Basketball',
      };

      const result = AthleteSchemas.createAthlete.parse(data);
      expect(result.status).toBe('active');
    });
  });

  describe('validate', () => {
    it('should validate and return parsed data', () => {
      const schema = z.object({ name: z.string() });
      const result = validate(schema, { name: 'Test' });

      expect(result).toEqual({ name: 'Test' });
    });

    it('should throw on validation error', () => {
      const schema = z.object({ name: z.string() });
      expect(() => validate(schema, { name: 123 })).toThrow();
    });
  });

  describe('safeValidate', () => {
    it('should return success result for valid data', () => {
      const schema = z.object({ name: z.string() });
      const result = safeValidate(schema, { name: 'Test' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ name: 'Test' });
      }
    });

    it('should return error result for invalid data', () => {
      const schema = z.object({ name: z.string() });
      const result = safeValidate(schema, { name: 123 });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toBeDefined();
      }
    });
  });

  describe('transformZodErrors', () => {
    it('should transform Zod errors to field errors', () => {
      const schema = z.object({
        email: z.string().email(),
        age: z.number().min(18),
      });

      try {
        schema.parse({ email: 'invalid', age: 10 });
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors = transformZodErrors(error);

          expect(fieldErrors).toHaveLength(2);
          expect(fieldErrors[0].field).toBe('email');
          expect(fieldErrors[1].field).toBe('age');
        }
      }
    });
  });
});
