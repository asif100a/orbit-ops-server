import type { Request, Response } from "express";
import type Stripe from "stripe";
import stripe from "../../config/stripe";
import { envConfig } from "../../config/env";
import { catchAsync } from "../../utils";
import { PaymentService } from "../payment/payment.service";

const paymentService = new PaymentService()

export class StripeWebhookController {
    async handleStripeWebhook (req: Request, res: Response) {
        const signature = req.headers['stripe-signature'] as string;

        if(!signature || Array.isArray(signature)) {
            res.status(400).json({
                success: false,
                message: "Missing Stripe signature",
            })
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(req.body, signature, envConfig.STRIPE_WEBHOOK_SECRET);
        } catch (error) {
             console.error('Webhook signature verification failed:', error);
            return res.status(400).json({
                success: false,
                message: "Invalid Stripe webhook signature"
            })
        }

        switch(event.type) {
            case 'checkout.session.completed':
            case "checkout.session.async_payment_succeeded":
                await paymentService.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
                break;

            case 'checkout.session.expired':
            case "checkout.session.async_payment_failed":
                await paymentService.handleCheckoutSessionExpired(event.data.object as Stripe.Checkout.Session);
                break;

            case "payment_intent.succeeded":
                await paymentService.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
                break;

            case 'payment_intent.payment_failed':
                await paymentService.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
                break;
                
            default:
                console.log(`Unhandled event type: ${event.type}`);
                break;
        }

        res.status(200).json({
            success: true,
            data: {received: true}
        })
    }
}