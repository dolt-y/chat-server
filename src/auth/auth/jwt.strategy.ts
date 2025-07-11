// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken<>(),
      ignoreExpiration: false,
      secretOrKey: 'your_jwt_secret', // 请替换为你的 JWT 密钥
    });
  }

  async validate(payload: User) {
    return this.usersService.findByUsername(payload.username);
  }
}
