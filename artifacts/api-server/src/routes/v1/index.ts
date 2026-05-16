import { Router } from "express";
import authRouter      from "./auth.js";
import propertiesRouter from "./properties.js";
import usersRouter     from "./users.js";
import favoritesRouter from "./favorites.js";
import locationsRouter from "./locations.js";
import searchRouter    from "./search.js";
import uploadRouter    from "./upload.js";

const v1 = Router();

// ─────────────────────────────────────────────────────────────────────────────
// API v1 Endpoints
// Base: /api/v1
// ─────────────────────────────────────────────────────────────────────────────
v1.use("/auth",       authRouter);
v1.use("/properties", propertiesRouter);
v1.use("/users",      usersRouter);
v1.use("/favorites",  favoritesRouter);
v1.use("/locations",  locationsRouter);
v1.use("/search",     searchRouter);
v1.use("/upload",     uploadRouter);

export default v1;
