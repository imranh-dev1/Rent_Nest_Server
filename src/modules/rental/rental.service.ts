import { prisma } from "../../lib/prisma";
import status from "http-status";
import { RentalStatus, PropertyAvailability } from "../../../generated/prisma/enums";
import AppError from "../../errors/AppError";
import { ICreateRentalRequest } from "./rental.interface";

const createRentalRequest = async (tenantId: string, payload: ICreateRentalRequest) => {
    const { propertyId, moveInDate, leaseMonths, message } = payload;

    const property = await prisma.property.findUniqueOrThrow({
        where: {
            id: propertyId,
        },
    });

    if (property.availability !== PropertyAvailability.AVAILABLE) {
        throw new AppError(status.BAD_REQUEST, "This property is currently not available for rent."
        );
    };

    if (property.landlordId === tenantId) {
        throw new AppError(status.BAD_REQUEST, "You cannot submit a rental request for your own property.");
    }

    const existingRequest = await prisma.rentalRequest.findFirst({
        where: {
            tenantId,
            propertyId,
            status: RentalStatus.PENDING,
        },
    });

    if (existingRequest) {
        throw new AppError(status.CONFLICT, "You already have a pending rental request for this property.");
    }

    const rentalRequest = await prisma.rentalRequest.create({
        data: {
            tenantId,
            propertyId,
            moveInDate,
            leaseMonths,
            message,
        },
        include: {
            tenant: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            property: {
                include: {
                    category: true,
                },
            },
        },
    });

    return rentalRequest;
};

const getMyRentalRequests = async (tenantId: string) => {

    const rentalRequests = await prisma.rentalRequest.findMany({
        where: {
            tenantId,
        },
        include: {
            property: {
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
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return rentalRequests;
}

const getLandlordRentalRequests = async (landlordId: string) => {
    const rentalRequests = await prisma.rentalRequest.findMany({
        where: {
            property: {
                landlordId,
            },
        },
        include: {
            tenant: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    profileImg: true,
                },
            },
            property: {
                select: {
                    id: true,
                    title: true,
                    city: true,
                    address: true,
                    rentAmount: true,
                    availability: true,
                    images: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return rentalRequests;
};

const updateRentalRequestStatus = async (rentalRequestId: string, landlordId: string, rentalStatus: RentalStatus) => {
    const rentalRequest = await prisma.rentalRequest.findUniqueOrThrow({
        where: {
            id: rentalRequestId,
        },
        include: {
            property: true,
        },
    });

    if (rentalRequest.property.landlordId !== landlordId) {
        throw new AppError(status.FORBIDDEN, "You are not authorized to perform this action.");
    };

    if (rentalRequest.status !== RentalStatus.PENDING) {
        throw new AppError(status.BAD_REQUEST, "This rental request has already been processed.");
    };

    const result = await prisma.$transaction(async (tx) => {

        const updatedRequest = await tx.rentalRequest.update({
            where: {
                id: rentalRequestId,
            },
            data: {
                status: rentalStatus,
            },
            include: {
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                property: true,
            },
        });

        if (rentalStatus === RentalStatus.APPROVED) {
            await tx.property.update({
                where: {
                    id: rentalRequest.propertyId,
                },
                data: {
                    availability: PropertyAvailability.RENTED,
                },
            });

            await tx.rentalRequest.updateMany({
                where: {
                    propertyId: rentalRequest.propertyId,
                    status: RentalStatus.PENDING,
                    id: {
                        not: rentalRequestId,
                    },
                },
                data: {
                    status: RentalStatus.REJECTED,
                },
            });
        }

        return updatedRequest;
    });

    return result;
};

const cancelRentalRequest = async (rentalRequestId: string, tenantId: string) => {
    const rentalRequest = await prisma.rentalRequest.findUniqueOrThrow({
        where: {
            id: rentalRequestId,
        },
    });

    if (rentalRequest.tenantId !== tenantId) {
        throw new AppError(status.FORBIDDEN, "You are not authorized to cancel this rental request.");
    };

    if (rentalRequest.status !== RentalStatus.PENDING) {
        throw new AppError(status.BAD_REQUEST, "Only pending rental requests can be cancelled.");
    };

    const result = await prisma.rentalRequest.update({
        where: {
            id: rentalRequestId,
        },
        data: {
            status: RentalStatus.CANCELLED,
        },
        include: {
            property: {
                select: {
                    id: true,
                    title: true,
                    city: true,
                    rentAmount: true,
                },
            },
        },
    });

    return result;
};

export const rentalRequestsService = {
    createRentalRequest,
    getMyRentalRequests,
    getLandlordRentalRequests,
    updateRentalRequestStatus,
    cancelRentalRequest
}