import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddFriendDto {
  @ApiProperty({ description: '用户id' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ description: '好友id' })
  @IsNotEmpty()
  @IsNumber()
  friendId: number;
}
