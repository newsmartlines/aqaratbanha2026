import { Router } from "express";
import { paginate } from "../../lib/response.js";

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/search
// Full-text + filter search for properties.
// ─────────────────────────────────────────────────────────────────────────────
router.get("/", async (req, res, next) => {
  try {
    const {
      q, type, listingType, city, area, governorate,
      minPrice, maxPrice, minArea, maxArea,
      bedrooms, bathrooms, furnished, featured, sort,
    } = req.query;

    const page  = Math.max(1, parseInt(String(req.query.page  ?? "1"),  10));
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit ?? "12"), 10)));

    // Suppress unused variable warnings until DB is connected
    void [q, type, listingType, city, area, governorate,
          minPrice, maxPrice, minArea, maxArea,
          bedrooms, bathrooms, furnished, featured, sort];

    // TODO: build Drizzle query with dynamic WHERE clauses
    return paginate(res, [], 0, page, limit);
  } catch (err) {
    return next(err);
  }
});

export default router;
