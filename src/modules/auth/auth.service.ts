import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../shared/entities/User.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../../shared/dto/user/register.dto';
import { LoginDto } from '../../shared/dto/user/login.dto';
import ValidateDto from '../../shared/interfaces/validate';
import { ResponseDto } from '../../shared/dto/common/response.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<ValidateDto | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        status: user.status,
      };
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      return new ResponseDto(false, '用户名或密码错误', null);
    }
    await this.userRepository.update(user.id, {
      lastLogin: new Date(),
      status: 'online',
    });
    const payload = { username: user.username, sub: user.id };
    return new ResponseDto(true, '登录成功', {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        status: 'online',
      },
    });
  }

  async register(registerDto: RegisterDto): Promise<ResponseDto<any>> {
    const existingUser = await this.userRepository.findOne({
      where: [{ username: registerDto.username }, { email: registerDto.email }],
    });
    if (existingUser) {
      return new ResponseDto(false, '用户名或邮箱已存在', null);
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    try {
      const newUser = this.userRepository.create({
        ...registerDto,
        password: hashedPassword,
        status: 'offline',
      });
      await this.userRepository.save(newUser);
    } catch (error: any) {
      return new ResponseDto(false, error as string, null);
    }
    return new ResponseDto(true, '注册成功', null);
  }

  async logout(userId: number) {
    await this.userRepository.update(userId, { status: 'offline' });
    return new ResponseDto(true, '登出成功', null);
  }
}
