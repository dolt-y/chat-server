import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SocketAuthService } from '../services/socket-auth.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly socketAuthService: SocketAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    await this.socketAuthService.attachUserToClient(client);
    return true;
  }
}
