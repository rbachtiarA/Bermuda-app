/*
  Warnings:

  - Added the required column `cityId` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `store` ADD COLUMN `cityId` INTEGER NOT NULL DEFAULT 55 ;

-- AddForeignKey
ALTER TABLE `Store` ADD CONSTRAINT `Store_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
