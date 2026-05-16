import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../lib/errors.js";
import { logger } from "../lib/logger.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      data: null,
      error: { code: err.code, message: err.message },
      meta: null,
    });
  }

  logger.error(err, "Unhandled error");

  return res.status(500).json({
    success: false,
    data: null,
    error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
    meta: null,
  });
}
