CREATE TABLE friends (
    id INT NOT NULL AUTO_INCREMENT COMMENT '唯一标识每个好友关系记录',
    user_id INT NOT NULL COMMENT '用户的 ID',
    friend_id INT NOT NULL COMMENT '好友的用户 ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '好友关系创建时间',
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES user(id) ON DELETE CASCADE,
    PRIMARY KEY (id)
) ENGINE=InnoDB COMMENT='创建好友关系表，用于存储用户之间的好友关系';