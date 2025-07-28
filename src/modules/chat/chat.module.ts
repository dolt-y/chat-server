import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { MessageService } from './message.service';
import { ChatService } from './chat.service';
import { Message } from '../../shared/entities/Message.entity';
import { Chat } from 'src/shared/entities/chat.entity';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    TypeOrmModule.forFeature([Chat]),
  ],
  providers: [ChatGateway, MessageService, ChatService],
  exports: [MessageService],
  controllers: [ChatController],
})
export class ChatModule {}
