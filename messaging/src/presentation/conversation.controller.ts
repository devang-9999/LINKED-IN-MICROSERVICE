/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Param,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConversationService } from 'src/application/conversation/conversation.service';
import { JwtAuthGuard } from 'src/infrastructure/security/jwt-auth.gaurd';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  async getUserConversations(@Req() req: any) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException();
    }

    return await this.conversationService.getUserConversations(userId);
  }

  @Get(':id')
  async getConversationById(@Param('id') id: string) {
    return await this.conversationService.getConversationById(id);
  }
}
