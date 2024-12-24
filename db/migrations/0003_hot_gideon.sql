DROP INDEX IF EXISTS `locationStoreId`;--> statement-breakpoint
DROP INDEX IF EXISTS `storeUserId`;--> statement-breakpoint
CREATE INDEX `userStoreIndex` ON `stores` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `uniqueStoreName` ON `stores` (`userId`,`name`);