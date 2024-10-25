-- AlterTable
ALTER TABLE `address` MODIFY `latitude` INTEGER NULL,
    MODIFY `longitude` INTEGER NULL;

-- AlterTable
ALTER TABLE `discount` MODIFY `value` INTEGER NOT NULL,
    MODIFY `minPurchase` INTEGER NULL;

-- AlterTable
ALTER TABLE `order` MODIFY `totalAmount` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `orderitem` MODIFY `price` INTEGER NOT NULL,
    MODIFY `discountValue` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `payment` MODIFY `amountPaid` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `salesreport` MODIFY `totalSales` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `shippingoption` MODIFY `baseCost` INTEGER NOT NULL,
    MODIFY `additionalCost` INTEGER NOT NULL,
    MODIFY `maxDistance` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `store` MODIFY `latitude` INTEGER NOT NULL,
    MODIFY `longitude` INTEGER NOT NULL;
