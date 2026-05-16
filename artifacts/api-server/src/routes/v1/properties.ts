import { Router } from "express";
import { ok, created, paginate } from "../../lib/response.js";
import { requireAuth, optionalAuth } from "../../middlewares/auth.js";
import { NotFoundError } from "../../lib/errors.js";

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/properties
// Query: page, limit, type, listingType, city, area, minPrice, maxPrice,
//        minArea, maxArea, bedrooms, bathrooms, featured, sort, q
// Public — no auth required. Mobile app and website use this endpoint.
// ─────────────────────────────────────────────────────────────────────────────
router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(String(req.query.page  ?? "1"),  10));
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit ?? "12"), 10)));

    // TODO: query DB with Drizzle ORM using filters from req.query
    const mockProperties = [
      {
        id: 1,
        title: "شقة فاخرة في بنها",
        titleEn: "Luxury Apartment in Banha",
        type: "apartment",
        listingType: "sale",
        price: 850000,
        currency: "EGP",
        area: 150,
        bedrooms: 3,
        bathrooms: 2,
        floor: 4,
        city: "بنها",
        area_name: "ميدان بنها",
        governorate: "القليوبية",
        lat: 30.4667,
        lng: 31.1667,
        images: [],
        featured: false,
        verified: true,
        createdAt: new Date().toISOString(),
      },
    ];

    return paginate(res, mockProperties, 1, page, limit);
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/properties/featured
// Returns featured/promoted listings for homepage and app home screen.
// ─────────────────────────────────────────────────────────────────────────────
router.get("/featured", async (_req, res, next) => {
  try {
    // TODO: query DB for featured = true, ordered by boost_until DESC
    return ok(res, []);
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/properties/:id
// Public endpoint — returns full property detail.
// ─────────────────────────────────────────────────────────────────────────────
router.get("/:id", optionalAuth, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new NotFoundError("Property");

    // TODO: query DB by id, increment view_count
    const mock = {
      id,
      title: "شقة فاخرة في بنها",
      titleEn: "Luxury Apartment in Banha",
      description: "شقة واسعة في قلب بنها",
      type: "apartment",
      listingType: "sale",
      price: 850000,
      currency: "EGP",
      area: 150,
      bedrooms: 3,
      bathrooms: 2,
      floor: 4,
      city: "بنها",
      area_name: "ميدان بنها",
      governorate: "القليوبية",
      lat: 30.4667,
      lng: 31.1667,
      images: [],
      amenities: [],
      featured: false,
      verified: true,
      viewCount: 0,
      isFavorite: req.user ? false : null,
      owner: { id: 1, name: "محمد علي", phone: "+20100000000" },
      createdAt: new Date().toISOString(),
    };

    return ok(res, mock);
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/properties
// Auth required. Create a new property listing.
// ─────────────────────────────────────────────────────────────────────────────
router.post("/", requireAuth, async (req, res, next) => {
  try {
    // TODO: validate body with Zod, insert into properties table
    const newProperty = { id: Date.now(), ...req.body, ownerId: req.user!.id };
    return created(res, newProperty);
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/v1/properties/:id
// Auth required. Owner or admin can update.
// ─────────────────────────────────────────────────────────────────────────────
router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new NotFoundError("Property");

    // TODO: verify ownership (req.user.id === property.ownerId || req.user.role === "admin")
    // TODO: update in DB
    return ok(res, { id, ...req.body, updatedAt: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/v1/properties/:id
// Auth required. Owner or admin can delete.
// ─────────────────────────────────────────────────────────────────────────────
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) throw new NotFoundError("Property");

    // TODO: soft-delete in DB (set deleted_at = now())
    return ok(res, { message: `Property ${id} deleted` });
  } catch (err) {
    next(err);
  }
});

export default router;
