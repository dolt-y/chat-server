CREATE TABLE chats (
    id INT NOT NULL AUTO_INCREMENT COMMENT '唯一标识每个会话',
    type ENUM('private', 'group') NOT NULL COMMENT '会话类型，区分一对一聊天和群组聊天',
    name VARCHAR(255) DEFAULT NULL COMMENT '群组名称（如果是群组聊天）',
    avatar VARCHAR(255) DEFAULT NULL COMMENT '群组头像 URL（如果是群组聊天）',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '会话创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '会话最后更新时间',
    PRIMARY KEY (id)
) ENGINE=InnoDB COMMENT='创建会话表，用于存储聊天会话信息';