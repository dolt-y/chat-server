CREATE TABLE conversation_members (
    id INT NOT NULL AUTO_INCREMENT COMMENT '唯一标识每个会话成员记录',
    chat_id INT NOT NULL COMMENT '关联的会话 ID',
    user_id INT NOT NULL COMMENT '参与者用户 ID',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '用户加入会话的时间',
    is_admin BOOLEAN DEFAULT FALSE COMMENT '是否为管理员（适用于群组聊天）',
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    PRIMARY KEY (id)
) ENGINE=InnoDB COMMENT='创建会话成员表，用于记录每个会话的参与者信息';