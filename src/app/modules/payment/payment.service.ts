import { type SubscriptionPlanType } from "./payment.interface";
import stripe from "../../config/stripe";
import { envConfig } from "../../config/env";
import { PaymentModel } from "./payment.model";
import type Stripe from "stripe";
import AppError from "../../errorHandlers/AppError";

interface CheckoutItem {
  subscriptionType: SubscriptionPlanType;
}

const priceIds: Record<SubscriptionPlanType, string> = {
  STARTER: envConfig.STRIPE_STARTER_PRICE_ID,
  GROWTH: envConfig.STRIPE_GROWTH_PRICE_ID,
  SCALE: envConfig.STRIPE_SCALE_PRICE_ID,
};

export class PaymentService {
  async createCheckoutSessionService(
    userId: string,
    data: CheckoutItem,
  ): Promise<{ url: string | null }> {
    const priceId = priceIds[data.subscriptionType];

    if (!priceId) {
      throw new AppError(400, "Invalid subscription plan");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      client_reference_id: userId,
      success_url: `${envConfig.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${envConfig.CLIENT_URL}/checkout/cancel`,

      metadata: {
        userId,
        subscriptionType: data.subscriptionType,
      },

      subscription_data: {
        metadata: {
          userId,
          plan: data.subscriptionType,
        },
      },
      managed_payments: {
        enabled: false
      }
    });

    await PaymentModel.create({
      userId,
      stripeCheckoutSessionId: session.id,
      plan: data.subscriptionType,
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
    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    if (!subscriptionId) return;

    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    await PaymentModel.findOneAndUpdate(
      {
        stripeCheckoutSessionId: session.id,
      },
      {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        ...(paymentIntentId && { stripePaymentIntentId: paymentIntentId }),
        status: subscription.status,
      },
      {
        new: true,
      },
    );
  }

  async handleSubscriptionUpdated(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    await PaymentModel.findOneAndUpdate(
      {
        stripeSubscriptionId: subscription.id,
      },
      {
        status: subscription.status,
      },
      {
        new: true
      }
    )
  }

  async handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
    const subscriptionId = this.getInvoiceSubscriptionId(invoice);

    if(!subscriptionId) return;

    await PaymentModel.findOneAndUpdate(
      {
        stripeSubscriptionId: subscriptionId,
      },
      {
        status: 'active'
      }
    )
  }

  async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    const subscriptionId = this.getInvoiceSubscriptionId(invoice);

    if(!subscriptionId) return;

    await PaymentModel.findOneAndUpdate(
      { stripeSubscriptionId: subscriptionId },
      {
        status: "past_due",
      },
    );
  }

  private getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | undefined {
    const subscription = invoice.parent?.subscription_details?.subscription;

    return typeof subscription === "string" ? subscription : subscription?.id;
  }

  async handleCheckoutSessionExpired(session: Stripe.Checkout.Session) {
    await PaymentModel.findOneAndUpdate(
      {
        stripeCheckoutSessionId: session.id,
        status: "pending",
      },
      { status: "failed" },
    );
  }

  async handlePaymentIntentSucceeded(
    intent: Stripe.PaymentIntent,
  ): Promise<void> {
    await PaymentModel.findOneAndUpdate(
      {
        stripePaymentIntentId: intent.id,
      },
      { status: "active" },
    );
  }

  async handlePaymentIntentFailed(intent: Stripe.PaymentIntent): Promise<void> {
    await PaymentModel.findOneAndUpdate(
      {
        stripePaymentIntentId: intent.id,
      },
      { status: "past_due" },
    );
  }
}
