import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import validateRequest from "../../middlewares/validateRequest";
import { categoryValidation } from "./category.validation";
import { categorieController } from "./category.controller";

const router = Router();

router.post("/", auth(Role.ADMIN), validateRequest(categoryValidation.createCategorySchema), categorieController.createCategory);

export const categoryRoute = router;