import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { categoriesService } from "./category.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const createCategory = asyncHandler(async (req: Request, res: Response) => {
    const result = await categoriesService.createCategory(req.body);

    sendResponse(res, {
        success: true,
        statusCode: status.CREATED,
        message: "Category created successfully....",
        data: result
    })
})

export const categorieController = {
    createCategory
}