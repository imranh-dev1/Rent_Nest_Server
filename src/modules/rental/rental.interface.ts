import { RentalStatus } from "../../../generated/prisma/enums";

export interface ICreateRentalRequest {
    propertyId: string;
    moveInDate?: string;
    leaseMonths: number;
    message?: string;
}

export interface IUpdateRentalRequestStatus {
    status: RentalStatus;
}