import { Router } from "express"
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { rentalRequestsController } from "./rental.controller";
import validateRequest from "../../middlewares/validateRequest";
import { rentalRequestValidation } from "./rental.validation";

const router = Router();

router.post("/", auth(Role.TENANT), validateRequest(rentalRequestValidation.createRentalRequestSchema), rentalRequestsController.createRentalRequest);

router.get("/my-requests", auth(Role.TENANT), rentalRequestsController.getMyRentalRequests);

router.get("/landlord", auth(Role.LANDLORD), rentalRequestsController.getLandlordRentalRequests);

router.patch("/:id/status", auth(Role.LANDLORD), validateRequest(rentalRequestValidation.updateRentalRequestStatusSchema), rentalRequestsController.updateRentalRequestStatus);

router.patch("/:id/cancel", auth(Role.TENANT), rentalRequestsController.cancelRentalRequest);

export const rentalRequestsRoute = router;