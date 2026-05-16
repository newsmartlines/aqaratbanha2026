import type { Request, Response, NextFunction } from "express";
import type { ZodTypeAny, z } from "zod";
import { ValidationError } from "../lib/errors.js";

interface Schemas {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

/**
 * Validate request body, query, and params against Zod schemas.
 *
 * Usage:
 *   router.post("/properties", validate({ body: createPropertySchema }), handler)
 */
export function validate(schemas: Schemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) req.query = schemas.query.parse(req.query) as z.infer<typeof schemas.query>;
      if (schemas.params) req.params = schemas.params.parse(req.params);
      next();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "issues" in err) {
        const issues = (err as { issues: { message: string }[] }).issues;
        return next(new ValidationError(issues.map(i => i.message).join(", ")));
      }
      next(new ValidationError());
    }
  };
}
