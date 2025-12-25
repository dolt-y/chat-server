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
import { SockDto } from 'src/shared/dto/chat/response/sockDto';
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
  ) { }

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
    @MessageBody() data: SockDto,
    @ConnectedSocket() client: any,
  ) {
    try {
      this.logger.log(`收到消息: ${data.content} from ${data.senderId} in chat ${data.chatId}`);

      const chat = await this.chatService.findChatById(data.chatId);
      if (!chat) {
        this.logger.error(`会话不存在: ${data.chatId}`);
        client.emit('error', { message: '会话不存在' });
        return;
      }

      const newMessage = await this.messageService.createMessage(
        data.content,
        data.senderId,
        chat,
        data.type || 'text',
      );

      this.server.to(data.chatId.toString()).emit('message', {
        chatId: chat.id,
        senderId: data.senderId,
        content: newMessage.content,
        type: newMessage.type,
        createdAt: newMessage.createdAt,
        senderUsername: newMessage.sender.username,
      });

      this.logger.log(`消息已广播到聊天室: ${data.chatId}`);
    } catch (error) {
      this.logger.error(`消息处理失败: ${error.message}`);
      client.emit('error', { message: '消息发送失败' });
    }
  }
}
