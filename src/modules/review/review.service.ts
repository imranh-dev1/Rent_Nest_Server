import status from "http-status";
import { prisma } from "../../lib/prisma";
import { ICreateReview } from "./review.interface";
import AppError from "../../errors/AppError";
import { RentalStatus } from "../../../generated/prisma/enums";

const createReview = async (tenantId: string, payload: ICreateReview, propertyId: string) => {
    const { rating, comment } = payload;

    await prisma.property.findUniqueOrThrow({
        where: { id: propertyId },
    });

    const completedRental = await prisma.rentalRequest.findFirst({
        where: {
            tenantId,
            propertyId,
            status: RentalStatus.COMPLETED,
        },
    });

    if (!completedRental) {
        throw new AppError(status.BAD_REQUEST, "You can only review properties after your rental is completed.");
    }

    const existingReview = await prisma.review.findUnique({
        where: {
            rentalRequestId: completedRental.id
        },
    });

    if (existingReview) {
        throw new AppError(status.BAD_REQUEST, "You have already reviewed this rental.");
    }

    const review = await prisma.review.create({
        data: {
            tenantId,
            propertyId,
            rentalRequestId: completedRental.id,
            rating,
            comment,
        },
        include: {
            tenant: {
                select: {
                    id: true,
                    name: true,
                    profileImg: true
                },
            },
            property: {
                select: {
                    id: true,
                    title: true,
                    city: true
                },
            },
        },
    });

    return review;
};

const getPropertyReviews = async (propertyId: string) => {
    const property = await prisma.property.findUniqueOrThrow({
        where: {
            id: propertyId,
        },
    });

    const reviews = await prisma.review.findMany({
        where: {
            propertyId,
        },
        include: {
            tenant: {
                select: {
                    id: true,
                    name: true,
                    profileImg: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return reviews;
};

const updateReview = async (reviewId: string, tenantId: string, payload: ICreateReview) => {
    const review = await prisma.review.findUniqueOrThrow({
        where: {
            id: reviewId,
        },
    });

    if (review.tenantId !== tenantId) {
        throw new AppError(status.FORBIDDEN, "You are not authorized to update this review.");
    }

    const updatedReview = await prisma.review.update({
        where: {
            id: reviewId,
        },
        data: payload,
        include: {
            tenant: {
                select: {
                    id: true,
                    name: true,
                    profileImg: true,
                },
            },
            property: {
                select: {
                    id: true,
                    title: true,
                    city: true,
                },
            },
        },
    });

    return updatedReview;
};

const deleteReview = async (reviewId: string, tenantId: string) => {
    const review = await prisma.review.findUniqueOrThrow({
        where: {
            id: reviewId,
        },
    });

    if (review.tenantId !== tenantId) {
        throw new AppError(status.FORBIDDEN, "You are not authorized to delete this review.");
    }

    await prisma.review.delete({
        where: {
            id: reviewId,
        },
    });

    return null;
};

export const reviewService = {
    createReview,
    getPropertyReviews,
    updateReview,
    deleteReview
};