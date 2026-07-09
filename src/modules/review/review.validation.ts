import { z } from "zod";

const createReviewSchema = z.object({
    params: z.object({
        propertyId: z.string().uuid("Invalid property ID."),
    }),

    body: z.object({
        rating: z
            .number({
                error: "Rating must be a number.",
            })
            .int("Rating must be an integer.")
            .min(1, "Rating must be at least 1.")
            .max(5, "Rating cannot be greater than 5."),

        comment: z
            .string()
            .trim()
            .max(1000, "Comment cannot exceed 1000 characters.")
            .optional(),
    }),
});

const updateReviewSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid review ID."),
    }),

    body: z.object({
        rating: z
            .number({
                error: "Rating must be a number.",
            })
            .int("Rating must be an integer.")
            .min(1, "Rating must be at least 1.")
            .max(5, "Rating cannot be greater than 5.")
            .optional(),

        comment: z
            .string()
            .trim()
            .max(1000, "Comment cannot exceed 1000 characters.")
            .optional(),
    }),
});

const propertyIdSchema = z.object({
    params: z.object({
        propertyId: z.string().uuid("Invalid property ID."),
    }),
});

const reviewIdSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid review ID."),
    }),
});

export const reviewValidation = {
    createReviewSchema,
    updateReviewSchema,
    propertyIdSchema,
    reviewIdSchema,
};