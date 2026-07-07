import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { propertyService } from "./property.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const createProperty = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body;
    const landlordId = req.user?.id;
    const result = await propertyService.createProperty(payload, landlordId as string);

    sendResponse(res, {
        success: true,
        statusCode: status.CREATED,
        message: "Property create successfully....",
        data: result
    })
});

const getAllProperties = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await propertyService.getAllProperties(query);

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Properties retrieved successfully....",
        data: result.data,
        meta: result.meta
    });
});

const getPropertyById = asyncHandler(async (req: Request, res: Response) => {
    const propertyId = req.params.id;
    const result = await propertyService.getPropertyById(propertyId as string);

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Property retrieved successfully....",
        data: result
    });
});

const updateProperty = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body;
    const landlordId = req.user?.id;
    const propertyId = req.params.id;
    const result = await propertyService.updateProperty(payload, propertyId as string, landlordId as string);

    sendResponse(res, {
        success: true,
        statusCode: status.CREATED,
        message: "Property updated successfully....",
        data: result
    });
});

const deleteProperty = asyncHandler(async (req: Request, res: Response) => {
    const landlordId = req.user?.id;
    const propertyId = req.params.id;
    const result = await propertyService.deleteProperty(propertyId as string, landlordId as string);

    sendResponse(res, {
        success: true,
        statusCode: status.CREATED,
        message: "Property deletd successfully....",
        data: result
    });
})

export const propertyController = {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
};