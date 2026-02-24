CREATE TABLE `syncLog` (
	`id` varchar(36) NOT NULL,
	`userId` int NOT NULL,
	`deviceId` varchar(255) NOT NULL,
	`action` enum('upload','download','sync') NOT NULL,
	`entityType` enum('testResult','userStats') NOT NULL,
	`entityId` varchar(36),
	`status` enum('pending','success','failed') NOT NULL DEFAULT 'pending',
	`lastSyncedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `syncLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testResults` (
	`id` varchar(36) NOT NULL,
	`userId` int NOT NULL,
	`type` enum('block','general') NOT NULL,
	`blockId` varchar(10),
	`blockName` varchar(255),
	`score` int NOT NULL,
	`totalQuestions` int NOT NULL,
	`percentage` int NOT NULL,
	`duration` int NOT NULL,
	`userAnswers` text NOT NULL,
	`questions` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testResults_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userStats` (
	`id` varchar(36) NOT NULL,
	`userId` int NOT NULL,
	`totalTests` int NOT NULL DEFAULT 0,
	`totalCorrect` int NOT NULL DEFAULT 0,
	`averagePercentage` int NOT NULL DEFAULT 0,
	`lastTestAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userStats_id` PRIMARY KEY(`id`),
	CONSTRAINT `userStats_userId_unique` UNIQUE(`userId`)
);
