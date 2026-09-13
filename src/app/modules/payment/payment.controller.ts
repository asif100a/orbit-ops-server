import type { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { catchAsync } from "../../utils/index";
import type {
  PaymentResponseType,
  SubscriptionPlanType,
} from "./payment.interface";
import stripe from "../../config/stripe";
import { envConfig } from "../../config/env";
import { PaymentModel } from "./payment.model";

const paymentService = new PaymentService();

interface CheckoutItem {
  name: string;
  subscriptionType: SubscriptionPlanType;
  amount: number;
}

export class PaymentController {
  async createCheckoutSessionService(
    userId: string,
    data: CheckoutItem,
  ): Promise<{ url: string | null }> {
    const subscription_data = {
        currency: "usd",
        subscriptionType: data.subscriptionType,
        amount: data.amount,      
    };

    const session = await stripe.checkout.sessions.create({
        subscription_data,
        mode: 'payment',
        success_url: `${envConfig.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${envConfig.CLIENT_URL}/checkout/cancel`,
        metadata: {userId}
    })

    await PaymentModel.create({
        userId,
        stripeCheckoutSessionId: session.id,
        amount: data.amount,
        currency: 'usd',
        status: 'pending'
    })

    return {url: session.url};
  }

  async getCheckoutSessionStatusService(sessionId: string): Promise<{
    status: string | null,
    payment_status: string
  }> {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return {
        status: session.status,
        payment_status: session.payment_status,
    }
  }

  async handleCheckoutSessionCompleted (): Promise<void> {
    
  }
}

