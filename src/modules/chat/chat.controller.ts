import { MessageService } from './message.service';
import { Body, Controller, ForbiddenException, Get, Logger, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { GetMessageDto } from 'src/shared/dto/chat/request/getMessageDto';
import { ChatService } from './chat.service';
import { MarkMessagesReadDto } from 'src/shared/dto/chat/request/markMessagesRead.dto';
import { DeleteChatDto } from 'src/shared/dto/chat/request/deleteChat.dto';
import { Request } from 'express';
import { User } from 'src/shared/entities/User.entity';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);
  constructor(private readonly messageService: MessageService, private readonly chatService: ChatService) { }

  @ApiOperation({ summary: '获取聊天记录' })
  @Post('/messages')
  async getMessages(@Body() getMessageDto: GetMessageDto) {
    this.logger.log(`Getting messages for chat ${getMessageDto.page}, ${getMessageDto.pageSize}`);
    return this.messageService.getMessagesByChatId(getMessageDto);
  }

  @Post('/delete')
  @ApiOperation({ summary: '删除或退出会话' })
  async deleteChat(
    @Body() deleteChatDto: DeleteChatDto,
    @Req() req: Request,
  ) {
    const { chatId } = deleteChatDto;
    const userId = (req.user as User).id;
    this.logger.log(`Deleting chat ${chatId} requested by user ${userId}`);

    const hasAccess = await this.chatService.isUserInChat(chatId, userId);
    if (!hasAccess) {
      throw new ForbiddenException('你无权操作该会话');
    }

    return this.chatService.removeChatForUser(chatId, userId);
  }

  @Post('/markRead')
  @ApiOperation({ summary: '标记会话消息为已读' })
  async markMessagesAsRead(
    @Body() markMessagesReadDto: MarkMessagesReadDto,
    @Req() req: Request,
  ) {
    const { chatId } = markMessagesReadDto;
    const userId = (req.user as User).id;
    this.logger.log(`Marking messages as read for chat ${chatId} by user ${userId}`);

    const hasAccess = await this.chatService.isUserInChat(chatId, userId);
    if (!hasAccess) {
      throw new ForbiddenException('你无权操作该会话');
    }
    return this.messageService.markMessagesAsRead(chatId, userId);
  }
  @Get('/sessionList')
  @ApiOperation({ summary: '获取用户当前会话列表' })
  async getSessionChatList(@Query('userId') userId: number) {
    this.logger.log(`Getting session chat list for user ${userId}`);
    return this.chatService.getUserChatsOptimized(userId)
  }
}
