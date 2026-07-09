import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { reviewService } from "./review.service";

const createReview = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user!.id;
    const { propertyId } = req.params;
    console.log(propertyId)
    const payload = req.body;

    const result = await reviewService.createReview(tenantId, payload, propertyId as string);

    sendResponse(res, {
        success: true,
        statusCode: status.CREATED,
        message: "Review created successfully.",
        data: result,
    });
});


const getPropertyReviews = asyncHandler(async (req: Request, res: Response) => {
    const { propertyId } = req.params;

    const result = await reviewService.getPropertyReviews(propertyId as string);

    sendResponse(res, {
        success: true,
        statusCode: status.CREATED,
        message: "Review created successfully.",
        data: result,
    });
});

const updateReview = asyncHandler(async (req: Request, res: Response) => {
    const reviewId = req.params.id as string;
    const tenantId = req.user!.id;
    const payload = req.body;

    const result = await reviewService.updateReview(reviewId, tenantId, payload);

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Review updated successfully.",
        data: result,
    });
});

const deleteReview = asyncHandler(async (req: Request, res: Response) => {
    const reviewId = req.params.id as string;
    const tenantId = req.user!.id;

    const result = await reviewService.deleteReview(reviewId, tenantId);

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Review deleted successfully.",
        data: result,
    });
});

export const reviewController = {
    createReview,
    getPropertyReviews,
    updateReview,
    deleteReview

}