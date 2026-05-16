import type { Response } from "express";

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string } | null;
  meta: ApiMeta | null;
}

export function ok<T>(res: Response, data: T, meta?: ApiMeta, status = 200) {
  return res.status(status).json({
    success: true,
    data,
    error: null,
    meta: meta ?? null,
  } satisfies ApiResponse<T>);
}

export function created<T>(res: Response, data: T) {
  return ok(res, data, undefined, 201);
}

export function fail(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
) {
  return res.status(statusCode).json({
    success: false,
    data: null,
    error: { code, message },
    meta: null,
  } satisfies ApiResponse);
}

export function paginate<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
) {
  return ok(res, data, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
}
