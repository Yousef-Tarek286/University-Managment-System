// =================================================================
// middleware/auth.middleware.js — JWT & Role Authorization
//
// Enforces Security Rules 5.1 & 5.2:
//   - Verifies the Bearer JWT token from the Authorization header.
//   - Confirms the user still exists in PostgreSQL and is active.
//   - Enforces role-based access independently of the frontend.
// =================================================================

const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const JWT_SECRET =
  process.env.JWT_SECRET || "university_super_secret_jwt_key_2026";

/**
 * Verifies the JWT and attaches the active database user to req.user.
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token required",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (_err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token",
      });
    }

    const userId = Number(decoded.id ?? decoded.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Please contact administration.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Restricts route access to users with one of the allowed roles.
 */
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action",
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole,
};
