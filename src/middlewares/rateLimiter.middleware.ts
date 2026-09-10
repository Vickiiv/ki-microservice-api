import rateLimit from "express-rate-limit";

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  message: {
    message: "Zu viele Anfragen. Bitte warte kurz und versuch es erneut.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
