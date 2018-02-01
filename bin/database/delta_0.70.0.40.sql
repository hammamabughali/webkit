UPDATE `tracks` SET `previousId` = NULL;
ALTER TABLE `tracks` DROP IF EXISTS `previousSavedWhen`;
ALTER TABLE `tracks` CHANGE `previousId` `previousId` INT(10) UNSIGNED NULL DEFAULT NULL;
ALTER TABLE `tracks` ADD FOREIGN KEY (`previousId`) REFERENCES `tracks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
