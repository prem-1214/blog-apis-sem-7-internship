import { getRedisClient } from "@/lib/redis/redisClient";

class CacheService {
  async setCache<T>(key: string, value: T, ttl = 3600): Promise<void> {
    const redisClient = getRedisClient();
    const stringValue = JSON.stringify(value);
    await redisClient.setEx(key, ttl, stringValue);
  }

  async getCache<T>(key: string): Promise<T | null> {
    const redisClient = getRedisClient();
    const data = await redisClient.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  }

  async deleteCache(key: string): Promise<void> {
    const redisClient = getRedisClient();
    await redisClient.del(key);
  }

  async clearCache(): Promise<void> {
    const redisClient = getRedisClient();
    await redisClient.flushAll();
  }

  async hset(key: string, field: string, value: string): Promise<void> {
    const redisClient = getRedisClient();
    await redisClient.HSET(key, field, value);
  }

  async hget(key: string, field: string): Promise<string | null> {
    const redisClient = getRedisClient();
    return await redisClient.HGET(key, field);
  }
}

export const cacheService = new CacheService();
