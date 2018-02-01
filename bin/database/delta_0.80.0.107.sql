ALTER TABLE `competitions` ADD `minScore` INT UNSIGNED NOT NULL DEFAULT '0' AFTER `mayApply`;
ALTER TABLE `competitions` ADD `layers` INT UNSIGNED NOT NULL DEFAULT '9' AFTER `minScore`;
ALTER TABLE `competitions` ADD `baseTrackId` INT UNSIGNED NULL DEFAULT NULL AFTER `layers`, ADD INDEX (`baseTrackId`);
ALTER TABLE `competitions` ADD FOREIGN KEY (`baseTrackId`) REFERENCES `tracks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
