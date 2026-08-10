
    import type {Request, Response} from 'express'
    import {CompanyService} from './company.service';
    import { catchAsync } from '../../utils/index'
    import type { CompanyResponseType } from './company.interface'
    
    const companyService = new CompanyService();
    
    export class CompanyController {
        async getAll(req: Request, res: Response): Promise<void> {
            try{
                const data = await companyService.findAll();
                res.status(200).json({
                success: true,
                message: "The company data retrieved successfully",
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
                const data = await companyService.findById(paramsId as string);
                if(!data) {
                    res.status(404).json({
                        success: false,
                        message: "Company not found"
                        })
                    return;
                }
                res.status(200).json({
                success: true,
                message: "The company data retrieved successfully",
                data
            })
            } catch(error: any) {
               catchAsync(res, error)
            }
        }

        async create(req: Request, res: Response): Promise<void> {
            try{
                const data = await companyService.create(req.body);
                res.status(201).json({
                    success: true,
                    message: "The company data created successfully",
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
                const data = await companyService.update(paramsId as string, req.body);
                res.status(200).json({
                    success: true,
                    message: "The company data updated successfully",
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
                await companyService.delete(paramsId as string)
                res.status(200).json({
                    success: true,
                    message: "The company data deleted successfully",
                })
            } catch (error: any) {
                catchAsync(res, error)
            }
        }
    
    }