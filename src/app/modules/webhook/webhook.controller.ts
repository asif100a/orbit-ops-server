import type { Request, Response } from "express";
import type Stripe from "stripe";
import stripe from "../../config/stripe";
import { envConfig } from "../../config/env";
import { catchAsync } from "../../utils";
import { PaymentService } from "../payment/payment.service";

const paymentService = new PaymentService()

export class StripeWebhookController {
    async handleStripeWebhook (req: Request, res: Response) {
        const sig = req.headers['stripe-signature'] as string;
        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, envConfig.STRIPE_WEBHOOK_SECRET);
        } catch (error) {
             console.error('Webhook signature verification failed:', error);
            catchAsync(res, error);
        }

        switch(event.type) {
            case 'checkout.session.completed':
                await paymentService.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
                break;
            case 'checkout.session.expired':
                await paymentService.handleCheckoutSessionExpired(event.data.object as Stripe.Checkout.Session);
                break;
            case 'payment_intent.payment_failed':
                await paymentService.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.status(200).json({
            success: true,
            message: '',
            data: {received: true}
        })
    }
}