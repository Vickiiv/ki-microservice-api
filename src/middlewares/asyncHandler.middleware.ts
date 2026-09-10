import type { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler =
  (rh: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(rh(req, res, next)).catch(next);
  };
