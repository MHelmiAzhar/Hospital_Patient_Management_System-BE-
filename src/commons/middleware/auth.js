const jwt = require('jsonwebtoken');
const AuthenticationError = require('../exceptions/AuthenticationError');
const AuthorizationError = require('../exceptions/AuthorizationError');
const { checkEmailExists } = require('../../repositories/userRepositories');
const { resErrorHandler } = require('../exceptions/resHandler');

/**
 * Middleware to verify JWT and attach decoded user to req.user
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) {
      throw new AuthenticationError('Authorization header missing');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new AuthenticationError('Invalid Authorization header format');
    }

    const token = parts[1];
    if (!token) {
      throw new AuthenticationError('Token missing');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // get user from DB by decoded.id (assuming JWT payload contains user id)
    const user = await checkEmailExists(decoded.email);
    if (!user) {
      throw new AuthenticationError('User not found');
    }
    req.user = user;
    return next();
  } catch (err) {
    // Standardize JWT and other errors into our custom AuthenticationError
    // and pass it to the central error handler.
    if (err.name === 'TokenExpiredError') {
      return next(new AuthenticationError('Token has expired'));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new AuthenticationError('Invalid token'));
    }
    // Forward our custom errors or create a new one for other cases
    return next(err instanceof AuthenticationError ? err : new AuthenticationError(err.message || 'Authentication failed'));
  }
};

/**
 * Role guard factory. Usage: requireRole('ADMIN') or requireRole('DOCTOR', 'ADMIN')
 */
const requireRole = (...roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not authenticated');
      }

      if (!roles.includes(req.user.role)) {
        throw new AuthorizationError('Insufficient permissions');
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
};

module.exports = {
  authenticate,
  requireRole,
};
