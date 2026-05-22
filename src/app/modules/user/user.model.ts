import { model, Schema } from "mongoose";
import type { UserType } from "./user.interface";

const userSchema = new Schema<UserType>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, '"Name" is required'],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, '"Email" is required'],
    },
    password: {
      type: String,
      trim: true,
      required: [true, '"Password" is required'],
    },
    isActive: {
      type: Boolean,
      required: [true, '"isActive" is required'],
    },
    isVerified: {
      type: Boolean,
      required: [true, '"isVerified" is required'],
    },
    isDeleted: {
      type: Boolean,
      required: [true, '"isDeleted" is required'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = model("User", userSchema);
