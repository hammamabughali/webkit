ALTER TABLE `competitions` ADD `enabled` ENUM('false','true') NOT NULL DEFAULT 'true' AFTER `regionId`;
ALTER TABLE `competitions` DROP INDEX `regionId`, ADD INDEX `regionId` (`regionId`, `enabled`) USING BTREE;
