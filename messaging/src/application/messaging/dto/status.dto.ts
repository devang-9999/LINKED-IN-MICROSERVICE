import { IsString, IsEnum } from 'class-validator';
import { MessageStatus } from 'src/domain/messaging.entity';

export class UpdateMessageStatusDto {
  @IsString()
  messageId: string;

  @IsEnum(MessageStatus)
  status: MessageStatus;
}
