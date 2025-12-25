import { rateLimit } from "express-rate-limit";

export const limitter = rateLimit({
  windowMs: 1000 * 60 * 10,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests ! try after 10 minutes.",
});
