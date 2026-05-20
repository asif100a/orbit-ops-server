import { Types } from "mongoose";

export interface Auth {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyId: Types.ObjectId;
  departmentId: Types.ObjectId;
  teamId: Types.ObjectId;
}
