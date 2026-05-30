function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Not found: ${req.originalUrl}`));
}
function errorHandler(err, _req, res, _next) {
  const code = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(code).json({ message: err.message, stack: process.env.NODE_ENV === 'production' ? undefined : err.stack });
}
module.exports = { notFound, errorHandler };
