-- CreateEnum
CREATE TYPE "RequestUrgency" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "BloodInventory" ADD COLUMN     "expiryDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "BloodRequest" ADD COLUMN     "urgency" "RequestUrgency" NOT NULL DEFAULT 'MEDIUM';
