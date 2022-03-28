/*
  Warnings:

  - You are about to drop the column `hash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hashedRT` on the `User` table. All the data in the column will be lost.
  - Added the required column `hashedPassword` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "hash",
DROP COLUMN "hashedRT",
ADD COLUMN     "hashedPassword" TEXT NOT NULL,
ADD COLUMN     "hashedRt" TEXT;
