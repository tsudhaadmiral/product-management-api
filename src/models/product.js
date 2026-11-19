import { v4 as uuidv4 } from 'uuid';

const VALID_CATEGORIES = ['electronics', 'clothing', 'food', 'books', 'other'];
const VALID_STATUSES = ['active', 'inactive', 'discontinued'];

const products = new Map();

function validateProduct(data, isUpdate = false) {
  const errors = [];

  if (!isUpdate) {
    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
      errors.push('name is required and must be a non-empty string');
    }
    if (!data.sku || typeof data.sku !== 'string' || data.sku.trim() === '') {
      errors.push('sku is required and must be a non-empty string');
    }
  } else {
    if (data.name !== undefined && (typeof data.name !== 'string' || data.name.trim() === '')) {
      errors.push('name must be a non-empty string');
    }
    if (data.sku !== undefined && (typeof data.sku !== 'string' || data.sku.trim() === '')) {
      errors.push('sku must be a non-empty string');
    }
  }

  if (data.description !== undefined && data.description !== null && typeof data.description !== 'string') {
    errors.push('description must be a string');
  }

  if (data.category !== undefined) {
    if (!VALID_CATEGORIES.includes(data.category)) {
      errors.push(`category must be one of: ${VALID_CATEGORIES.join(', ')}`);
    }
  }

  if (data.price !== undefined) {
    if (typeof data.price !== 'number' || data.price <= 0) {
      errors.push('price must be a positive number');
    } else if (!Number.isInteger(Math.round(data.price * 100))) {
      errors.push('price must have at most 2 decimal places');
    }
  }

  if (data.stock !== undefined) {
    if (!Number.isInteger(data.stock) || data.stock < 0) {
      errors.push('stock must be a non-negative integer');
    }
  }

  if (data.status !== undefined) {
    if (!VALID_STATUSES.includes(data.status)) {
      errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
    }
  }

  return errors;
}

function findAll(filters = {}) {
  let result = Array.from(products.values()).filter(p => p.archivedAt === null);

  if (filters.category) {
    result = result.filter(p => p.category === filters.category);
  }

  if (filters.status) {
    result = result.filter(p => p.status === filters.status);
  }

  if (filters.minPrice !== undefined) {
    result = result.filter(p => p.price >= filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter(p => p.price <= filters.maxPrice);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.sku.toLowerCase().includes(searchLower) ||
      (p.description && p.description.toLowerCase().includes(searchLower))
    );
  }

  if (filters.inStock === true || filters.inStock === 'true') {
    result = result.filter(p => p.stock > 0);
  } else if (filters.inStock === false || filters.inStock === 'false') {
    result = result.filter(p => p.stock === 0);
  }

  return result;
}

function findById(id) {
  const product = products.get(id);
  if (!product || product.archivedAt !== null) {
    return null;
  }
  return product;
}

function findBySku(sku) {
  for (const product of products.values()) {
    if (product.sku === sku && product.archivedAt === null) {
      return product;
    }
  }
  return null;
}

function create(data) {
  const errors = validateProduct(data);
  if (errors.length > 0) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = errors;
    throw error;
  }

  if (findBySku(data.sku)) {
    const error = new Error('SKU already exists');
    error.statusCode = 409;
    throw error;
  }

  const product = {
    id: uuidv4(),
    name: data.name.trim(),
    sku: data.sku.trim(),
    description: data.description ? data.description.trim() : '',
    category: data.category || 'other',
    price: Number(data.price.toFixed(2)),
    stock: data.stock || 0,
    status: data.status || 'active',
    createdAt: new Date(),
    archivedAt: null
  };

  products.set(product.id, product);
  return product;
}

function update(id, patch) {
  const product = products.get(id);
  if (!product || product.archivedAt !== null) {
    return null;
  }

  const errors = validateProduct(patch, true);
  if (errors.length > 0) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = errors;
    throw error;
  }

  if (patch.sku && patch.sku !== product.sku && findBySku(patch.sku)) {
    const error = new Error('SKU already exists');
    error.statusCode = 409;
    throw error;
  }

  const updated = {
    ...product,
    name: patch.name !== undefined ? patch.name.trim() : product.name,
    sku: patch.sku !== undefined ? patch.sku.trim() : product.sku,
    description: patch.description !== undefined ? patch.description.trim() : product.description,
    category: patch.category !== undefined ? patch.category : product.category,
    price: patch.price !== undefined ? Number(patch.price.toFixed(2)) : product.price,
    stock: patch.stock !== undefined ? patch.stock : product.stock,
    status: patch.status !== undefined ? patch.status : product.status
  };

  products.set(id, updated);
  return updated;
}

function deleteProduct(id) {
  const product = products.get(id);
  if (!product || product.archivedAt !== null) {
    return false;
  }
  product.archivedAt = new Date();
  products.set(id, product);
  return true;
}

function restore(id) {
  const product = products.get(id);
  if (!product || product.archivedAt === null) {
    return null;
  }
  product.archivedAt = null;
  products.set(id, product);
  return product;
}

export const productModel = {
  findAll,
  findById,
  findBySku,
  create,
  update,
  delete: deleteProduct,
  restore
};