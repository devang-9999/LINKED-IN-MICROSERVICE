import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message, MessageStatus } from 'src/domain/messaging.entity';
import { Repository } from 'typeorm';
import { ConversationService } from '../conversation/conversation.service';
import { SendMessageDto } from './dto/sendMessage.dto';
import { GetMessagesDto } from './dto/fetchMessages.dto';
import { Conversation } from 'src/domain/conversation.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly conversationService: ConversationService,
  ) {}
  async createMessage(senderId: string, dto: SendMessageDto) {
    let conversation: Conversation | null = null;

    /* STEP 0: Validate input */
    if (!dto.receiverId) {
      throw new NotFoundException('receiverId is required');
    }

    if (!dto.content) {
      throw new NotFoundException('content is required');
    }

    /* STEP 1: Try existing conversation */
    if (dto.roomId) {
      conversation = await this.conversationService.getConversationById(
        dto.roomId,
      );

      if (!conversation) {
        console.warn('⚠️ Invalid roomId, resetting...');
        conversation = null;
      } else if (!conversation.participants.includes(senderId)) {
        console.warn('⚠️ Sender not part of conversation, resetting...');
        conversation = null;
      }
    }

    /* STEP 2: Create if not exists */
    if (!conversation) {
      console.log('🆕 Creating new conversation');

      conversation = await this.conversationService.findOrCreateConversation(
        senderId,
        dto.receiverId,
      );
    }

    if (!conversation || !conversation.id) {
      throw new NotFoundException('❌ Conversation creation failed');
    }

    /* STEP 3: Create message */
    const message = this.messageRepository.create({
      roomId: conversation.id,
      senderId,
      receiverId: dto.receiverId,
      content: dto.content,
      status: MessageStatus.SENT,
    });

    console.log('🧠 Before save:', message);

    const savedMessage = await this.messageRepository.save(message);

    if (!savedMessage) {
      throw new Error('❌ Message not saved');
    }

    console.log('💾 Message saved:', savedMessage);

    /* STEP 4: Update conversation */
    await this.conversationService.updateLastMessage(
      conversation.id,
      dto.content,
      senderId,
    );

    return savedMessage;
  }

  /* ================= GET MESSAGES ================= */
  async getMessages(dto: GetMessagesDto) {
    const { roomId, limit = 50, offset = 0 } = dto;

    if (!roomId) {
      console.warn('⚠️ getMessages called without roomId');
      return [];
    }

    return await this.messageRepository.find({
      where: { roomId },
      order: { createdAt: 'ASC' },
      take: limit,
      skip: offset,
    });
  }

  /* ================= DELIVERED ================= */
  async markAsDelivered(messageIds: string[]) {
    if (!messageIds.length) return;

    await this.messageRepository.update(messageIds, {
      status: MessageStatus.DELIVERED,
    });
  }

  /* ================= SEEN ================= */
  async markRoomAsSeen(roomId: string, userId: string) {
    if (!roomId || !userId) return;

    await this.messageRepository
      .createQueryBuilder()
      .update(Message)
      .set({ status: MessageStatus.SEEN })
      .where('roomId = :roomId', { roomId })
      .andWhere('receiverId = :userId', { userId })
      .execute();
  }

  /* ================= GET SINGLE ================= */
  async getMessageById(id: string) {
    const msg = await this.messageRepository.findOne({
      where: { id },
    });

    if (!msg) {
      throw new NotFoundException('Message not found');
    }

    return msg;
  }
}
