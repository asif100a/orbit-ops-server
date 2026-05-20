import { Types } from "mongoose";

export interface User {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyId: Types.ObjectId;
  departmentId: Types.ObjectId;
  teamId: Types.ObjectId;
  isActive: boolean;
  isVerified: boolean;
  isDeleted: boolean;
}
