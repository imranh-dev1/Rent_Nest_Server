import { NextFunction, Request, Response } from "express";

import { ZodError } from "zod";
import AppError from "./AppError";
import handleGenericError from "./handleGenericError";
import handlePrismaError from "./handlePrismaError";
import handleZodError from "./handleZodError";
import { Prisma } from "../../generated/prisma/client";
import config from "../config";

export const globalErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    let errorResponse;

    if (err instanceof AppError) {
        errorResponse = {
            statusCode: err.statusCode,
            message: err.message,
        };
    } else if (err instanceof ZodError) {
        errorResponse = handleZodError(err);
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        errorResponse = handlePrismaError(err);
    } else if (err instanceof Error) {
        errorResponse = handleGenericError(err);
    } else {
        errorResponse = {
            statusCode: 500,
            message: "Something went wrong..",
        };
    }

    res.status(errorResponse.statusCode).json({
        success: false,
        statusCode: errorResponse.statusCode,
        message: errorResponse.message,
        errorDetails: errorResponse.errorDetails ?? null,
        ...(config.node_env === "development" &&
            err instanceof Error && {
            stack: err.stack,
        }),
    });
};