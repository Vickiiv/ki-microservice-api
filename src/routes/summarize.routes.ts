import express from "express";
import { summarize } from "../controllers/summarize.controller.ts";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.ts";
import { aiRateLimiter } from "../middlewares/rateLimiter.middleware.ts";

const router = express.Router();
router.post("/", aiRateLimiter, asyncHandler(summarize));

export default router;
