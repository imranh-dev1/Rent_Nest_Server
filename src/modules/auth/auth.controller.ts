import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { authService } from "./auth.service";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body;
    const registeredUser = await authService.registerUser(payload);

    res.status(201).json({
        success: true,
        message: "User registered successfully...",
        data: registeredUser,
    });
});


export const authController = {
    registerUser,
};