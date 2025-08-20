import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../../shared/dto/user/register.dto';
import { LoginDto } from '../../shared/dto/user/login.dto';
import { LocalAuthGuard } from '../../core/guards/local-auth.guard';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { Request } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponseWithDescriptions } from 'src/shared/constant/response.enum';

@Controller('auth')
@ApiResponseWithDescriptions()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  @ApiOperation({ summary: '用户登出' })
  @Post('logout')
  async logout(@Req() req: Request) {
    return this.authService.logout((req.user as { id: number }).id);
  }
}
