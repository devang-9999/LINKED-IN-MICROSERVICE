/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MaxLength(1000)
  text: string;

  @IsUUID()
  postId: string;

  @IsOptional()
  @IsUUID()
  parentCommentId?: string;
}
