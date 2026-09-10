import express from "express";
import { suggestTags } from "../controllers/tags.controller.ts";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.ts";
import { aiRateLimiter } from "../middlewares/rateLimiter.middleware.ts";

const router = express.Router();
router.post("/", aiRateLimiter, asyncHandler(suggestTags));

export default router;
