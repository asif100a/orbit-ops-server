import { createClient, type RedisClientType } from "redis";
import { envConfig } from "../config/env";
import AppError from "../errorHandlers/AppError";

let redisClient: RedisClientType | null = null;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const initializeRedis = async () => {
  redisClient = createClient({
    url: envConfig.REDIS_URL,
    socket: {
      connectTimeout: 10_000,
    },
  });

  redisClient.on("error", (err) => console.error("Redis error: ", err));

  let lastError: unknown;
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      await redisClient.connect();
      return redisClient;
    } catch (error) {
      lastError = error;
      console.warn(`Redis connection attempt ${attempt} failed, retrying...`);
      await sleep(1000);
    }
  }

  throw lastError;
};

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new AppError(400, "Redis client not initialized");
  }
  return redisClient;
};

export const setOtp = async (
  email: string,
  otp: string,
  expirySeconds: number = 600, // 10 minutes
): Promise<void> => {
    const client = getRedisClient();
    const key = `otp:${email}`
    await client.setEx(key, expirySeconds, otp);
};

export const getOtp = async(email: string): Promise<string | null> => {
    const client = getRedisClient();
    const key = `otp:${email}`;
    return await client.get(key)
}

export const deleteOtp = async(email: string): Promise<void> => {
    const client = getRedisClient()
    const key = `otp:${email}`
    await client.del(key)
}
