-- AlterTable
ALTER TABLE `stockhistory` MODIFY `changeType` ENUM('INCREASE', 'DECREASE', 'DELETED') NOT NULL;
