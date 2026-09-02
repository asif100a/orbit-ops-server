import type { VercelRequest, VercelResponse } from "@vercel/node";
import mongoose from "mongoose";
import app from "../src/app";
import { envConfig } from "../src/app/config/env";
import { initializeRedis } from "../src/app/utils/redis.utils";

let initialization: Promise<void> | undefined;

const initializeServices = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(envConfig.DB_URL);
  }

  await initializeRedis();
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
): Promise<void> {
  initialization ??= initializeServices();

  try {
    await initialization;
    app(request, response);
  } catch (error) {
    initialization = undefined;
    throw error;
  }
}