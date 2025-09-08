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
  } | null;
  unreadCount: number;
}