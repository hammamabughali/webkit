CREATE TABLE `reportscomment` (
  `id` int(10) NOT NULL,
  `commentId` int(10) UNSIGNED NOT NULL,
  `userId` bigint(20) UNSIGNED NOT NULL,
  `createdWehn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE `reportscomment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `commenId` (`commentId`,`userId`) USING BTREE,
  ADD KEY `userId` (`userId`);


ALTER TABLE `reportscomment`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;


ALTER TABLE `reportscomment`
  ADD CONSTRAINT `reportscomment_ibfk_1` FOREIGN KEY (`commentId`) REFERENCES `comments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reportscomment_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;