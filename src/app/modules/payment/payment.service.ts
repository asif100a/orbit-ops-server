import {
  type PaymentType,
  type SubscriptionPlanType,
} from "./payment.interface";
import stripe from "../../config/stripe";
import { envConfig } from "../../config/env";
import { PaymentModel } from "./payment.model";
import type Stripe from "stripe";
import AppError from "../../errorHandlers/AppError";

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
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: data.name,
            },
            unit_amount: data.amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${envConfig.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${envConfig.CLIENT_URL}/checkout/cancel`,
      metadata: {
        userId,
        subscriptionType: data.subscriptionType,
      },
    });

    await PaymentModel.create({
      userId,
      stripeCheckoutSessionId: session.id,
      amount: data.amount,
      currency: "usd",
      status: "pending",
      metadata: {
        subscriptionType: data.subscriptionType,
      },
    });

    return { url: session.url };
  }

  async getCheckoutSessionStatusService(
    userId: string,
    sessionId: string,
  ): Promise<{
    status: string | null;
    payment_status: string;
    payment: object;
  }> {
    const payment = await PaymentModel.findOne({
      userId,
      stripeCheckoutSessionId: sessionId,
    });

    if (!payment) {
      throw new AppError(400, "Payment session not found");
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return {
      status: session.status,
      payment_status: session.payment_status,
      payment: payment.toObject(),
    };
  }

  async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    if (session.payment_status !== "paid") return;

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    await PaymentModel.findOneAndUpdate(
      {
        stripeCheckoutSessionId: session.id,
      },
      {
        status: "succeeded",
        ...(paymentIntentId && {
          stripePaymentIntentId: session.payment_intent as string
        }),
      },
      {
        new: true
      }
    );
  }

  async handleCheckoutSessionExpired(session: Stripe.Checkout.Session) {
    await PaymentModel.findOneAndUpdate(
      {
        stripeCheckoutSessionId: session.id,
        status: 'pending'
      },
      { status: "failed" },
    );
  }

  async handlePaymentIntentSucceeded(intent: Stripe.PaymentIntent): Promise<void> {
    await PaymentModel.findOneAndUpdate(
      {
        stripePaymentIntentId: intent.id,
      },
      {
        status: 'succeeded',
      }
    )
  }

  async handlePaymentIntentFailed(intent: Stripe.PaymentIntent): Promise<void> {
    await PaymentModel.findOneAndUpdate(
      {
        stripePaymentIntentId: intent.id,
      },
      { status: "failed" },
    );
  }
}
