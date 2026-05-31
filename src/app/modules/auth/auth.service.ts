import { envConfig } from "../../config/env";
import AppError from "../../errorHandlers/AppError";
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

    const formattedResult = result.toObject();
    const { password, ...resultWithoutPassword } = formattedResult;

    return resultWithoutPassword;
  }

  async login(input: { email: string; password: string }): Promise<AuthTokens & {user: UserType}> {
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

  async verifyOtp(email: string): Promise<void> {
    
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    if (!refreshToken || !refreshTokenStore.has(refreshToken)) {
      throw new AppError(403, "Refresh token invalid or not found");
    }

    const decoded = handleToken.verifyRefreshToken(refreshToken);
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
}

export const authService = new AuthService();
