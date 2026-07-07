import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateProperty, IPropertyQuery } from "./property.interface";

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

export const propertyService = {
    createProperty,
    getAllProperties,
    getPropertyById
};