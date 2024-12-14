ALTER TABLE `storeLocations` RENAME TO `locations`;--> statement-breakpoint
ALTER TABLE `stores` RENAME COLUMN "headline" TO "category";--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_locations` (
	`id` text PRIMARY KEY NOT NULL,
	`storeId` text NOT NULL,
	`name` text,
	`address` text NOT NULL,
	`phones` text,
	`isPrimary` integer DEFAULT false NOT NULL,
	`schedule` text,
	`createdAt` text DEFAULT (DATETIME('now')) NOT NULL,
	`updatedAt` text DEFAULT (DATETIME('now')) NOT NULL,
	FOREIGN KEY (`storeId`) REFERENCES `stores`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_locations`("id", "storeId", "name", "address", "phones", "isPrimary", "schedule", "createdAt", "updatedAt") SELECT "id", "storeId", "name", "address", "phones", "isPrimary", "schedule", "createdAt", "updatedAt" FROM `locations`;--> statement-breakpoint
DROP TABLE `locations`;--> statement-breakpoint
ALTER TABLE `__new_locations` RENAME TO `locations`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `locationStoreId` ON `locations` (`storeId`);--> statement-breakpoint
ALTER TABLE `stores` ADD `primaryColor` text;--> statement-breakpoint
ALTER TABLE `stores` ADD `socialLinks` text;