import { RedisClientType, createClient } from "redis";

import { config } from "@/config/config";
import { AppError } from "@/utils/AppError";
import { logger } from "@/utils/logger";

let redisClient: RedisClientType | null = null;

export async function initializeRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: config.get("REDIS_URL") || "redis://localhost:6379",
    });

    redisClient.on("error", (error) =>
      logger.error("Redis redisClient Error", error),
    );
    redisClient.on("connect", () => logger.info("Redis redisClient connected"));

    if (!redisClient.isOpen) await redisClient.connect();
  } else {
    return redisClient;
  }
}

export function getRedisClient(): RedisClientType {
  if (!redisClient) throw new AppError("Redis client not initialized!", 500);
  return redisClient;
}
