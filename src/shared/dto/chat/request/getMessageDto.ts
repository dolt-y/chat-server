import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class GetMessageDto {
  @ApiProperty({ description: '聊天 ID' })
  @IsNotEmpty()
  @IsNumber()
  chatId: number;

  @ApiProperty({ description: '可选的页码', required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number;

  @ApiProperty({ description: '可选的每页消息数量', required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  pageSize?: number;
}
