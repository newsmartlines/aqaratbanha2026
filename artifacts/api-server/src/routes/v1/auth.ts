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
// POST /api/v1/auth/google
// Body: { googleId, email, name, picture }
// Verifies Google OAuth token and creates/finds user
// ─────────────────────────────────────────────────────────────────────────────
router.post("/google", async (req, res, next) => {
  try {
    const { googleId, email, name, picture } = req.body;

    if (!googleId || !email) {
      return fail(res, 422, "VALIDATION_ERROR", "googleId and email are required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return fail(res, 422, "VALIDATION_ERROR", "Invalid email format");
    }

    // TODO: In production:
    // 1. Verify the Google ID token with Google's API:
    //    GET https://oauth2.googleapis.com/tokeninfo?id_token=<TOKEN>
    // 2. Check if user exists by googleId OR email (smart account linking)
    // 3. If exists by email but no googleId → link Google account to existing user
    // 4. If new user → create account with googleId + profile data
    // 5. Generate real JWT with jsonwebtoken

    const isNewUser = Math.random() > 0.5; // Mock: randomly treat as new or returning

    const mockUser = {
      id: Math.floor(Math.random() * 10000),
      name: name ?? email.split("@")[0],
      email,
      picture: picture ?? null,
      googleId,
      role: "user",
      provider: "google",
      isNewUser,
      registeredAt: new Date().toISOString(),
    };

    const mockToken = Buffer.from(JSON.stringify({
      id: mockUser.id,
      email,
      role: "user",
      provider: "google",
    })).toString("base64url");

    return ok(res, {
      user: mockUser,
      token: `header.${mockToken}.signature`,
      refreshToken: `google-refresh-${googleId.slice(0, 8)}`,
      expiresIn: 3600,
      isNewUser,
      message: isNewUser ? "تم إنشاء الحساب بنجاح" : "مرحباً بعودتك",
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
