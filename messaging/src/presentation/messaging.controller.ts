/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Param,
  Query,
  Patch,
  Body,
  Req,
  UseGuards,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

import { GetMessagesDto } from 'src/application/messaging/dto/fetchMessages.dto';
import { MarkAsSeenDto } from 'src/application/messaging/dto/seen.dto';
import { MessageService } from 'src/application/messaging/messaging.service';
import { ConversationService } from 'src/application/conversation/conversation.service';
import { JwtAuthGuard } from 'src/infrastructure/security/jwt-auth.gaurd';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
  ) {}

  @Get('single/:id')
  async getMessageById(@Param('id') id: string) {
    return await this.messageService.getMessageById(id);
  }

  @Get(':roomId')
  async getMessages(
    @Param('roomId') roomId: string,
    @Query() query: GetMessagesDto,
    @Req() req: any,
  ) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException();
    }

    const convo = await this.conversationService.getConversationById(roomId);

    if (!convo || !convo.participants.includes(userId)) {
      throw new ForbiddenException('Access denied');
    }

    return await this.messageService.getMessages({
      roomId,
      limit: query.limit,
      offset: query.offset,
    });
  }

  @Patch('delivered')
  async markDelivered(@Body() body: { messageIds: string[] }) {
    await this.messageService.markAsDelivered(body.messageIds);
    return { success: true };
  }

  @Patch('seen')
  async markSeen(@Body() dto: MarkAsSeenDto, @Req() req: any) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException();
    }

    await this.messageService.markRoomAsSeen(dto.roomId, userId);

    return { success: true };
  }
}
