import { Types } from "mongoose";

export interface UserType {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isActive: boolean;
  isVerified: boolean;
  isDeleted: boolean;
  status?: 'pending' | 'approved' | 'rejected' | 'suspended';
}
