ALTER TABLE `tracks` ADD `isEducational` ENUM('false','true') NOT NULL DEFAULT 'false' AFTER `ownerId`;