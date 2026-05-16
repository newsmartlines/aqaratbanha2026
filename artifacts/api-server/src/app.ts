import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import router from "./routes";
import { logger } from "./lib/logger";
import { errorHandler } from "./middlewares/errorHandler";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Serve static files from the frontend build if it exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// FRONTEND_DIST env var allows overriding the path in any hosting environment.
// Default: relative to the compiled server bundle (dist/), go up to the root
// and into the frontend build output.
const frontendDistPath = process.env["FRONTEND_DIST"]
  ? path.resolve(process.env["FRONTEND_DIST"])
  : path.resolve(__dirname, "../../banha-realestate/dist/public");

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath, {
    maxAge: process.env["NODE_ENV"] === "production" ? "1y" : 0,
    etag: true,
  }));

  // Handle SPA routing: serve index.html for all non-API, non-file routes
  app.get("*", (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
} else {
  logger.warn(
    { frontendDistPath },
    "Frontend build not found — run `pnpm build:prod` to build the frontend"
  );
}

// Global error handler — must be registered last.
app.use(errorHandler);

export default app;
