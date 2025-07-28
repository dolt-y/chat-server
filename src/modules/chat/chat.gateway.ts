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
import { MessageService } from './message.service';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly messageService: MessageService,
    private readonly chatService: ChatService,
  ) {}

  handleConnection(client: any) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody() data: { chatId: number },
    @ConnectedSocket() client: any,
  ) {
    client.join(data.chatId.toString());
    this.logger.log(`Client ${client.id} joined chat: ${data.chatId}`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: { chatId: number; senderId: number; content: string },
    @ConnectedSocket() client: any,
  ) {
    this.logger.log(
      `Received message from ${data.senderId} in chat ${data.chatId}: ${data.content}`,
    );
    // 查找聊天对象,避免当会话不存在时发送消息
    const chat = await this.chatService.findChatById(data.chatId);
    if (!chat) {
      this.logger.error(`Chat not found for ID: ${data.chatId}`);
      throw new Error('Chat not found');
    }
    const newMessage = await this.messageService.createMessage(
      data.content,
      data.senderId,
      chat,
    );
    // 向聊天房间广播新消息
    this.server.to(data.chatId.toString()).emit('message', {
      content: newMessage.content,
      senderId: data.senderId,
      chatId: chat.id,
      createdAt: newMessage.created_at,
    });
    this.logger.log(
      `Message sent to chat ${data.chatId}: ${newMessage.content}`,
    );
  }
}
