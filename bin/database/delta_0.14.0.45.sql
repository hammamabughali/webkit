DROP TABLE IF EXISTS `track_ratings`;

CREATE TABLE `track_ratings` (
  `trackId` int(10) UNSIGNED NOT NULL,
  `userId` bigint(10) UNSIGNED NOT NULL,
  `rating` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `track_ratings`
  ADD PRIMARY KEY (`trackId`,`userId`),
  ADD KEY `userId` (`userId`);

ALTER TABLE `track_ratings`
  ADD CONSTRAINT `track_ratings_ibfk_1` FOREIGN KEY (`trackId`) REFERENCES `tracks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `track_ratings_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
