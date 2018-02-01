SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

DROP TABLE IF EXISTS `admin_settings`;
CREATE TABLE `admin_settings` (
  `id` varchar(128) NOT NULL DEFAULT '',
  `value` varchar(128) NOT NULL DEFAULT '',
  `lastModifiedWhen` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `admin_settings` (`id`, `value`, `lastModifiedWhen`) VALUES
('DB_VERSION', '0.0.0.0', '2017-01-31 15:32:02');

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` varchar(32) NOT NULL DEFAULT '',
  `lastUpdated` bigint(20) UNSIGNED NOT NULL,
  `valuesJson` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `tracks`;
CREATE TABLE `tracks` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `ownerId` bigint(20) UNSIGNED NOT NULL,
  `isPublished` enum('false','true') NOT NULL DEFAULT 'false',
  `predecessorId` int(10) UNSIGNED DEFAULT NULL,
  `data` text NOT NULL,
  `createdWhen` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastSavedWhen` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `rating` float NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `imageUrl` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `admin_settings`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lastUpdate` (`lastUpdated`);

ALTER TABLE `tracks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `ownerId` (`ownerId`),
  ADD KEY `predecessorId` (`predecessorId`),
  ADD KEY `createdWhen` (`createdWhen`),
  ADD KEY `rating` (`rating`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `tracks`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `tracks`
  ADD CONSTRAINT `tracks_ibfk_1` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tracks_ibfk_2` FOREIGN KEY (`predecessorId`) REFERENCES `tracks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
