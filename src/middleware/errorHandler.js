function createEnvelope(success, data = null, error = null) {
  return { success, data, error };
}

export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.statusCode) {
    return res.status(err.statusCode).json(createEnvelope(false, null, {
      message: err.message,
      code: err.code || 'VALIDATION_ERROR',
      details: err.details
    }));
  }

  if (err.name === 'SyntaxError' && err.status === 400 && 'body' in err) {
    return res.status(400).json(createEnvelope(false, null, {
      message: 'Invalid JSON payload',
      code: 'INVALID_JSON'
    }));
  }

  res.status(500).json(createEnvelope(false, null, {
    message: 'Internal server error',
    code: 'INTERNAL_ERROR'
  }));
}

export function notFoundHandler(req, res) {
  res.status(404).json(createEnvelope(false, null, {
    message: 'Route not found',
    code: 'NOT_FOUND'
  }));
}