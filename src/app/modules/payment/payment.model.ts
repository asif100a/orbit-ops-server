
  import mongoose, {Schema, Document} from 'mongoose';
  import type { PaymentType } from './payment.interface';

  export interface PaymentDocumentType extends PaymentType, Document {}

  const PaymentSchema: Schema = new Schema<PaymentDocumentType>(
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      stripeCheckoutSessionId: { type: String, required: true },
      stripePaymentIntentId: { type: String, required: false },
      amount: { type: Number, required: true },
      currency: { type: String, required: true },
      status: {
        type: String,
        enum: ['pending', 'succeeded', 'failed'],
        default: 'pending',
      },
      metadata: { type: Schema.Types.Mixed },
    },
    {
      timestamps: true,
      versionKey: false
      }
    )
        
    export const PaymentModel = mongoose.model<PaymentDocumentType>('Payment', PaymentSchema);
    