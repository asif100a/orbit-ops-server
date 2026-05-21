import { envConfig } from "../../config/env";
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
      throw new Error('bcrypt salt not found')
    }else if(isNaN(brcyptSalt)) {
      throw new Error('Invalid bcrypt salt')
    }

    const hashedPassword = await bcrypt.hash(input.password, brcyptSalt)

    const data = {...input, password: hashedPassword, isActive: false, isVerified: false, isDeleted: false};
    const result = await User.create(data)
    
    return result;
  }

  async login(input: any): Promise<any> {}
}

export const authService = new AuthService();
