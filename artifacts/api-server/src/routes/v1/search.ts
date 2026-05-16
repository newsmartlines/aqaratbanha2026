import { Router } from "express";
import { paginate } from "../../lib/response.js";

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/search
// Full-text + filter search for properties.
// Used by both the website search page and mobile app search screen.
//
// Query params:
//   q           - free text search (title, description)
//   type        - apartment | villa | shop | land | office | warehouse
//   listingType - sale | rent
//   city        - city name or id
//   area        - area name or id
//   governorate - governorate name or id
//   minPrice    - number
//   maxPrice    - number
//   minArea     - number (m²)
//   maxArea     - number (m²)
//   bedrooms    - number
//   bathrooms   - number
//   floor       - number
//   furnished   - true | false
//   featured    - true | false
//   sort        - newest | oldest | price_asc | price_desc | area_asc | area_desc
//   page        - number (default 1)
//   limit       - number (default 12, max 50)
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

    // Log filters for now (suppress unused variable warnings)
    void [q, type, listingType, city, area, governorate,
          minPrice, maxPrice, minArea, maxArea,
          bedrooms, bathrooms, furnished, featured, sort];

    // TODO: build Drizzle query with dynamic WHERE clauses
    // Example:
    //   let query = db.select().from(propertiesTable)
    //   if (q) query = query.where(ilike(propertiesTable.title, `%${q}%`))
    //   if (type) query = query.where(eq(propertiesTable.type, type))
    //   ...

    return paginate(res, [], 0, page, limit);
  } catch (err) {
    next(err);
  }
});

export default router;
