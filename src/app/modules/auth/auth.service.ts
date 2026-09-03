import { envConfig } from "../../config/env";
import AppError from "../../errorHandlers/AppError";
import { sendOtpEmail } from "../../utils/message.utils";
import { deleteOtp, getOtp, setOtp } from "../../utils/redis.utils";
import { handleToken, type TokenPayloadType } from "../../utils/token.utils";
import type { UserType } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Replace with Redis in production
const refreshTokenStore = new Set<string>();

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  constructor() {}

  // Register logic
  async register(input: UserType): Promise<any> {
    // Check if the user duplicate
    const existedUser = await User.findOne({ email: input.email });
    if (existedUser) {
      throw new AppError(409, "This email already exists");
    }

    // Hash the password
    const brcyptSalt = Number(envConfig.BCRYPT_SALT);
    if (!brcyptSalt) {
      throw new AppError(400, "bcrypt salt not found");
    } else if (isNaN(brcyptSalt)) {
      throw new AppError(400, "Invalid bcrypt salt");
    }

    const hashedPassword = await bcrypt.hash(input.password, brcyptSalt);

    const data = {
      ...input,
      password: hashedPassword,
      isActive: false,
      isVerified: false,
      isDeleted: false,
    };
    const result = await User.create(data);

    // Generate and send OTP
    const otp = this.generateOtp();
    await this.sendOtp(result.email, otp);

    const formattedResult = result.toObject();
    const { password, ...resultWithoutPassword } = formattedResult;

    // Generate verify token
    const tokenPayload = {
      id: result._id.toString(),
      email: result.email,
      purpose: "register-otp",
    } as const;
    const verifyToken = handleToken.generateVerifyToken(tokenPayload);

    return { user: resultWithoutPassword, verifyToken };
  }

  // Login logic
  async login(input: {
    email: string;
    password: string;
  }): Promise<AuthTokens & { user: Partial<UserType> }> {
    // 1. Find the user
    const user = await User.findOne({ email: input.email }).select("+password");
    if (!user || !user.password) {
      throw new AppError(401, "Invalid email or password");
    }

    // 2. Compare the password
    const isMatch = await bcrypt.compare(input.password, user?.password);
    if (!isMatch) throw new AppError(401, "Invalid email or password");

    // 3. If verify the user is verified
    if (!user.isVerified) throw new AppError(401, "The user is not verified");

    // 4. If the user is not active
    if (!user.isActive) throw new AppError(401, "The user is not active");

    // 5. If the user doesn't exist
    if (user.isDeleted) throw new AppError(401, "The user is not exists");

    // 4. Generate tokens
    const payload: TokenPayloadType = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = handleToken.generateAccessToken(payload);
    const refreshToken = handleToken.generateRefreshToken(payload);

    refreshTokenStore.add(refreshToken);

    const { password, ...withOutPassword } = user.toObject();

    return { accessToken, refreshToken, user: withOutPassword };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    if (!refreshToken || !refreshTokenStore.has(refreshToken)) {
      throw new AppError(403, "Refresh token invalid or not found");
    }

    const decoded = handleToken.verifyRefreshToken(refreshToken);
    if (typeof decoded === "string") {
      throw new AppError(403, "Invalid token format");
    }
    const payload: TokenPayloadType = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    const newAccessToken = handleToken.generateAccessToken(payload);
    const newRefreshToken = handleToken.generateRefreshToken(payload);

    // Rotate refresh token
    refreshTokenStore.delete(refreshToken);
    refreshTokenStore.add(newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string): Promise<void> {
    refreshTokenStore.delete(refreshToken);
  }

  async verifyOtp(
    email: string,
    otp: string,
    otpType: string = "register",
  ): Promise<any> {
    const storedOtp = await getOtp(`${otpType}:${email}`);

    if (!storedOtp || storedOtp !== otp) {
      throw new AppError(400, "Invalid or expired OTP");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(404, "User not found!");
    }

    if (otpType === "forgot-password") {
      const tokenId = crypto.randomUUID();

      await setOtp(`reset-password-token:${tokenId}`, user.email, 600);

      const resetPasswordToken = handleToken.generateVerifyToken({
        id: user._id.toString(),
        email: user.email,
        purpose: "reset-password",
        tokenId,
      });

      await deleteOtp(`${otpType}:${email}`);

      return { resetPasswordToken };
    }

    // Mark user as verified
    const updateUser = await User.findOneAndUpdate(
      { email },
      { isVerified: true, isActive: true },
      { new: true },
    );

    if (!updateUser) {
      throw new AppError(404, "User not found!");
    }

    // Delete OTP from Redis after successful verification
    await deleteOtp(`${otpType}:${email}`);

    const payload = {
      id: updateUser._id.toString(),
      email: updateUser.email,
      role: updateUser.role,
    };

    const accessToken = handleToken.generateAccessToken(payload);
    const refreshToken = handleToken.generateRefreshToken(payload);

    refreshTokenStore.add(refreshToken);

    const formattedUser = updateUser.toObject();
    const { password, ...userWithoutPass } = formattedUser;

    return {
      user: userWithoutPass,
      accessToken,
      refreshToken,
    };
  }

  async resendOtp(
    email: string,
    otpType: "register" | "forgot-password" = "register",
  ): Promise<{ verifyToken: string }> {
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (otpType === "register" && user.isVerified) {
      throw new AppError(400, "User is already verified");
    }

    await this.sendOtp(email, undefined, otpType);

    const verifyToken = handleToken.generateVerifyToken({
      id: user._id.toString(),
      email: user.email,
      purpose: otpType === "register" ? "register-otp" : "forgot-password-otp",
    });

    return { verifyToken };
  }

  async forgotPassword(email: string): Promise<{ verifyToken: string }> {
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    await this.sendOtp(email, undefined, "forgot-password");

    const verifyToken = handleToken.generateVerifyToken({
      id: user._id.toString(),
      email: user.email,
      purpose: "forgot-password-otp",
    });

    return { verifyToken };
  }

  async resetPassword(
    resetPasswordToken: string,
    newPassword: string,
  ): Promise<void> {
    const decoded = handleToken.verifyToken(resetPasswordToken);

    if (
      typeof decoded === "string" ||
      decoded.purpose !== "reset-password" ||
      !decoded.tokenId
    ) {
      throw new AppError(401, "Invalid reset password token");
    }

    const storedEmail = await getOtp(`reset-password-token:${decoded.tokenId}`);

    if (!storedEmail || storedEmail !== decoded.email) {
      throw new AppError(401, "Reset password token expired or already used");
    }

    const bcryptSalt = Number(envConfig.BCRYPT_SALT);

    if (!bcryptSalt || isNaN(bcryptSalt)) {
      throw new AppError(500, "Invalid bcrypt salt");
    }

    const hashedPassword = await bcrypt.hash(newPassword, bcryptSalt);

    const user = await User.findOneAndUpdate(
      { email: decoded.email },
      { password: hashedPassword },
      { new: true },
    );

    if (!user) {
      throw new AppError(404, "User not found");
    }

    await deleteOtp(`reset-password-token:${decoded.tokenId}`);
  }

  async checkAuthentication(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(401, "User not found");
    }

    // 3. If verify the user is verified
    if (!user.isVerified) throw new AppError(401, "The user is not verified");

    // 4. If the user is not active
    if (!user.isActive) throw new AppError(401, "The user is not active");

    // 5. If the user doesn't exist
    if (user.isDeleted) throw new AppError(401, "The user is not exists");

    return true;
  }

  // ----------------Utils Functions----------------
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit otp
  }

  async sendOtp(
    email: string,
    otp?: string,
    otpType: string = "register",
  ): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(404, "User not found!");
    }

    const otpCode = otp || this.generateOtp();

    // Store OTP in Redis with 3 minutes expiry
    await setOtp(`${otpType}:${email}`, otpCode, 180);

    // Send via email or SMS
    try {
      await sendOtpEmail({
        to: email,
        otp: otpCode,
      });
      console.log(`OTP sent to ${email}: ${otpCode}`);
    } catch (error) {
      await deleteOtp(`${otpType}:${email}`);
      throw new AppError(502, "Failed to send OTP");
    }
  }
}

export const authService = new AuthService();
