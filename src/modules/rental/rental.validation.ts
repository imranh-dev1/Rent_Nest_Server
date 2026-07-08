import { z } from "zod";
import { RentalStatus } from "../../../generated/prisma/enums";

const createRentalRequestSchema = z.object({
    body: z.object({
        propertyId: z
            .string()
            .uuid("Invalid property ID."),

        moveInDate: z
            .string()
            .datetime("Please provide a valid move-in ISO date., or leave this field empty if it's optional.")
            .optional(),

        leaseMonths: z
            .number({
                error: "Lease months must be a number.",
            })
            .int("Lease months must be an integer.")
            .min(1, "Lease must be at least 1 month.")
            .max(60, "Lease cannot exceed 60 months."),

        message: z
            .string()
            .trim()
            .max(500, "Message cannot exceed 500 characters.")
            .optional(),
    }),
});

const updateRentalRequestStatusSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid rental request ID."),
    }),

    body: z.object({
        status: z.nativeEnum(RentalStatus),
    }),
});

const cancelRentalRequestSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid rental request ID."),
    }),
});

export const rentalRequestValidation = {
    createRentalRequestSchema,
    updateRentalRequestStatusSchema,
    cancelRentalRequestSchema,
};