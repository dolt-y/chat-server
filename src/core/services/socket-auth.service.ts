import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/shared/entities/User.entity';

export type AuthedSocket = Socket & { user?: User };

@Injectable()
export class SocketAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async attachUserToClient(client: AuthedSocket): Promise<User> {
    if (client.user) {
      return client.user;
    }

    const token = this.extractToken(client);

    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    client.user = user;
    return user;
  }

  private extractToken(client: AuthedSocket): string | null {
    const authHeader: string | undefined =
      client.handshake?.headers?.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }

    const authToken = client.handshake?.auth?.token;
    if (typeof authToken === 'string') {
      return authToken;
    }

    const queryToken = client.handshake?.query?.token;
    if (typeof queryToken === 'string') {
      return queryToken;
    }

    return null;
  }
}
