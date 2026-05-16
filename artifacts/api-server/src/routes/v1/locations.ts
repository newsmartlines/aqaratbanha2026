import { Router } from "express";
import { ok } from "../../lib/response.js";

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/locations/governorates
// Returns all governorates. Used by website and mobile app search filters.
// ─────────────────────────────────────────────────────────────────────────────
router.get("/governorates", async (_req, res, next) => {
  try {
    // TODO: query governorates table WHERE active = true
    const governorates = [
      { id: 1, name: "محافظة القليوبية", nameEn: "Qalyubia Governorate", slug: "qalyubia" },
    ];
    return ok(res, governorates);
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/locations/cities
// Query: governorateId (optional)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/cities", async (req, res, next) => {
  try {
    const governorateId = req.query.governorateId
      ? parseInt(String(req.query.governorateId), 10)
      : null;

    // TODO: query cities WHERE active = true AND (governorate_id = $1 OR $1 IS NULL)
    const cities = [
      { id: 1, name: "بنها",          nameEn: "Banha",             governorateId: 1 },
      { id: 2, name: "منية القمح",    nameEn: "Minyet El-Qamh",    governorateId: 1 },
      { id: 3, name: "شبين الكنائر", nameEn: "Shebin El-Kanater", governorateId: 1 },
      { id: 4, name: "طوخ",           nameEn: "Tookh",             governorateId: 1 },
      { id: 5, name: "قليوب",         nameEn: "Qaliub",            governorateId: 1 },
      { id: 6, name: "كفر شكر",       nameEn: "Kafr Shukr",        governorateId: 1 },
    ].filter(c => governorateId ? c.governorateId === governorateId : true);

    return ok(res, cities);
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/locations/areas
// Query: cityId (optional)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/areas", async (req, res, next) => {
  try {
    const cityId = req.query.cityId
      ? parseInt(String(req.query.cityId), 10)
      : null;

    // TODO: query areas WHERE active = true AND (city_id = $1 OR $1 IS NULL)
    const areas = [
      { id: 1, name: "ميدان بنها",  nameEn: "Banha Square",    cityId: 1 },
      { id: 2, name: "الشروق",      nameEn: "El-Shorouk",      cityId: 1 },
      { id: 3, name: "وسط البلد",   nameEn: "Downtown",        cityId: 1 },
      { id: 4, name: "سراي القبة",  nameEn: "Saraya Al-Qobba", cityId: 1 },
    ].filter(a => cityId ? a.cityId === cityId : true);

    return ok(res, areas);
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/locations/all
// Returns the full tree (governorates → cities → areas) in one request.
// Useful for mobile apps that want to cache the entire hierarchy.
// ─────────────────────────────────────────────────────────────────────────────
router.get("/all", async (_req, res, next) => {
  try {
    // TODO: query all three tables and build the nested structure
    return ok(res, {
      governorates: [
        {
          id: 1,
          name: "محافظة القليوبية",
          nameEn: "Qalyubia Governorate",
          cities: [
            {
              id: 1, name: "بنها", nameEn: "Banha",
              areas: [
                { id: 1, name: "ميدان بنها",  nameEn: "Banha Square" },
                { id: 2, name: "الشروق",      nameEn: "El-Shorouk" },
                { id: 3, name: "وسط البلد",   nameEn: "Downtown" },
                { id: 4, name: "سراي القبة",  nameEn: "Saraya Al-Qobba" },
              ],
            },
          ],
        },
      ],
    });
  } catch (err) {
    next(err);
  }
});

export default router;
