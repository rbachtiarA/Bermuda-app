-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_shippingOptionId_fkey`;

-- AlterTable
ALTER TABLE `order` MODIFY `shippingOptionId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_shippingOptionId_fkey` FOREIGN KEY (`shippingOptionId`) REFERENCES `ShippingOption`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
