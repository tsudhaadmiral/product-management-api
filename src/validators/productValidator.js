import { body, query, param } from 'express-validator';

const VALID_CATEGORIES = ['electronics', 'clothing', 'food', 'books', 'other'];
const VALID_STATUSES = ['active', 'inactive', 'discontinued'];

function isValidPrice(value) {
  if (typeof value !== 'number' || value <= 0) {
    return false;
  }
  return Number.isInteger(Math.round(value * 100));
}

export const validateCreate = [
  body('name')
    .exists()
    .withMessage('name is required')
    .isString()
    .withMessage('name must be a string')
    .trim()
    .notEmpty()
    .withMessage('name must be a non-empty string'),
  body('sku')
    .exists()
    .withMessage('sku is required')
    .isString()
    .withMessage('sku must be a string')
    .trim()
    .notEmpty()
    .withMessage('sku must be a non-empty string'),
  body('description')
    .optional()
    .isString()
    .withMessage('description must be a string'),
  body('category')
    .optional()
    .isIn(VALID_CATEGORIES)
    .withMessage(`category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  body('price')
    .optional()
    .custom(isValidPrice)
    .withMessage('price must be a positive number with at most 2 decimal places'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('stock must be a non-negative integer'),
  body('status')
    .optional()
    .isIn(VALID_STATUSES)
    .withMessage(`status must be one of: ${VALID_STATUSES.join(', ')}`)
];

export const validateUpdate = [
  body('name')
    .optional()
    .isString()
    .withMessage('name must be a string')
    .trim()
    .notEmpty()
    .withMessage('name must be a non-empty string'),
  body('sku')
    .optional()
    .isString()
    .withMessage('sku must be a string')
    .trim()
    .notEmpty()
    .withMessage('sku must be a non-empty string'),
  body('description')
    .optional()
    .isString()
    .withMessage('description must be a string'),
  body('category')
    .optional()
    .isIn(VALID_CATEGORIES)
    .withMessage(`category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  body('price')
    .optional()
    .custom(isValidPrice)
    .withMessage('price must be a positive number with at most 2 decimal places'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('stock must be a non-negative integer'),
  body('status')
    .optional()
    .isIn(VALID_STATUSES)
    .withMessage(`status must be one of: ${VALID_STATUSES.join(', ')}`)
];

export const validateFilters = [
  query('category')
    .optional()
    .isIn(VALID_CATEGORIES)
    .withMessage(`category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  query('status')
    .optional()
    .isIn(VALID_STATUSES)
    .withMessage(`status must be one of: ${VALID_STATUSES.join(', ')}`),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('minPrice must be a non-negative number'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('maxPrice must be a non-negative number'),
  query('inStock')
    .optional()
    .isBoolean()
    .withMessage('inStock must be a boolean (true/false)'),
  query('search')
    .optional()
    .isString()
    .withMessage('search must be a string')
];