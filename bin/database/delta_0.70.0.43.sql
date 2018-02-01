DROP TABLE IF EXISTS `region_domains`;

CREATE TABLE `region_domains` (
  `name` varchar(200) NOT NULL,
  `regionId` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `region_domains`
  ADD PRIMARY KEY (`name`),
  ADD KEY `regionId` (`regionId`);

ALTER TABLE `region_domains`
  ADD CONSTRAINT `region_domains_ibfk_1` FOREIGN KEY (`regionId`) REFERENCES `region_variants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
