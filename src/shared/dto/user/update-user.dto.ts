import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: '邮箱' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: '手机号' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: '头像' })
  @IsOptional()
  @IsUrl()
  avatar_url?: string;

  @ApiProperty({ description: '状态' })
  @IsOptional()
  @IsString()
  status?: 'online' | 'offline' | 'away';
}
