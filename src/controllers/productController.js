import { productModel } from '../models/product.js';

function createEnvelope(success, data = null, error = null) {
  return { success, data, error };
}

async function getProducts(req, res) {
  const filters = {
    category: req.query.category,
    status: req.query.status,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    search: req.query.search,
    inStock: req.query.inStock === 'true' ? true : req.query.inStock === 'false' ? false : undefined
  };

  const products = productModel.findAll(filters);
  res.json(createEnvelope(true, products));
}

async function getProductById(req, res) {
  const { id } = req.params;
  const product = productModel.findById(id);

  if (!product) {
    return res.status(404).json(createEnvelope(false, null, { message: 'Product not found', code: 'NOT_FOUND' }));
  }

  res.json(createEnvelope(true, product));
}

async function createProduct(req, res) {
  const product = productModel.create(req.body);
  res.status(201).json(createEnvelope(true, product));
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const product = productModel.update(id, req.body);

  if (!product) {
    return res.status(404).json(createEnvelope(false, null, { message: 'Product not found', code: 'NOT_FOUND' }));
  }

  res.json(createEnvelope(true, product));
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  const deleted = productModel.delete(id);

  if (!deleted) {
    return res.status(404).json(createEnvelope(false, null, { message: 'Product not found', code: 'NOT_FOUND' }));
  }

  res.json(createEnvelope(true, { message: 'Product archived successfully' }));
}

async function restoreProduct(req, res) {
  const { id } = req.params;
  const product = productModel.restore(id);

  if (!product) {
    return res.status(404).json(createEnvelope(false, null, { message: 'Product not found', code: 'NOT_FOUND' }));
  }

  res.json(createEnvelope(true, product));
}

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct, restoreProduct };