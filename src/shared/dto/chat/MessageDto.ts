export interface MessageDto {
  messageId: number; // 消息 ID
  content: string; // 消息内容
  createdAt: Date; // 消息创建时间
  senderId: number; // 发送者 ID
  senderUsername: string; // 发送者用户名
  receiverId: number; // 接收者 ID
  receiverUsername: string; // 接收者用户名
}
