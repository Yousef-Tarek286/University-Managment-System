// =================================================================
// utils/AppError.js — Custom Operational Error with HTTP Status
//
// Allows services to throw meaningful business-rule errors (e.g.
// 409 Conflict when a course is full) without touching Express `res`.
// =================================================================

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

export default AppError;
