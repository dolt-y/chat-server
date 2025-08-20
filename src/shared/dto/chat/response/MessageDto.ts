export interface MessageDto {
  messageId: number; // 消息 ID
  content: string; // 消息内容
  createdAt: Date; // 消息创建时间
  senderId: number; // 发送者 ID
  senderUsername: string; // 发送者用户名
  isRead: boolean | null; // 是否已读（与实体保持一致）
  type: string; // 消息类型
}