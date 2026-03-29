import { IsString } from 'class-validator';

export class MarkAsSeenDto {
  @IsString()
  roomId: string;

  @IsString()
  userId: string;
}
