import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body;
    const registeredUser = await authService.registerUser(payload);

    sendResponse(res, {
        success: true,
        statusCode: status.CREATED,
        message: "User registered successfully...",
        data: registeredUser
    });
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body;
    const { accessToken, refreshToken, user } = await authService.loginUser(payload);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 48,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });


    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "User logged In successfully...",
        data: { accessToken, refreshToken, user }
    });
});


export const authController = {
    registerUser,
    loginUser
};