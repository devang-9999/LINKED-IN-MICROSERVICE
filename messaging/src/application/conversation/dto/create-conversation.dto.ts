import { IsArray, ArrayMinSize, IsUUID } from 'class-validator';

export class CreateConversationDto {
  @IsArray()
  @ArrayMinSize(2)
  @IsUUID('all', { each: true })
  participants: string[];
}
