import app from "@/app";
import { config } from "@/config/config";
import { connectDb } from "@/config/db";
import { initializeRedisClient } from "@/lib/redis/redisClient";
import { logger } from "@/utils/logger";

app.get("/", (req, res) => {
  res.send("hello world !!!");
});

(async () => {
  try {
    await connectDb();
    logger.info("Database connected successfully...");

    await initializeRedisClient();
    logger.info("Redis client connected successfully...");

    app.listen(config.get("PORT"), () => {
      logger.info(`Server is running on port http://localhost:${config.get("PORT")}`);
    });
  } catch (error) {
    if (error instanceof Error) logger.error(error.message);
    process.exit(1);
  }
})();
