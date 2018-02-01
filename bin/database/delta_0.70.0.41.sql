DROP TABLE IF EXISTS `region_admins`;
DROP TABLE IF EXISTS `region_variants`;

CREATE TABLE `region_admins` (
  `regionId` varchar(32) NOT NULL,
  `userId` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `region_variants` (
  `id` varchar(32) NOT NULL,
  `regionId` char(2) NOT NULL,
  `languageIds` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `region_variants` (`id`, `regionId`, `languageIds`) VALUES
('JAPAN', 'JP', 'en,jp'),
('MAIN', 'CH', 'de,en'),
('RUSSIAN', 'RU', 'en,ru');

ALTER TABLE `region_admins`
  ADD PRIMARY KEY (`regionId`,`userId`),
  ADD KEY `userId` (`userId`);

ALTER TABLE `region_variants`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `region_admins`
  ADD CONSTRAINT `region_admins_ibfk_1` FOREIGN KEY (`regionId`) REFERENCES `region_variants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `region_admins_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
