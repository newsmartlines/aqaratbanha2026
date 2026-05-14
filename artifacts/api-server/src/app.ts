import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import router from "./routes";
import { logger } from "./lib/logger";

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

// In the bundle, __dirname is where the index.mjs is (dist/)
// The frontend dist is at ../../banha-realestate/dist/public relative to the root, 
// but we need to find it relative to where this server is running or built.
const frontendDistPath = path.resolve(__dirname, "../../banha-realestate/dist/public");

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  
  // Handle SPA routing: serve index.html for non-API routes
  app.get("*", (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

export default app;
