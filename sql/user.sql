CREATE TABLE `user` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '唯一标识每个用户',
    `username` VARCHAR(255) NOT NULL UNIQUE COMMENT '用户的唯一用户名',
    `password` VARCHAR(255) NOT NULL COMMENT '用户的密码',
    `email` VARCHAR(255) NULL COMMENT '用户的电子邮件地址',
    `phone` VARCHAR(255) NULL COMMENT '用户的电话号码',
    `avatar_url` VARCHAR(255) NULL COMMENT '用户头像的 URL',
    `bio` TEXT NULL COMMENT '用户的个人简介',
    `status` ENUM('online', 'offline', 'away', 'busy') DEFAULT 'offline' COMMENT '用户的在线状态',
    `last_login` DATETIME NULL COMMENT '用户最后登录时间',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '用户创建时间',
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '用户信息最后更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB COMMENT='创建用户表，用于存储用户的基本信息';