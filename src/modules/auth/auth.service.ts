import { UserStatus } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { ILoginUser, IRegisterUser } from "./auth.interface";
import bcrypt from "bcrypt";
import { jwtUtils } from "../../utils/jwtService";
import { SignOptions } from "jsonwebtoken";

const registerUser = async (payload: IRegisterUser) => {
    const { name, email, password, phone, role, profileImg } = payload;

    if (role === "ADMIN") {
        throw new Error("You are not allowed to register as an admin.");
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new Error("User already exists with this email.");
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

    const registeredUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            phone,
            role,
            profileImg
        },
        omit: {
            password: true
        }
    });
    return registeredUser;
};

const loginUser = async (payload: ILoginUser) => {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error("User not found.!");
    };

    if (user.status === UserStatus.BLOCKED) {
        throw new Error("Your account has been blocked.!");
    };

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new Error("Invalid email or password...!");
    };

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwtUtils.createToken(jwtPayload, config.jwt_access_secret, config.jwt_access_expires_in as SignOptions);

    const refreshToken = jwtUtils.createToken(jwtPayload, config.jwt_refresh_secret, config.jwt_refresh_expires_in as SignOptions);

    return {
        accessToken,
        refreshToken,
        user: jwtPayload
    };
};

const getMe = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        },
        omit: {
            password: true
        }
    });

    return user;
};

export const authService = {
    registerUser,
    loginUser,
    getMe
};