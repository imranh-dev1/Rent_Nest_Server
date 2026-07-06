import httpStatus from "http-status";
import { ZodError } from "zod";
import { IErrorResponse } from "./error.interface";


const handleZodError = (error: ZodError): IErrorResponse => {
    return {
        statusCode: httpStatus.BAD_REQUEST,
        message: "Validation failed.",
        errorDetails: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
        })),
    };
};

export default handleZodError;