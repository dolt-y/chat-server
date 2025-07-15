CREATE TABLE `friendship` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `friend_id` int NOT NULL,
    `status` enum('pending', 'accepted', 'declined') DEFAULT 'pending',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
    FOREIGN KEY (`friend_id`) REFERENCES `user`(`id`)
) ENGINE=InnoDB;