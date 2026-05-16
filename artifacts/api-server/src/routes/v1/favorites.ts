import { Router } from "express";
import { ok, created } from "../../lib/response.js";
import { requireAuth } from "../../middlewares/auth.js";
import { NotFoundError, ConflictError } from "../../lib/errors.js";

const router = Router();

// All favorites routes require authentication.
router.use(requireAuth);

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/favorites
// ─────────────────────────────────────────────────────────────────────────────
router.get("/", async (req, res, next) => {
  try {
    // TODO: query favorites JOIN properties WHERE user_id = req.user.id
    return ok(res, []);
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/favorites/:propertyId
// ─────────────────────────────────────────────────────────────────────────────
router.post("/:propertyId", async (req, res, next) => {
  try {
    const propertyId = parseInt(String(req.params["propertyId"]), 10);
    if (isNaN(propertyId)) throw new NotFoundError("Property");

    // TODO: check if already favorited (throw ConflictError), insert into favorites table
    void ConflictError;
    return created(res, { userId: req.user!.id, propertyId });
  } catch (err) {
    return next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/v1/favorites/:propertyId
// ─────────────────────────────────────────────────────────────────────────────
router.delete("/:propertyId", async (req, res, next) => {
  try {
    const propertyId = parseInt(String(req.params["propertyId"]), 10);
    if (isNaN(propertyId)) throw new NotFoundError("Property");

    // TODO: delete from favorites WHERE user_id = req.user.id AND property_id = propertyId
    return ok(res, { message: "Removed from favorites" });
  } catch (err) {
    return next(err);
  }
});

export default router;
