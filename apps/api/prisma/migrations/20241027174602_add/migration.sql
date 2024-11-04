/*
  Warnings:

  - A unique constraint covering the columns `[referralCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `discount` ADD COLUMN `giverId` INTEGER NULL,
    ADD COLUMN `userId` INTEGER NULL,
    MODIFY `discountType` ENUM('FLAT', 'PERCENTAGE', 'BUY_ONE_GET_ONE', 'REFERRAL_GIVER', 'REFERRAL_USER') NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `referralCode` VARCHAR(191) NULL,
    ADD COLUMN `referredById` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_referralCode_key` ON `User`(`referralCode`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_referredById_fkey` FOREIGN KEY (`referredById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Discount` ADD CONSTRAINT `Discount_giverId_fkey` FOREIGN KEY (`giverId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Discount` ADD CONSTRAINT `Discount_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
