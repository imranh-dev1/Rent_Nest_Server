import { z } from "zod";

const createCategorySchema = z.object({
    body: z.object({
        name: z
            .string({
                error: "Category name is required.",
            })
            .trim()
            .min(2, "Category name must be at least 2 characters.")
            .max(100, "Category name cannot exceed 100 characters."),

        description: z
            .string()
            .trim()
            .max(255, "Description cannot exceed 255 characters.")
            .optional(),
    }),
});

export const categoryValidation = {
    createCategorySchema
};