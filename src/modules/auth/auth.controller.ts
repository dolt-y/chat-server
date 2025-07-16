import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../../shared/dto/user/register.dto';
import { LoginDto } from '../../shared/dto/user/login.dto';
import { LocalAuthGuard } from '../../core/guards/local-auth.guard';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: '用户注册' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: '用户登录' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '用户登出' })
  @Post('logout')
  async logout(@Req() req: Request) {
    return this.authService.logout((req.user as { id: number }).id);
  }
}
