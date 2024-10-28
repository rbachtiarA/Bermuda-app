/*
  Warnings:

  - You are about to drop the column `addressId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the `address` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `Address_userId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_addressId_fkey`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `addressId`;

-- DropTable
DROP TABLE `address`;
