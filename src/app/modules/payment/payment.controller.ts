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
  async createCheckoutSession (req: Request, res: Response) {
    try {
        const {data} = req.body;

        if(!data) {
            throw new AppError(400, 'Payment data not found')
        }

        const userId = req.user.id;
        const result = await paymentService.createCheckoutSessionService(userId, data);

        res.status(200).json({
            success: true,
            message: "Checkout created successfully",
            data: result
        })
    } catch (error) {
        catchAsync(res, error)
    }
  }

  async getCheckoutSessionStatus(req: Request, res: Response) {
    try {
        const {session_id} = req.query;
        const result = await paymentService.getCheckoutSessionStatusService(session_id as string);

        res.status(200).json({
            success: true,
            message: "Checkout session status fetched successfully"
        })
    } catch (error) {
        catchAsync(res, error);
    }
  }
}
