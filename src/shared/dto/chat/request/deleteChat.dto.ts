import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class DeleteChatDto {
  @ApiProperty({ description: '聊天 ID' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  chatId: number;
}
