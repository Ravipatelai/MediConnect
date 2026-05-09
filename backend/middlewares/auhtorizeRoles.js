const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {

    // Check if user exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    // Check role permission
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Access denied",
      });
    }

    // Allow request
    next();
  };
};

module.exports = { authorizeRole };