import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { MessageService } from './message.service';
import { ChatService } from './chat.service';
import { Messages } from '../../shared/entities/Messages.entity';
import { Chats } from 'src/shared/entities/Chats.entity';
import { ChatController } from './chat.controller';
import { ConversationMembers } from 'src/shared/entities/ConversationMembers.entity';
import { User } from 'src/shared/entities/User.entity';
import { WsJwtGuard } from 'src/core/guards/ws-jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SocketAuthService } from 'src/core/services/socket-auth.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Messages, Chats, ConversationMembers, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    ChatGateway,
    MessageService,
    ChatService,
    WsJwtGuard,
    SocketAuthService,
  ],
  exports: [MessageService],
  controllers: [ChatController],
})
export class ChatModule {}
