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
    this.logger.log(`客户端连接成功: ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`客户端断开连接: ${client.id}`);
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody() data: { chatId: number },
    @ConnectedSocket() client: any,
  ) {
    client.join(data.chatId.toString());
    this.logger.log(`加入聊天房间: ${data.chatId}`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: { chatId: number; senderId: number; content: string },
    @ConnectedSocket() client: any,
  ) {
    this.logger.log(`收到消息: ${data.content}`);
    const chat = await this.chatService.findChatById(data.chatId);
    if (!chat) {
      this.logger.error(`会话不存在: ${data.chatId}`);
      throw new Error('会话不存在');
    }
    const newMessage = await this.messageService.createMessage(
      data.content,
      data.senderId,
      chat,
    );
    this.server.to(data.chatId.toString()).emit('message', {
      content: newMessage.content,
      senderId: data.senderId,
      chatId: chat.id,
      createdAt: newMessage.created_at,
    });
    this.logger.log(`向聊天房间广播消息: ${newMessage.content}`);
  }
}
