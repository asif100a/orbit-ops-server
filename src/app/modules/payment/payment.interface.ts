import type { Types } from "mongoose";

  export interface PaymentType {
    userId: Types.ObjectId;
    stripeCheckoutSessionId: string;
    stripePaymentIntentId: string;
    amount: number;
    currency: string;
    status: "pending" | "succeeded" | "failed";
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface PaymentResponseType {
    success: boolean;
    data?: PaymentType | PaymentType[];
    message: string
  }
  