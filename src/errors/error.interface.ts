export interface IErrorResponse {
    statusCode: number;
    message: string;
    errorDetails?: unknown;
}