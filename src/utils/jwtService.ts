import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const createToken = (payload: JwtPayload, secret: Secret, expiresIn: SignOptions): string => {
    return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
    try {
        const verifiedToken = jwt.verify(token, secret);
        return {
            success: true,
            data: verifiedToken
        };
    } catch (error: any) {
        console.log("Token verification failed:", error);
        return {
            success: false,
            error: error.message
        }
    };
};

export const jwtUtils = {
    createToken,
    verifyToken,
};