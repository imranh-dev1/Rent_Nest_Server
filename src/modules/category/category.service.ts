import status from "http-status";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateCategory } from "./category.interface";

const createCategory = async (payload: ICreateCategory) => {
    const { name, description } = payload;

    const existingCategory = await prisma.category.findUnique({
        where: {
            name
        },
    });

    if (existingCategory) {
        throw new AppError(status.CONFLICT, "Category already exists.!");
    };

    const createdCategory = await prisma.category.create({
        data: {
            name,
            description
        },
    });

    return createdCategory;
}

export const categoriesService = {
    createCategory
}