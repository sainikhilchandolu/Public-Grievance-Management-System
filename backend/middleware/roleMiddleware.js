/**
 * Role Authorization Middleware
 * Restricts access to routes based on user roles
 * Must be used AFTER the protect middleware
 *
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'citizen')
 * @returns {Function} - Express middleware function
 *
 * Usage: router.get('/admin', protect, authorize('admin'), handler)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};

module.exports = { authorize };
