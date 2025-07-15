import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../shared/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../../shared/dto/user/register.dto';
import { LoginDto } from '../../shared/dto/user/login.dto';
import ValidateDto from '../../shared/interfaces/validate';
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
      };
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.userRepository.update(user.id, {
      last_login: new Date(),
      status: 'online',
    });

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        status: 'online',
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: [{ username: registerDto.username }, { email: registerDto.email }],
    });
    if (existingUser) {
      throw new UnauthorizedException('Username or email already exists');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      status: 'offline',
    });
    await this.userRepository.save(newUser);
    return {
      message: 'Registration successful',
    };
  }

  async logout(userId: number) {
    await this.userRepository.update(userId, { status: 'offline' });
    return { message: 'Logout successful' };
  }
}
