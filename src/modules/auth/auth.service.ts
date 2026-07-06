import config from "../../config";
import { prisma } from "../../lib/prisma";
import { IRegisterUser } from "./auth.interface";
import bcrypt from "bcrypt"

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

export const authService = {
    registerUser,
};