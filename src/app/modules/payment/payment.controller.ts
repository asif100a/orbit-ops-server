import type { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { catchAsync } from "../../utils/index";
import type {
  PaymentResponseType,
  SubscriptionPlanType,
} from "./payment.interface";
import AppError from "../../errorHandlers/AppError";

const paymentService = new PaymentService();

export class PaymentController {
  async createCheckoutSession(req: Request, res: Response) {
    try {
      if (!req.user) {
        throw new AppError(401, "Unauthorized access");
      }

      const result = await paymentService.createCheckoutSessionService(
        req.user.id,
        req.body,
      );

      res.status(200).json({
        success: true,
        message: "Checkout created successfully",
        data: result,
      });
    } catch (error) {
      catchAsync(res, error);
    }
  }

  async getCheckoutSessionStatus(req: Request, res: Response) {
    try {
        if(!req.user) {
            throw new AppError(401, "Unauthorized access")
        }
        
      const sessionId = String(req.query.session_id ?? "");

      if(!sessionId) {
        throw new AppError(400, "session_id is required");
      }
      const result = await paymentService.getCheckoutSessionStatusService(
        req.user.id,
        sessionId
      );

      res.status(200).json({
        success: true,
        message: "Checkout session status fetched successfully",
        data: result
      });
    } catch (error) {
      catchAsync(res, error);
    }
  }
}
