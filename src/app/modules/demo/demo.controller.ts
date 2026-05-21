import type { Request, Response } from "express";
import { DemoService } from "./demo.service";
import { catchAsync } from "../../utils/index";
import type { DemoResponseType } from "./demo.interface";

const demoService = new DemoService();

export class DemoController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const data = await demoService.findAll();
      res.status(200).json({
        success: true,
        message: "The demo data retrieved successfully",
        data,
      });
    } catch (error: any) {
      catchAsync(res, error);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    const paramsId = req.params.id;
    if (!paramsId) {
      throw new Error("Id not found!");
    }
    try {
      const data = await demoService.findById(paramsId as string);
      if (!data) {
        res.status(404).json({
          success: false,
          message: "Demo not found",
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: "The demo data retrieved successfully",
        data,
      });
    } catch (error: any) {
      catchAsync(res, error);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = await demoService.create(req.body);
      res.status(201).json({
        success: true,
        message: "The demo data created successfully",
        data,
      });
    } catch (error: any) {
      catchAsync(res, error);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const paramsId = req.params.id;
    if (!paramsId) {
      throw new Error("Id not found!");
    }
    try {
      const data = await demoService.update(paramsId as string, req.body);
      res.status(200).json({
        success: true,
        message: "The demo data updated successfully",
        data,
      });
    } catch (error: any) {
      catchAsync(res, error);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const paramsId = req.params.id;
      if (!paramsId) {
        throw new Error("Id not found!");
      }
      await demoService.delete(paramsId as string);
      res.status(200).json({
        success: true,
        message: "The demo data deleted successfully",
      });
    } catch (error: any) {
      catchAsync(res, error);
    }
  }
}
