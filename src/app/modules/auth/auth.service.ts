import { envConfig } from "../../config/env";
import AppError from "../../errorHandlers/AppError";
import { sendOtpEmail } from "../../utils/message.utils";
import { deleteOtp, getOtp, setOtp } from "../../utils/redis.utils";
import { handleToken, type TokenPayloadType } from "../../utils/token.utils";
import type { UserType } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";

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
      purpose: "verify-otp",
    } as const;
    const verifyToken = handleToken.generateVerifyToken(tokenPayload);

    return { user: resultWithoutPassword, verifyToken };
  }

  // Login logic
  async login(input: {
    email: string;
    password: string;
  }): Promise<AuthTokens & { user: UserType }> {
    // 1. Find the user
    const user = await User.findOne({ email: input.email }).select("+password");
    if (!user || !user.password) {
      throw new AppError(401, "Invalid email or password");
    }

    // 2. Compare the password
    const isMatch = await bcrypt.compare(input.password, user?.password);
    if (!isMatch) {
      throw new AppError(401, "Invalid email or password");
    }

    // 3. Generate tokens
    const payload: TokenPayloadType = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = handleToken.generateAccessToken(payload);
    const refreshToken = handleToken.generateRefreshToken(payload);

    refreshTokenStore.add(refreshToken);

    return { accessToken, refreshToken, user };
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

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit otp
  }

  async sendOtp(email: string, otp?: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(404, "User not found!");
    }

    const otpCode = otp || this.generateOtp();

    // Store OTP in Redis with 10 minutes expiry
    await setOtp(email, otpCode, 600);

    // Send via email or SMS
    try {
      await sendOtpEmail({
        to: email,
        otp: otpCode,
      });
      console.log(`OTP sent to ${email}: ${otpCode}`);
    } catch (error) {
      await deleteOtp(email);
      throw new AppError(502, "Failed to send OTP");
    }
  }

  async verifyOtp(
    email: string,
    otp: string,
  ): Promise<{
    user: Partial<UserType>;
    accessToken: string;
    refreshToken: string;
  }> {
    const storedOtp = await getOtp(email);

    if (!storedOtp || storedOtp !== otp) {
      throw new AppError(400, "Invalid or expired OTP");
    }

    // Mark user as verified
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true, isActive: true },
      { new: true },
    );

    if (!user) {
      throw new AppError(404, "User not found!");
    }

    // Delete OTP from Redis after successful verification
    await deleteOtp(email);

    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = handleToken.generateAccessToken(payload);
    const refreshToken = handleToken.generateRefreshToken(payload);

    refreshTokenStore.add(refreshToken);

    const formattedUser = user.toObject();
    const { password, ...userWithoutPass } = formattedUser;

    return {
      user: userWithoutPass,
      accessToken,
      refreshToken,
    };
  }
}

export const authService = new AuthService();
