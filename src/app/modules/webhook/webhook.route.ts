import { raw, Router } from "express";
import { StripeWebhookController } from "./webhook.controller";

const webhookRouter = Router();

const stripeWebhookController = new StripeWebhookController();

webhookRouter.post(
  "/stripe",
  raw({ type: "application/json" }),
  stripeWebhookController.handleStripeWebhook.bind(stripeWebhookController),
);

export default webhookRouter;
