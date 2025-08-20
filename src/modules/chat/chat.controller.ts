import { MessageService } from './message.service';
import { Body, Controller, Get, Logger, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { GetMessageDto } from 'src/shared/dto/chat/request/getMessageDto';
import { ChatService } from './chat.service';
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);
  constructor(private readonly messageService: MessageService, private readonly chatService: ChatService) { }

  @ApiOperation({ summary: '获取会话聊天记录' })
  @Post('/messages')
  async getMessages(@Body() params: GetMessageDto) {
    return this.messageService.getMessagesByChatId(params.chatId);
  }
  @Get('/sessionList')
  @ApiOperation({ summary: '获取用户当前会话列表' })
  async getSessionChatList(@Query('userId') userId: number) {
    return this.chatService.getUserChatsOptimized(userId)
  }
}
