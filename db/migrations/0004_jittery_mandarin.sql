CREATE TABLE `product_option_choices` (
	`id` text PRIMARY KEY NOT NULL,
	`optionGroupId` text NOT NULL,
	`name` text NOT NULL,
	`price` integer NOT NULL,
	`isDefault` integer DEFAULT false NOT NULL,
	`createdAt` text DEFAULT (DATETIME('now')) NOT NULL,
	`updatedAt` text DEFAULT (DATETIME('now')) NOT NULL,
	FOREIGN KEY (`optionGroupId`) REFERENCES `product_option_groups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `product_option_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`productId` text NOT NULL,
	`name` text NOT NULL,
	`required` integer DEFAULT false NOT NULL,
	`multiple` integer DEFAULT false NOT NULL,
	`minChoices` integer,
	`maxChoices` integer,
	`createdAt` text DEFAULT (DATETIME('now')) NOT NULL,
	`updatedAt` text DEFAULT (DATETIME('now')) NOT NULL,
	FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`storeId` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`basePrice` integer NOT NULL,
	`featuredImage` text,
	`images` text,
	`category` text,
	`tags` text,
	`available` integer DEFAULT true NOT NULL,
	`createdAt` text DEFAULT (DATETIME('now')) NOT NULL,
	`updatedAt` text DEFAULT (DATETIME('now')) NOT NULL,
	FOREIGN KEY (`storeId`) REFERENCES `stores`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uniqueProductName` ON `products` (`storeId`,`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `uniqueProductSlug` ON `products` (`storeId`,`slug`);