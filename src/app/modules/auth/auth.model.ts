import { model, Schema } from "mongoose";
import type { Auth } from "./auth.interface";

const authSchema = new Schema<Auth>({
  name: {
    type: String,
    trim: true,
    required: [true, '"Name" is required'],
  },
  email: {
    type: String,
    trim: true,
    required: [true, '"Email" is required'],
  },
  password: {
    type: String,
    trim: true,
    required: [true, '"Password" is required'],
  },
  companyId: {
    type: Schema.Types.ObjectId,
    required: [true, '"Company Id" is required'],
  },
  departmentId: {
    type: Schema.Types.ObjectId,
    required: [true, '"Department Id" is required'],
  },
  teamId: {
    type: Schema.Types.ObjectId,
    required: [true, '"Team Id" is required'],
  },
});

export const User = model("User", authSchema);
