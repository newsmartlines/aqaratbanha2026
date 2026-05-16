import { Router } from "express";
import { ok, created, fail } from "../../lib/response.js";

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/auth/register
// Body: { name, email, password, phone? }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return fail(res, 422, "VALIDATION_ERROR", "name, email, and password are required");
    }

    // TODO: hash password (bcrypt), insert into users table, generate JWT
    const mockUser = { id: 1, name, email, role: "user" };
    const mockToken = Buffer.from(JSON.stringify({ id: 1, email, role: "user" })).toString("base64url");

    return created(res, {
      user: mockUser,
      token: `header.${mockToken}.signature`,
      refreshToken: "refresh-token-placeholder",
    });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/auth/login
// Body: { email, password }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return fail(res, 422, "VALIDATION_ERROR", "email and password are required");
    }

    // TODO: query user by email, verify bcrypt hash, generate JWT
    const mockUser = { id: 1, name: "Test User", email, role: "user" };
    const mockToken = Buffer.from(JSON.stringify({ id: 1, email, role: "user" })).toString("base64url");

    return ok(res, {
      user: mockUser,
      token: `header.${mockToken}.signature`,
      refreshToken: "refresh-token-placeholder",
      expiresIn: 3600,
    });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/auth/refresh
// Body: { refreshToken }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return fail(res, 422, "VALIDATION_ERROR", "refreshToken is required");
    }

    // TODO: verify refresh token from DB, issue new access token
    return ok(res, {
      token: "new-access-token-placeholder",
      expiresIn: 3600,
    });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/auth/logout
// Header: Authorization: Bearer <token>
// ─────────────────────────────────────────────────────────────────────────────
router.post("/logout", async (_req, res, next) => {
  try {
    // TODO: invalidate refresh token in DB
    return ok(res, { message: "Logged out successfully" });
  } catch (err) {
    return next(err);
  }
});

export default router;
