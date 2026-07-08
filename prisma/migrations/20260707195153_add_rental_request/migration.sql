-- CreateEnum
CREATE TYPE "RentalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "rental_requests" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "moveInDate" TIMESTAMP(3) NOT NULL,
    "leaseMonths" INTEGER NOT NULL,
    "message" TEXT,
    "status" "RentalStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rental_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rental_requests" ADD CONSTRAINT "rental_requests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_requests" ADD CONSTRAINT "rental_requests_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
