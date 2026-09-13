
    import type {Request, Response} from 'express'
    import {PaymentService} from './payment.service';
    import { catchAsync } from '../../utils/index'
    import type { PaymentResponseType } from './payment.interface'
    
    const paymentService = new PaymentService();
    
    export class PaymentController {
        async getAll(req: Request, res: Response): Promise<void> {
            try{
                const data = await paymentService.findAll();
                res.status(200).json({
                success: true,
                message: "The payment data retrieved successfully",
                data
            })
            } catch(error: any) {
                catchAsync(res, error)
            }
        }

        async getById(req: Request, res: Response): Promise<void> {
            const paramsId = req.params.id
            if(!paramsId) {
              throw new Error('Id not found!')
            }
            try{
                const data = await paymentService.findById(paramsId as string);
                if(!data) {
                    res.status(404).json({
                        success: false,
                        message: "Payment not found"
                        })
                    return;
                }
                res.status(200).json({
                success: true,
                message: "The payment data retrieved successfully",
                data
            })
            } catch(error: any) {
               catchAsync(res, error)
            }
        }

        async create(req: Request, res: Response): Promise<void> {
            try{
                const data = await paymentService.create(req.body);
                res.status(201).json({
                    success: true,
                    message: "The payment data created successfully",
                    data
                })
            }catch(error: any) {
                catchAsync(res, error)
            }
        }

        async update(req: Request, res: Response): Promise<void> {
            const paramsId = req.params.id
            if(!paramsId) {
              throw new Error('Id not found!')
            }
            try {
                const data = await paymentService.update(paramsId as string, req.body);
                res.status(200).json({
                    success: true,
                    message: "The payment data updated successfully",
                    data
                })
            } catch (error: any) {
                catchAsync(res, error)
            }
        }

        async delete(req: Request, res: Response): Promise<void> {
            try {
                const paramsId = req.params.id
                if (!paramsId) {
                  throw new Error("Id not found!");
                }
                await paymentService.delete(paramsId as string)
                res.status(200).json({
                    success: true,
                    message: "The payment data deleted successfully",
                })
            } catch (error: any) {
                catchAsync(res, error)
            }
        }
    
    }