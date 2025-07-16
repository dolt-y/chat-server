import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  IsEnum,
  IsInt,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: '用户 ID' })
  @IsInt()
  id: number;

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
  @IsEnum(['online', 'offline', 'away', 'busy'])
  status?: 'online' | 'offline' | 'away' | 'busy';

  @ApiProperty({ description: '用户昵称' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: '用户简介' })
  @IsOptional()
  @IsString()
  bio?: string;
}
