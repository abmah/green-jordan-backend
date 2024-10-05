
const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode || 500,
    path: req.originalUrl,
    method: req.method,
  });

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { error: err }),
  });
};

export default errorHandler;
