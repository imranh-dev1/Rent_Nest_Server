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
        throw new Error("Category already exists.!");
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