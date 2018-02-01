ALTER TABLE `users` ADD `lastRegionId` VARCHAR(32) NOT NULL DEFAULT 'MAIN' AFTER `imageUrl`;
ALTER TABLE `users` ADD INDEX(`lastRegionId`);
ALTER TABLE `users` ADD FOREIGN KEY (`lastRegionId`) REFERENCES `region_variants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
