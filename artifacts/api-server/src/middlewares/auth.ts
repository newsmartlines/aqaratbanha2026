import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../lib/errors.js";

// ─────────────────────────────────────────────────────────────────────────────
// JWT Auth Middleware
// ─────────────────────────────────────────────────────────────────────────────
// Uses a Bearer token in the Authorization header.
// Works identically for the website and any future mobile app.
//
// Header format:  Authorization: Bearer <token>
//
// To add real JWT verification, install `jsonwebtoken` and replace the
// TODO block below with: jwt.verify(token, process.env.JWT_SECRET)
// ─────────────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  email: string;
  role: "user" | "agent" | "admin";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

function extractToken(req: Request): string | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

// TODO: Replace this stub with real JWT.verify() once JWT_SECRET is set in env.
function verifyToken(token: string): AuthUser {
  // Placeholder — decode a base64 JSON payload for local development.
  // In production: const payload = jwt.verify(token, process.env.JWT_SECRET!)
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1] ?? token, "base64url").toString("utf8"),
    );
    if (!payload?.id || !payload?.email) throw new Error();
    return { id: payload.id, email: payload.email, role: payload.role ?? "user" };
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}

/** Require a valid Bearer token. Attaches req.user on success. */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) return next(new UnauthorizedError("No token provided"));
  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    next(err);
  }
}

/** Optionally attach user if a token is present, but don't block the request. */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    try {
      req.user = verifyToken(token);
    } catch {
      // ignore — continue as unauthenticated
    }
  }
  next();
}

/** Require the authenticated user to have one of the given roles. */
export function requireRole(...roles: AuthUser["role"][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new UnauthorizedError());
    if (!roles.includes(req.user.role))
      return next(new UnauthorizedError("Insufficient permissions"));
    next();
  };
}
