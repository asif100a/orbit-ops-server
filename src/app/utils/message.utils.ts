import nodemailer from "nodemailer";
import { envConfig } from "../config/env";
import AppError from "../errorHandlers/AppError";

type SendOtpEmailPayload = {
  to: string;
  otp: string;
};

const createTransporter = () => {
  if (
    !envConfig.SMTP_HOST ||
    !envConfig.SMTP_PORT ||
    !envConfig.SMTP_USER ||
    !envConfig.SMTP_PASS ||
    !envConfig.SMTP_FROM
  ) {
    throw new AppError(500, "SMTP configuration is missing");
  }

  return nodemailer.createTransport({
    host: envConfig.SMTP_HOST,
    port: Number(envConfig.SMTP_PORT),
    secure: envConfig.SMTP_SECURE === "true",
    auth: {
      user: envConfig.SMTP_USER,
      pass: envConfig.SMTP_PASS,
    },
  });
};

export const sendOtpEmail = async ({
  to,
  otp,
}: SendOtpEmailPayload): Promise<void> => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: envConfig.SMTP_FROM,
    to,
    subject: "Vefify your OrbitOps account",
    text: `Your OrbitOps verification code is ${otp}. This code will expire in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Verify your OrbitOps account</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing: 4px;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });
};
