import status from "http-status";
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateProperty, IPropertyQuery, IUpdateProperty } from "./property.interface";
import AppError from "../../errors/AppError";

const createProperty = async (payload: ICreateProperty, landlordId: string) => {

    await prisma.category.findUniqueOrThrow({
        where: {
            id: payload.categoryId,
        },
    });

    const property = await prisma.property.create({
        data: {
            ...payload,
            landlordId
        },
    });

    return property;
};

const getAllProperties = async (queries: IPropertyQuery) => {
    const { page = 1, limit = 10, search, categoryId, city, minPrice, maxPrice, availability, sortBy = "createdAt", sortOrder = "desc", } = queries;

    const skip = (Number(page) - 1) * Number(limit);

    const where: Prisma.PropertyWhereInput = {};

    // Search
    if (search) {
        where.OR = [
            {
                title: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                city: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                address: {
                    contains: search,
                    mode: "insensitive",
                },
            },
        ];
    }

    // Category Filter
    if (categoryId) {
        where.categoryId = categoryId;
    }

    // City Filter
    if (city) {
        where.city = {
            contains: city,
            mode: "insensitive",
        };
    }

    // Availability Filter
    if (availability !== undefined) {
        where.availability = availability;
    }

    // Price Filter
    if (minPrice || maxPrice) {
        where.rentAmount = {
            ...(minPrice && { gte: Number(minPrice) }),
            ...(maxPrice && { lte: Number(maxPrice) }),
        };
    }

    const [properties, total] = await Promise.all([
        prisma.property.findMany({
            where,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
                landlord: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        profileImg: true,
                    },
                },
            },
            skip,
            take: Number(limit),
            orderBy: {
                [sortBy]: sortOrder,
            },
        }),

        prisma.property.count({
            where,
        }),
    ]);

    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPage: Math.ceil(total / Number(limit)),
        },
        data: properties,
    };
};

const getPropertyById = async (propertyId: string) => {
    const property = await prisma.property.findUniqueOrThrow({
        where: {
            id: propertyId
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                },
            },
            landlord: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    profileImg: true,
                },
            },
        },
    });

    return property;
};

const updateProperty = async (payload: IUpdateProperty, propertyId: string, landlordId: string) => {

    const existingProperty = await prisma.property.findUniqueOrThrow({
        where: {
            id: propertyId,
        },
    });

    if (existingProperty.landlordId !== landlordId) {
        throw new AppError(status.FORBIDDEN, "You are not authorized to update this property.");
    }

    const updatedProperty = await prisma.property.update({
        where: {
            id: propertyId,
        },
        data: payload,
        include: {
            category: true,
            landlord: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    return updatedProperty;
};

const deleteProperty = async (propertyId: string, landlordId: string) => {

    const existingProperty = await prisma.property.findUniqueOrThrow({
        where: {
            id: propertyId,
        },
    });

    if (existingProperty.landlordId !== landlordId) {
        throw new AppError(status.FORBIDDEN, "You are not authorized to delete this property.");
    }

    await prisma.property.delete({
        where: {
            id: propertyId,
        },
    });

    return null;
};

export const propertyService = {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
};