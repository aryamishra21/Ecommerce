import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodType } from "zod";

type RequestSchemas = {
  body?: ZodType<any, any, any>;
  query?: ZodType<any, any, any>;
  params?: ZodType<any, any, any>;
};


export const validate =
  (schemas: RequestSchemas) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as any;
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as any;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.issues, // ✅ zod v4
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };