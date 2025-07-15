CREATE TABLE `chat` (
    `id` int NOT NULL AUTO_INCREMENT,
    `sender_id` int NOT NULL,
    `receiver_id` int NOT NULL,
    `message` text NOT NULL,
    `message_type` varchar(255) NULL,
    `status` enum('sent', 'received', 'read') DEFAULT 'sent',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`sender_id`) REFERENCES `user`(`id`),
    FOREIGN KEY (`receiver_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB;