-- RenameIndex
ALTER TABLE `address` RENAME INDEX `Address_userId_isPrimary_key` TO `unique_primary_address_per_user`;
