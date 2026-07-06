import { NextFunction, Request, RequestHandler, Response } from "express";
import status from "http-status";

export const asyncHandler = (fnu: RequestHandler): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fnu(req, res, next);
        } catch (error) {
            console.log(error);
            res.status(status.INTERNAL_SERVER_ERROR).json({
                success: false,
                statusCode: status.INTERNAL_SERVER_ERROR,
                message: "Failed to register user",
                error: (error as Error).message
            })
        }
    };
};