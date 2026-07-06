import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { jwtUtils } from "../utils/jwtService";
import config from "../config";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                role: Role;
            };
        }
    }
};

export const auth = (...roles: Role[]) => {
    return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization?.split(" ")[1] : req.headers.authorization;

        if (!token) {
            throw new Error("You are not logged in. Please log in to continue...");
        };

        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

        console.log(verifiedToken)

        if (!verifiedToken.success) {
            throw new Error(verifiedToken.error);
        };

        const { id, name, email, role } = verifiedToken.data as JwtPayload;

        if (roles.length && !roles.includes(role)) {
            throw new Error("You are not authorized to access this resource.!");
        };

        const user = await prisma.user.findUnique({
            where: {
                id,
                email,
                name,
                role
            }
        });

        if (!user) {
            throw new Error("User not found. Please log in again.!");
        }

        if (user.status === UserStatus.BLOCKED) {
            throw new Error("Your account has been blocked. Please contact support.");
        }

        req.user = {
            id,
            name,
            email,
            role
        }

        next();

    });
};