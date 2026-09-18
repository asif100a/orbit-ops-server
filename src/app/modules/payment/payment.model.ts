import mongoose, { Schema, Document } from "mongoose";
import type { PaymentType } from "./payment.interface";

export interface PaymentDocumentType extends PaymentType, Document {}

const PaymentSchema: Schema = new Schema<PaymentDocumentType>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    stripeCheckoutSessionId: { type: String, required: true },
    stripeCustomerId: String,
    stripeSubscriptionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    stripePaymentIntentId: { type: String, required: false },
    plan: {
      type: String,
      enum: ["STARTER", "GROWTH", "SCALE"],
      required: true
    },
    status: {
      type: String,
      enum: [
        "pending",
        "active",
        "trialing",
        "paused",
        "past_due",
        "canceled",
        "unpaid",
        "incomplete",
        "incomplete_expired",
        "failed",
      ],
      default: "pending",
    },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const PaymentModel = mongoose.model<PaymentDocumentType>(
  "Payment",
  PaymentSchema,
);
