/*
  Warnings:

  - You are about to drop the `_productstores` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_productstores` DROP FOREIGN KEY `_ProductStores_A_fkey`;

-- DropForeignKey
ALTER TABLE `_productstores` DROP FOREIGN KEY `_ProductStores_B_fkey`;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `storeId` INTEGER NULL;

-- DropTable
DROP TABLE `_productstores`;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
