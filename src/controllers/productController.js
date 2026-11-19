import { productModel } from '../models/product.js';

function createEnvelope(success, data = null, error = null) {
  return { success, data, error };
}

export async function getProducts(req, res, next) {
  try {
    const filters = {
      category: req.query.category,
      status: req.query.status,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      search: req.query.search
    };

    const products = productModel.findAll(filters);
    res.json(createEnvelope(true, products));
  } catch (err) {
    next(err);
  }
}

export async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const product = productModel.findById(id);

    if (!product) {
      return res.status(404).json(createEnvelope(false, null, { message: 'Product not found', code: 'NOT_FOUND' }));
    }

    res.json(createEnvelope(true, product));
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const product = productModel.create(req.body);
    res.status(201).json(createEnvelope(true, product));
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const product = productModel.update(id, req.body);

    if (!product) {
      return res.status(404).json(createEnvelope(false, null, { message: 'Product not found', code: 'NOT_FOUND' }));
    }

    res.json(createEnvelope(true, product));
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = productModel.delete(id);

    if (!deleted) {
      return res.status(404).json(createEnvelope(false, null, { message: 'Product not found', code: 'NOT_FOUND' }));
    }

    res.json(createEnvelope(true, { message: 'Product deleted successfully' }));
  } catch (err) {
    next(err);
  }
}