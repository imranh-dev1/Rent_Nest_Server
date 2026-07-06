import status from "http-status";
import { IErrorResponse } from "./error.interface";


const handleGenericError = (error: Error): IErrorResponse => {
    return {
        statusCode: status.INTERNAL_SERVER_ERROR,
        message: error.message || "Something went wrong.",
    };
};

export default handleGenericError;