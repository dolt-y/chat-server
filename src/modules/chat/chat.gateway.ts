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
import { Logger, UseGuards } from '@nestjs/common';
import { SockDto } from 'src/shared/dto/chat/response/sockDto';
import { WsJwtGuard } from 'src/core/guards/ws-jwt.guard';
import {
  AuthedSocket,
  SocketAuthService,
} from 'src/core/services/socket-auth.service';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly messageService: MessageService,
    private readonly chatService: ChatService,
    private readonly socketAuthService: SocketAuthService,
  ) { }

  async handleConnection(client: AuthedSocket) {
    try {
      const user = await this.socketAuthService.attachUserToClient(client);
      this.logger.log(`客户端连接成功: ${client.id} (user: ${user.id})`);
    } catch (error) {
      this.logger.warn(`未授权的连接已断开: ${client.id}`);
      client.disconnect();
    }
  }
  
  handleDisconnect(client: AuthedSocket) {
    this.logger.log(`客户端断开连接: ${client.id}`);
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @MessageBody() data: { chatId: number },
    @ConnectedSocket() client: AuthedSocket,
  ) {
    if (!client.user) {
      this.logger.warn(`未授权的连接尝试加入房间: ${client.id}`);
      client.emit('error', { message: '未授权访问' });
      return;
    }

    const canJoin = await this.chatService.isUserInChat(
      data.chatId,
      client.user.id,
    );

    if (!canJoin) {
      this.logger.warn(
        `用户 ${client.user.id} 尝试加入未授权会话: ${data.chatId}`,
      );
      client.emit('error', { message: '你无权加入该会话' });
      return;
    }

    client.join(data.chatId.toString());
    this.logger.log(`用户 ${client.user.id} 加入聊天房间: ${data.chatId}`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: SockDto,
    @ConnectedSocket() client: AuthedSocket,
  ) {
    try {
      if (!client.user) {
        this.logger.warn(`未授权的消息发送尝试: ${client.id}`);
        client.emit('error', { message: '未授权访问' });
        return;
      }

      const chat = await this.chatService.findChatById(data.chatId);
      if (!chat) {
        this.logger.error(`会话不存在: ${data.chatId}`);
        client.emit('error', { message: '会话不存在' });
        return;
      }

      const senderId = client.user.id;

      const isMember = await this.chatService.isUserInChat(
        chat.id,
        senderId,
      );
      if (!isMember) {
        this.logger.warn(
          `用户 ${senderId} 尝试向未加入的会话 ${data.chatId} 发送消息`,
        );
        client.emit('error', { message: '你无权发送消息到该会话' });
        return;
      }

      if (data.senderId && data.senderId !== senderId) {
        this.logger.warn(
          `用户 ${senderId} 试图伪造 senderId ${data.senderId}，已使用真实身份发送`,
        );
      }

      this.logger.log(
        `收到消息: ${data.content} from ${senderId} in chat ${data.chatId}`,
      );

      const newMessage = await this.messageService.createMessage(
        data.content,
        senderId,
        chat,
        data.type || 'text',
      );

      this.server.to(data.chatId.toString()).emit('message', {
        chatId: chat.id,
        senderId,
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
