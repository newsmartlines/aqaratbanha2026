import { Router } from "express";
import { ok } from "../../lib/response.js";
import { requireAuth } from "../../middlewares/auth.js";

const router = Router();

// All user routes require authentication.
router.use(requireAuth);

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/users/me
// Returns the authenticated user's profile.
// ─────────────────────────────────────────────────────────────────────────────
router.get("/me", async (req, res, next) => {
  try {
    // TODO: query DB by req.user.id, return full profile
    return ok(res, {
      id: req.user!.id,
      name: "Test User",
      email: req.user!.email,
      role: req.user!.role,
      phone: null,
      avatar: null,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/v1/users/me
// Update authenticated user's profile.
// ─────────────────────────────────────────────────────────────────────────────
router.put("/me", async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    // TODO: update user in DB by req.user.id
    return ok(res, {
      id: req.user!.id,
      email: req.user!.email,
      name: name ?? "Test User",
      phone: phone ?? null,
      avatar: avatar ?? null,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/users/me/listings
// Returns all listings created by the authenticated user (for dashboard/app).
// ─────────────────────────────────────────────────────────────────────────────
router.get("/me/listings", async (req, res, next) => {
  try {
    // TODO: query properties WHERE owner_id = req.user.id
    return ok(res, []);
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/v1/users/me/password
// Body: { currentPassword, newPassword }
// ─────────────────────────────────────────────────────────────────────────────
router.put("/me/password", async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return ok(res, null); // TODO: proper validation
    }
    // TODO: verify current password, hash and update new password
    return ok(res, { message: "Password updated successfully" });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/v1/users/me
// Delete the authenticated user's account.
// ─────────────────────────────────────────────────────────────────────────────
router.delete("/me", async (req, res, next) => {
  try {
    // TODO: soft-delete user, revoke all tokens
    return ok(res, { message: "Account deleted" });
  } catch (err) {
    return next(err);
  }
});

export default router;
