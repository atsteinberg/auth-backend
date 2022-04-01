-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "photoThumbnail" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "oldRts" TEXT[];
