/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsUUID } from 'class-validator';

export class CreatePostLikeDto {
  @IsUUID()
  postId: string;
}
