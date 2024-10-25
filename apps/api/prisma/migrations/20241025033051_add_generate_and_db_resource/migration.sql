/*
  Warnings:

  - You are about to alter the column `latitude` on the `address` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `longitude` on the `address` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to drop the column `totalPrice` on the `cartitem` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `discount` table. All the data in the column will be lost.
  - You are about to alter the column `value` on the `discount` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `minPurchase` on the `discount` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `totalAmount` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `price` on the `orderitem` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `discountValue` on the `orderitem` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `amountPaid` on the `payment` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `totalSales` on the `salesreport` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `baseCost` on the `shippingoption` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `additionalCost` on the `shippingoption` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `maxDistance` on the `shippingoption` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `latitude` on the `store` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `longitude` on the `store` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to drop the `_producttostore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `samples` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Address` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_producttostore` DROP FOREIGN KEY `_ProductToStore_A_fkey`;

-- DropForeignKey
ALTER TABLE `_producttostore` DROP FOREIGN KEY `_ProductToStore_B_fkey`;

-- DropForeignKey
ALTER TABLE `discount` DROP FOREIGN KEY `Discount_productId_fkey`;

-- AlterTable
ALTER TABLE `address` MODIFY `latitude` DOUBLE NULL,
    MODIFY `longitude` DOUBLE NULL;

-- AlterTable
ALTER TABLE `cartitem` DROP COLUMN `totalPrice`;

-- AlterTable
ALTER TABLE `discount` DROP COLUMN `productId`,
    MODIFY `value` DOUBLE NOT NULL,
    MODIFY `minPurchase` DOUBLE NULL;

-- AlterTable
ALTER TABLE `order` MODIFY `totalAmount` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `orderitem` MODIFY `price` DOUBLE NOT NULL,
    MODIFY `discountValue` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `payment` MODIFY `amountPaid` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `isRecommended` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `salesreport` MODIFY `totalSales` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `shippingoption` MODIFY `baseCost` DOUBLE NOT NULL,
    MODIFY `additionalCost` DOUBLE NOT NULL,
    MODIFY `maxDistance` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `store` MODIFY `latitude` DOUBLE NOT NULL,
    MODIFY `longitude` DOUBLE NOT NULL;

-- DropTable
DROP TABLE `_producttostore`;

-- DropTable
DROP TABLE `samples`;

-- CreateTable
CREATE TABLE `_ProductStores` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ProductStores_AB_unique`(`A`, `B`),
    INDEX `_ProductStores_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProductDiscounts` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ProductDiscounts_AB_unique`(`A`, `B`),
    INDEX `_ProductDiscounts_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Address_userId_key` ON `Address`(`userId`);

-- AddForeignKey
ALTER TABLE `_ProductStores` ADD CONSTRAINT `_ProductStores_A_fkey` FOREIGN KEY (`A`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductStores` ADD CONSTRAINT `_ProductStores_B_fkey` FOREIGN KEY (`B`) REFERENCES `Store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductDiscounts` ADD CONSTRAINT `_ProductDiscounts_A_fkey` FOREIGN KEY (`A`) REFERENCES `Discount`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductDiscounts` ADD CONSTRAINT `_ProductDiscounts_B_fkey` FOREIGN KEY (`B`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
