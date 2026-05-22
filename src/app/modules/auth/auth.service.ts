import { envConfig } from "../../config/env";
import AppError from "../../errorHandlers/AppError";
import type { UserType } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";

export class AuthService {
  constructor() {}

  async register(input: UserType): Promise<any> {
    console.log("Input data: ", input);

    // Hash the password
    const brcyptSalt = Number(envConfig.BCRYPT_SALT)
    if(!brcyptSalt) {
      throw new AppError(400, 'bcrypt salt not found')
    }else if(isNaN(brcyptSalt)) {
      throw new AppError(400, 'Invalid bcrypt salt')
    }

    try {
      const hashedPassword = await bcrypt.hash(input.password, brcyptSalt)
      if(!hashedPassword) {
        throw new AppError(400, 'Hash password not found')
      }

      const data = {...input, password: hashedPassword, isActive: false, isVerified: false, isDeleted: false};
      const result = await User.create(data)
      const formattedResult = result.toObject()
      delete formattedResult?.password
      
      return formattedResult;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError(409, "User with this email already exists");
      }
      throw new AppError(400, error.message || "Failed to create user");
    }
  }

  async login(input: any): Promise<any> {}
}

export const authService = new AuthService();
