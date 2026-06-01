import { createClient, type RedisClientType } from "redis";
import { envConfig } from "../config/env";
import AppError from "../errorHandlers/AppError";

let redisClient: RedisClientType | null = null;

export const initializeRedis = async () => {
  redisClient = createClient({
    url: envConfig.REDIS_URL,
  });

  redisClient.on("error", (err) => console.error("Redis error: ", err));
  await redisClient.connect();

  return redisClient;
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
