import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import ValidateDto from '../../shared/interfaces/validate';
import { ResponseDto } from 'src/shared/dto/common/response.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'username' });
  }

  async validate(
    username: string,
    password: string,
  ): Promise<ValidateDto | ResponseDto<null>> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      return new ResponseDto(false, '用户名或密码错误', null);
    }
    return user;
  }
}
