CREATE TABLE `storeLocations` (
	`id` text PRIMARY KEY NOT NULL,
	`storeId` text NOT NULL,
	`name` text NOT NULL,
	`address` text NOT NULL,
	`createdAt` text DEFAULT (DATETIME('now')) NOT NULL,
	`updatedAt` text DEFAULT (DATETIME('now')) NOT NULL,
	FOREIGN KEY (`storeId`) REFERENCES `stores`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `locationStoreId` ON `storeLocations` (`storeId`);--> statement-breakpoint
CREATE TABLE `stores` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`name` text NOT NULL,
	`favicon` text,
	`logo` text,
	`headline` text,
	`bio` text,
	`createdAt` text DEFAULT (DATETIME('now')) NOT NULL,
	`updatedAt` text DEFAULT (DATETIME('now')) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `storeUserId` ON `stores` (`userId`);