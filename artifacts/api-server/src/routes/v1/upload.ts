import { Router } from "express";
import { ok } from "../../lib/response.js";
import { requireAuth } from "../../middlewares/auth.js";
import { ApiError } from "../../lib/errors.js";

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/upload/image
// Auth required. Upload a property image.
// Accepts: multipart/form-data with field "image" (max 10 MB)
//
// Returns: { url, key, width, height }
//
// Works for both web browser uploads and mobile app camera/gallery uploads.
// ─────────────────────────────────────────────────────────────────────────────
router.post("/image", requireAuth, async (req, res, next) => {
  try {
    // TODO: set up multer or busboy for multipart parsing
    // TODO: validate file type (image/jpeg, image/png, image/webp)
    // TODO: apply watermark using sharp (see watermark utils on frontend)
    // TODO: upload to object storage (S3 / Cloudflare R2 / Replit Object Storage)
    // TODO: return the public URL

    // Placeholder response
    return ok(res, {
      url: "https://placeholder.com/property-image.jpg",
      key: `uploads/${req.user!.id}/${Date.now()}.jpg`,
      width: 1280,
      height: 720,
    });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/v1/upload/image
// Body: { key }
// Auth required. Delete an uploaded image.
// ─────────────────────────────────────────────────────────────────────────────
router.delete("/image", requireAuth, async (req, res, next) => {
  try {
    const { key } = req.body;
    if (!key) throw new ApiError(422, "VALIDATION_ERROR", "key is required");

    // TODO: verify the key belongs to req.user.id, then delete from storage
    return ok(res, { message: "Image deleted", key });
  } catch (err) {
    next(err);
  }
});

export default router;
