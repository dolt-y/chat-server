export interface ChatListItemDto {
  chatId: number;
  chatType: 'private' | 'group';
  chatName: string | null;
  chatAvatar: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  isAdmin: boolean | null;
  joinedAt: Date | null;
  lastMessage?: {
    id: number;
    content: string;
    type: 'text' | 'image' | 'file' | 'video' | 'audio';
    createdAt: Date;
    senderId: number;
    senderUsername: string;
  } | null;
  unreadCount: number;
  participants?: Array<{
    userId: number;
    username: string;
    avatarUrl: string | null;
    status: 'online' | 'offline' | 'away' | 'busy' | null;
    isAdmin: boolean | null;
  }>;
}