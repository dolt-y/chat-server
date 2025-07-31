CREATE TABLE messages (
    id INT NOT NULL AUTO_INCREMENT COMMENT '唯一标识每条消息',
    chat_id INT NOT NULL COMMENT '关联的会话 ID',
    sender_id INT NOT NULL COMMENT '发送者用户 ID',
    content TEXT NOT NULL COMMENT '消息内容',
    type ENUM('text', 'image', 'file', 'video', 'audio') NOT NULL COMMENT '消息类型，支持文本、图片、文件、视频和音频',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '消息创建时间',
    is_read BOOLEAN DEFAULT FALSE COMMENT '消息是否已读',
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES user(id) ON DELETE CASCADE,
    PRIMARY KEY (id)
) ENGINE=InnoDB COMMENT='创建聊天记录表，用于存储每条消息的信息';