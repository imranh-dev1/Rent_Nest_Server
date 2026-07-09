import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import validateRequest from "../../middlewares/validateRequest";
import { reviewValidation } from "./review.validation";

const router = Router();

router.post("/:propertyId", validateRequest(reviewValidation.createReviewSchema), auth(Role.TENANT), reviewController.createReview);
router.get("/:propertyId", validateRequest(reviewValidation.propertyIdSchema), reviewController.getPropertyReviews);
router.patch("/:id", auth(Role.TENANT), validateRequest(reviewValidation.updateReviewSchema), reviewController.updateReview);
router.delete("/:id", auth(Role.TENANT), validateRequest(reviewValidation.reviewIdSchema), reviewController.deleteReview);


export const reviewRoute = router;