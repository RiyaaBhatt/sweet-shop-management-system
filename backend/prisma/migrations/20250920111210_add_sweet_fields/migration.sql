/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Sweet` table. All the data in the column will be lost.
  - Added the required column `description` to the `Sweet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Sweet" DROP COLUMN "imageUrl",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sugarFree" BOOLEAN NOT NULL DEFAULT false;
