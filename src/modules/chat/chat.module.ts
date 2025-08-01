import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { MessageService } from './message.service';
import { ChatService } from './chat.service';
import { Messages } from '../../shared/entities/Messages.entity';
import { Chats } from 'src/shared/entities/Chats.entity';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Messages]),
    TypeOrmModule.forFeature([Chats]),
  ],
  providers: [ChatGateway, MessageService, ChatService],
  exports: [MessageService],
  controllers: [ChatController],
})
export class ChatModule {}
