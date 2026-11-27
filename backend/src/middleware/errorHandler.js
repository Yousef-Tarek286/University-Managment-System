// =================================================================
// middleware/errorHandler.js — Global Error Handling Middleware
//
// Catches AppError instances (returning their exact statusCode)
// as well as unexpected server/database errors safely.
// =================================================================

import AppError from "../utils/AppError.js";

const errorHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error("Unhandled server error:", err);
  return res.status(500).json({
    success: false,
    message: "An internal server error occurred",
  });
};

export default errorHandler;
