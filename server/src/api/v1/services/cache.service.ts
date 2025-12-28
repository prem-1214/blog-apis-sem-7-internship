import { getRedisClient } from "@/lib/redis/redisClient";

// cache service object
export const cacheService = {
  setCache: async <T>(key: string, value: T, ttl = 3600): Promise<void> => {
    const redisClient = getRedisClient();
    const stringValue = JSON.stringify(value);
    await redisClient.setEx(key, ttl, stringValue);
  },

  getCache: async <T>(key: string): Promise<T | null> => {
    const redisClient = getRedisClient();
    const data = await redisClient.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  },

  deleteCache: async (key: string): Promise<void> => {
    const redisClient = getRedisClient();
    await redisClient.del(key);
  },

  clearCache: async (): Promise<void> => {
    const redisClient = getRedisClient();
    await redisClient.flushAll();
  },

  hset: async (key: string, field: string, value: string): Promise<void> => {
    const redisClient = getRedisClient();
    await redisClient.HSET(key, field, value);
  },

  hget: async (key: string, field: string): Promise<string | null> => {
    const redisClient = getRedisClient();
    return await redisClient.HGET(key, field);
  },
};
