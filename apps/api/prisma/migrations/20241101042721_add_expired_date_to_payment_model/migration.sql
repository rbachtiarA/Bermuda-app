/*
  Warnings:

  - Added the required column `expiredDate` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment` ADD COLUMN `expiredDate` DATETIME(3) NOT NULL;
