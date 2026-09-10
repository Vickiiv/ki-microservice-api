import express from "express";
import { summarize } from "../controllers/summarize.controller.ts";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.ts";

const router = express.Router();
router.post("/", asyncHandler(summarize));

export default router;
