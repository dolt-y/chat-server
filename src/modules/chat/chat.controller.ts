import { MessageService } from './message.service';
import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { GetMessageDto } from 'src/shared/dto/chat/getMessageDto';

// @UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({ summary: '获取聊天记录' })
  @Post('/messages')
  async getMessages(@Body() params: GetMessageDto) {
    const messages = await this.messageService.getMessagesByChatId(
      params.chatId,
    );
    return messages;
  }
}
