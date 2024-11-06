-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('PendingPayment', 'Waiting', 'Confirmed', 'Proccessed', 'Shipped', 'Completed', 'Cancelled') NOT NULL;
