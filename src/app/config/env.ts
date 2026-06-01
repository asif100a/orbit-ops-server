import dotenv from "dotenv";

dotenv.config();

type NodeEnv = "production" | "development";

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: NodeEnv;

  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;

  JWT_REFRESH_TOKEN: string;
  JWT_REFRESH_EXPIRES_IN: string;

  BCRYPT_SALT: string;

  EXPRESS_SESSION_SECRET: string;

  FRONTEND_URL: string;

  REDIS_URL: string;

  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_SECURE: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_FROM: string;
}

export const envConfig: EnvConfig = {
  PORT: process.env.PORT as string,
  DB_URL: process.env.DB_URL as string,
  NODE_ENV: process.env.NODE_ENV as NodeEnv,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN as string,
  JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN as string,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as string,

  BCRYPT_SALT: process.env.BCRYPT_SALT as string,

  EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,

  FRONTEND_URL: process.env.FRONTEND_URL as string,

  REDIS_URL: process.env.REDIS_URL as string,

  SMTP_HOST: process.env.SMTP_HOST as string,
  SMTP_PORT: process.env.SMTP_PORT as string,
  SMTP_SECURE: process.env.SMTP_SECURE as string,
  SMTP_USER: process.env.SMTP_USER as string,
  SMTP_PASS: process.env.SMTP_PASS as string,
  SMTP_FROM: process.env.SMTP_FROM as string,
};
