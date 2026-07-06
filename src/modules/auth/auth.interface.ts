import { Role } from "../../../generated/prisma/enums";


export interface IRegisterUser {
    name: string;
    email: string;
    password: string;
    phone?: string;
    profileImg?: string;
    role: Role;
}