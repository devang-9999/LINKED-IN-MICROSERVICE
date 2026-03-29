import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from 'src/domain/conversation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async findOrCreateConversation(
    userA: string,
    userB: string,
  ): Promise<Conversation> {
    if (!userA || !userB) {
      throw new BadRequestException('Users are required');
    }

    if (userA === userB) {
      throw new BadRequestException('Cannot create conversation with yourself');
    }

    console.log('🔍 Finding conversation between:', userA, userB);

    let conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.participants @> ARRAY[:userA]::uuid[]', { userA })
      .andWhere('conversation.participants @> ARRAY[:userB]::uuid[]', {
        userB,
      })
      .getOne();

    if (conversation) {
      console.log('✅ Existing conversation found:', conversation.id);
      return conversation;
    }

    console.log('🆕 Creating new conversation');

    conversation = this.conversationRepository.create({
      participants: [userA, userB],
    });

    const saved = await this.conversationRepository.save(conversation);

    console.log('💾 Conversation created:', saved.id);

    return saved;
  }

  async updateLastMessage(
    conversationId: string,
    message: string,
    senderId: string,
  ): Promise<void> {
    if (!conversationId) return;

    await this.conversationRepository.update(conversationId, {
      lastMessage: message,
      lastMessageSenderId: senderId,
      lastMessageAt: new Date(),
    });
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    if (!userId) return [];

    return await this.conversationRepository
      .createQueryBuilder('conversation')
      .where('conversation.participants @> ARRAY[:userId]::uuid[]', { userId })
      .orderBy('conversation.lastMessageAt', 'DESC')
      .getMany();
  }

  async getConversationById(
    conversationId: string,
  ): Promise<Conversation | null> {
    if (!conversationId) return null;

    const convo = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!convo) {
      console.warn('⚠️ Conversation not found:', conversationId);
    }

    return convo;
  }
}
