export class SockDto {
    chatId: number;
    senderId: number;
    content: string;
    type?: 'text' | 'image' | 'file' | 'video' | 'audio'
}