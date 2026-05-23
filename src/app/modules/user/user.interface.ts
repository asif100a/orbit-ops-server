import { Types } from "mongoose";
import type { UserRole } from "../../types";

export interface UserType {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole,
  companyId: Types.ObjectId;
  departmentId: Types.ObjectId;
  teamId: Types.ObjectId;
  isActive: boolean;
  isVerified: boolean;
  isDeleted: boolean;
}
