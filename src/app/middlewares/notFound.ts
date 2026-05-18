import type { Request, Response } from "express";

const notFound = (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Requested route not found'
    })
}

export default notFound;