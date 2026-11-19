import { Router } from 'express';
import { validationResult } from 'express-validator';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct
} from '../controllers/productController.js';
import { validateCreate, validateUpdate, validateFilters } from '../validators/productValidator.js';
import { catchAsync } from '../middleware/catchAsync.js';

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors.array().map(e => e.msg)
      }
    });
  }
  next();
}

const router = Router();

router.get('/', validateFilters, validate, catchAsync(getProducts));
router.get('/:id', catchAsync(getProductById));
router.post('/', validateCreate, validate, catchAsync(createProduct));
router.patch('/:id', validateUpdate, validate, catchAsync(updateProduct));
router.delete('/:id', catchAsync(deleteProduct));
router.delete('/:id/restore', catchAsync(restoreProduct));

export default router;