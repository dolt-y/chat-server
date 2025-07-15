CREATE TABLE `message` (
    `id` int NOT NULL AUTO_INCREMENT,
    `content` text NOT NULL,
    `message_type` varchar(255) NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `chatId` int NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`chatId`) REFERENCES `chat`(`id`)
) ENGINE=InnoDB;