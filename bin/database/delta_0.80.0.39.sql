CREATE TABLE `competitions` (
  `id` int(10) UNSIGNED NOT NULL,
  `nameInternal` varchar(128) NOT NULL,
  `regionId` varchar(16) NOT NULL,
  `starts` datetime NOT NULL,
  `ends` datetime NOT NULL,
  `isPublic` enum('false','true') NOT NULL DEFAULT 'false',
  `fixedParticipants` enum('false','true') NOT NULL DEFAULT 'false',
  `mayApply` enum('false','true') NOT NULL DEFAULT 'false'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `localizations` (
  `locale` char(4) NOT NULL,
  `itemType` varchar(32) NOT NULL,
  `itemId` int(10) UNSIGNED NOT NULL,
  `field` varchar(32) NOT NULL,
  `text` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `competitions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `regionId` (`regionId`);

ALTER TABLE `localizations`
  ADD PRIMARY KEY (`locale`,`itemType`,`itemId`,`field`);


ALTER TABLE `competitions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `competitions`
  ADD CONSTRAINT `competitions_ibfk_1` FOREIGN KEY (`regionId`) REFERENCES `region_variants` (`id`) ON UPDATE CASCADE;
