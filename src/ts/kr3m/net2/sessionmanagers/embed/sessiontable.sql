CREATE TABLE `sessions` (
  `id` varchar(32) NOT NULL DEFAULT '',
  `lastUpdated` bigint(20) UNSIGNED NOT NULL,
  `isDestroyed` enum('false','true') NOT NULL DEFAULT 'false',
  `valuesJson` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lastUpdate` (`lastUpdated`);
