import { Types } from "mongoose";
import type { UserRole } from "../../types";

export interface UserType {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole,
  companyId?: Types.ObjectId | null;
  departmentId?: Types.ObjectId | null;
  teamId?: Types.ObjectId | null;
  isActive: boolean;
  isVerified: boolean;
  isDeleted: boolean;
}
