/**
 * Helper Functions Tests
 */

import {
  generateUUID,
  calculatePagination,
  slugify,
  truncate,
  pick,
  omit,
  groupBy,
  unique,
  chunk,
  formatNumber,
  formatCurrency,
  formatPercentage,
  percentageChange,
  maskEmail,
  maskPhone,
} from '../../src/utils/helpers';

describe('Helper Functions', () => {
  describe('generateUUID', () => {
    it('should generate a valid UUID', () => {
      const uuid = generateUUID();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidRegex);
    });
  });

  describe('calculatePagination', () => {
    it('should calculate pagination correctly', () => {
      const result = calculatePagination(100, 1, 20);

      expect(result).toEqual({
        page: 1,
        limit: 20,
        total: 100,
        totalPages: 5,
        hasMore: true,
      });
    });

    it('should indicate no more pages on last page', () => {
      const result = calculatePagination(100, 5, 20);

      expect(result.hasMore).toBe(false);
      expect(result.totalPages).toBe(5);
    });
  });

  describe('slugify', () => {
    it('should convert string to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test & Example')).toBe('test-example');
      expect(slugify('  Spaces  ')).toBe('spaces');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      const text = 'This is a very long string';
      expect(truncate(text, 10)).toBe('This is...');
    });

    it('should not truncate short strings', () => {
      const text = 'Short';
      expect(truncate(text, 10)).toBe('Short');
    });
  });

  describe('pick', () => {
    it('should pick specified keys from object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = pick(obj, ['a', 'c']);

      expect(result).toEqual({ a: 1, c: 3 });
    });
  });

  describe('omit', () => {
    it('should omit specified keys from object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = omit(obj, ['b']);

      expect(result).toEqual({ a: 1, c: 3 });
    });
  });

  describe('groupBy', () => {
    it('should group array by key', () => {
      const arr = [
        { type: 'A', value: 1 },
        { type: 'B', value: 2 },
        { type: 'A', value: 3 },
      ];
      const result = groupBy(arr, 'type');

      expect(result).toEqual({
        A: [
          { type: 'A', value: 1 },
          { type: 'A', value: 3 },
        ],
        B: [{ type: 'B', value: 2 }],
      });
    });
  });

  describe('unique', () => {
    it('should remove duplicates from array', () => {
      const arr = [1, 2, 2, 3, 3, 3, 4];
      expect(unique(arr)).toEqual([1, 2, 3, 4]);
    });
  });

  describe('chunk', () => {
    it('should chunk array into smaller arrays', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7];
      const result = chunk(arr, 3);

      expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    });
  });

  describe('formatNumber', () => {
    it('should format number with commas', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
    });
  });

  describe('formatCurrency', () => {
    it('should format as USD currency', () => {
      const result = formatCurrency(1000.5);
      expect(result).toMatch(/\$1,000\.50/);
    });
  });

  describe('formatPercentage', () => {
    it('should format as percentage', () => {
      expect(formatPercentage(0.5)).toBe('50.00%');
      expect(formatPercentage(0.756, 1)).toBe('75.6%');
    });
  });

  describe('percentageChange', () => {
    it('should calculate percentage change', () => {
      expect(percentageChange(100, 150)).toBe(50);
      expect(percentageChange(200, 100)).toBe(-50);
    });

    it('should handle zero old value', () => {
      expect(percentageChange(0, 100)).toBe(100);
      expect(percentageChange(0, 0)).toBe(0);
    });
  });

  describe('maskEmail', () => {
    it('should mask email address', () => {
      expect(maskEmail('john@example.com')).toBe('jo***@example.com');
      expect(maskEmail('a@example.com')).toBe('a***@example.com');
    });
  });

  describe('maskPhone', () => {
    it('should mask phone number', () => {
      expect(maskPhone('1234567890')).toBe('***7890');
      expect(maskPhone('123')).toBe('***');
    });
  });
});
