import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { setAuthCookies } from "../../utils/setAuthCookies";

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

    setAuthCookies(res, accessToken, refreshToken);

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "User logged In successfully...",
        data: { accessToken, refreshToken, user }
    });
});

const getMe = asyncHandler(async (req: Request, res: Response) => {
    // const { id, name, email, role } = req.user;
    // console.log(req.user)
    const result = await authService.getMe(req.user!.id);

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "User profile retrieved successfully....",
        data: result
    });
});

export const authController = {
    registerUser,
    loginUser,
    getMe
};