import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";
import { IErrorResponse } from "./error.interface";


const handlePrismaError = (
    error: Prisma.PrismaClientKnownRequestError
): IErrorResponse => {
    switch (error.code) {
        case "P2002":
            return {
                statusCode: httpStatus.CONFLICT,
                message: "Duplicate value found.",
            };

        case "P2003":
            return {
                statusCode: httpStatus.BAD_REQUEST,
                message: "Foreign key constraint failed.",
            };

        case "P2025":
            return {
                statusCode: httpStatus.NOT_FOUND,
                message: "Requested resource not found.",
            };

        default:
            return {
                statusCode: httpStatus.BAD_REQUEST,
                message: error.message,
            };
    }
};

export default handlePrismaError;