import { type PaymentType, type SubscriptionPlanType } from "./payment.interface";
import stripe from "../../config/stripe";
import { envConfig } from "../../config/env";
import { PaymentModel } from "./payment.model";
import type Stripe from "stripe";

interface CheckoutItem {
  name: string;
  subscriptionType: SubscriptionPlanType;
  amount: number;
}

export class PaymentService {
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
      mode: "payment",
      success_url: `${envConfig.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${envConfig.CLIENT_URL}/checkout/cancel`,
      metadata: { userId },
    });

    await PaymentModel.create({
      userId,
      stripeCheckoutSessionId: session.id,
      amount: data.amount,
      currency: "usd",
      status: "pending",
    });

    return { url: session.url };
  }

  async getCheckoutSessionStatusService(sessionId: string): Promise<{
    status: string | null;
    payment_status: string;
  }> {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return {
      status: session.status,
      payment_status: session.payment_status,
    };
  }

  async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    await PaymentModel.findOneAndUpdate(
      {
        stripeCheckoutSessionId: session.id,
      },
      {
        status: "succeeded",
        stripePaymentIntentId: session.payment_intent as string,
      },
    );
  }

  async handleCheckoutSessionExpired(session: Stripe.Checkout.Session) {
    await PaymentModel.findOneAndUpdate(
      {
        stripeCheckoutSessionId: session.id,
      },
      { status: "failed" },
    );
  }

  async handlePaymentIntentFailed(intent: Stripe.PaymentIntent) {
    await PaymentModel.findOneAndUpdate(
      {
        stripePaymentIntentId: intent.id,
      },
      { status: "failed" },
    );
  }
}
