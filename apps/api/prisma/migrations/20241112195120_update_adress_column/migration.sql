/*
  Warnings:

  - Made the column `label` on table `address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phoneNumber` on table `address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `recipient` on table `address` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `address` MODIFY `label` VARCHAR(191) NOT NULL,
    MODIFY `phoneNumber` VARCHAR(191) NOT NULL,
    MODIFY `recipient` VARCHAR(191) NOT NULL;
