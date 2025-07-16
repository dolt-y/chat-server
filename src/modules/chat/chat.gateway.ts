import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageService } from './message.service'; // 引入消息服务
import { ChatService } from './chat.service'; // 引入聊天服务

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly messageService: MessageService,
    private readonly chatService: ChatService,
  ) {}

  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody() data: { chatId: number },
    @ConnectedSocket() client: any,
  ) {
    client.join(data.chatId.toString()); // 加入聊天房间
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: { chatId: number; senderId: number; content: string },
    @ConnectedSocket() client: any,
  ) {
    // 存储消息
    const chat = await this.chatService.findChatById(data.chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }
    const newMessage = await this.messageService.createMessage(
      data.content,
      data.senderId,
      chat,
    );

    // 广播消息给房间
    this.server.to(data.chatId.toString()).emit('message', newMessage);
  }
}
