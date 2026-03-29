import { IsString, IsOptional, IsNumber } from 'class-validator';

export class GetMessagesDto {
  @IsString()
  roomId: string;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  offset?: number;
}
