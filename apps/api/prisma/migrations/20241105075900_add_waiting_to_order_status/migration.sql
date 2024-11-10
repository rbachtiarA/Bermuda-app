-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('PendingPayment', 'Waiting', 'Confirmed', 'Shipped', 'Completed', 'Cancelled') NOT NULL;
