import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { rentalRequestsService } from "./rental.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const createRentalRequest = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user!.id;
    const payload = req.body;
    const result = await rentalRequestsService.createRentalRequest(tenantId, payload);

    sendResponse(res, {
        success: true,
        statusCode: status.CREATED,
        message: "Rental request created successfully.",
        data: result,
    });
});

const getMyRentalRequests = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user!.id;

    const result = await rentalRequestsService.getMyRentalRequests(tenantId);

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Rental requests retrieved successfully.",
        data: result,
    });
});

const getLandlordRentalRequests = asyncHandler(async (req: Request, res: Response) => {
    const landlordId = req.user!.id;
    const result = await rentalRequestsService.getLandlordRentalRequests(landlordId);

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Rental requests retrieved successfully.",
        data: result,
    });
});

const updateRentalRequestStatus = asyncHandler(async (req: Request, res: Response) => {
    const rentalId = req.params.id;
    const landlordId = req.user!.id;
    const { rentalStatus } = req.body;

    const result = await rentalRequestsService.updateRentalRequestStatus(rentalId as string, landlordId, rentalStatus);

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Rental request status updated successfully.",
        data: result,
    });
}
);

const cancelRentalRequest = asyncHandler(async (req: Request, res: Response) => {
    const rentalId = req.params.id as string;
    const tenantId = req.user!.id;
    const result = await rentalRequestsService.cancelRentalRequest(rentalId, tenantId);

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Rental request cancelled successfully.",
        data: result,
    });
});


export const rentalRequestsController = {
    createRentalRequest,
    getMyRentalRequests,
    getLandlordRentalRequests,
    updateRentalRequestStatus,
    cancelRentalRequest
}