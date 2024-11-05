/*
  Warnings:

  - Made the column `googleId` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `googleId` VARCHAR(191) NOT NULL;
