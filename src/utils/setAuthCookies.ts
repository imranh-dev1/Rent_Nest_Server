import { Response, CookieOptions } from "express";
import config from "../config";

const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: config.node_env === "production" ? "none" : "lax",
};

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 48 });

    res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 7 });
};