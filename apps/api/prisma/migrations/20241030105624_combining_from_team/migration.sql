/*
  Warnings:

  - You are about to drop the `_productdiscounts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_productdiscounts` DROP FOREIGN KEY `_ProductDiscounts_A_fkey`;

-- DropForeignKey
ALTER TABLE `_productdiscounts` DROP FOREIGN KEY `_ProductDiscounts_B_fkey`;

-- AlterTable
ALTER TABLE `discount` ADD COLUMN `productId` INTEGER NULL;

-- DropTable
DROP TABLE `_productdiscounts`;

-- AddForeignKey
ALTER TABLE `Discount` ADD CONSTRAINT `Discount_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
