/*
  Warnings:

  - You are about to drop the column `storeId` on the `Product` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "ChangeType" ADD VALUE 'DELETED';

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_storeId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "storeId";

-- AlterTable
ALTER TABLE "Stock" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_ProductStores" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductStores_AB_unique" ON "_ProductStores"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductStores_B_index" ON "_ProductStores"("B");

-- AddForeignKey
ALTER TABLE "_ProductStores" ADD CONSTRAINT "_ProductStores_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductStores" ADD CONSTRAINT "_ProductStores_B_fkey" FOREIGN KEY ("B") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
