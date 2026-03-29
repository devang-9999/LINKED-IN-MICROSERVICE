/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie';

import { MessageService } from './messaging.service';
import { SendMessageDto } from './dto/sendMessage.dto';
import { GetMessagesDto } from './dto/fetchMessages.dto';
import { TypingDto } from './dto/typing.dto';
import { MarkAsSeenDto } from './dto/seen.dto';
import { UpdateMessageStatusDto } from './dto/status.dto';

interface AuthenticatedSocket extends Socket {
  data: {
    userId?: string;
  };
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly messageService: MessageService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: AuthenticatedSocket) {
    try {
      console.log('🔌 Incoming socket connection');

      const cookies = cookie.parse(client.handshake.headers.cookie || '');
      const token = cookies.token;

      if (!token) {
        console.log('❌ No token found');
        return client.disconnect();
      }

      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      client.data.userId = userId;

      console.log('✅ Authenticated user:', userId);

      await client.join(`user:${userId}`);
      console.log(`📡 Joined personal room: user:${userId}`);
    } catch (err) {
      console.log('❌ Connection auth failed:', err?.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    console.log('🔌 Disconnected:', client.data.userId);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    console.log('📥 joinRoom called with:', roomId);

    if (!roomId) {
      console.log('❌ joinRoom: roomId missing');
      return;
    }

    await client.join(`room:${roomId}`);
    console.log(`✅ Joined room: room:${roomId}`);
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    console.log('📤 leaveRoom called with:', roomId);

    if (!roomId) {
      console.log('❌ leaveRoom: roomId missing');
      return;
    }

    await client.leave(`room:${roomId}`);
    console.log(`🚪 Left room: room:${roomId}`);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody() dto: SendMessageDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      console.log('🔥 sendMessage EVENT RECEIVED');
      console.log('📦 DTO:', dto);

      const senderId = client.data.userId;
      console.log('👤 senderId:', senderId);

      if (!senderId) {
        console.log('❌ senderId missing');
        return;
      }

      const message = await this.messageService.createMessage(senderId, dto);

      console.log('💾 Message saved successfully:', message);

      if (!message?.roomId) {
        console.log('❌ ERROR: roomId missing after save');
        return;
      }

      const roomId = message.roomId;

      console.log('📡 Joining sender to room:', roomId);
      await client.join(`room:${roomId}`);

      console.log('📡 Adding receiver to room:', dto.receiverId);
      this.server.in(`user:${dto.receiverId}`).socketsJoin(`room:${roomId}`);

      console.log('📤 Emitting newMessage to room:', roomId);
      this.server.to(`room:${roomId}`).emit('newMessage', message);

      console.log('📤 Emitting newMessage to receiver user room');
      this.server.to(`user:${dto.receiverId}`).emit('newMessage', message);
    } catch (err) {
      console.error('❌ sendMessage FAILED:', err);
      throw err;
    }
  }

  @SubscribeMessage('fetchMessages')
  async fetchMessages(
    @MessageBody() dto: GetMessagesDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      console.log('📥 fetchMessages EVENT:', dto);

      if (!dto.roomId) {
        console.log('❌ fetchMessages: roomId missing');
        return;
      }

      const messages = await this.messageService.getMessages(dto);

      console.log('📤 Sending messages count:', messages.length);

      client.emit('messages', messages);
    } catch (err) {
      console.error('❌ fetchMessages FAILED:', err);
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() dto: TypingDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const userId = client.data.userId;

    if (!userId || !dto.roomId) {
      console.log('❌ typing: invalid payload');
      return;
    }

    console.log('⌨️ Typing event from:', userId);

    client.to(`room:${dto.roomId}`).emit('typing', { userId });
  }

  @SubscribeMessage('markAsSeen')
  async markAsSeen(
    @MessageBody() dto: MarkAsSeenDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      const userId = client.data.userId;

      if (!userId || !dto.roomId) {
        console.log('❌ markAsSeen: invalid data');
        return;
      }

      console.log('👀 Marking messages as seen for room:', dto.roomId);

      await this.messageService.markRoomAsSeen(dto.roomId, userId);

      this.server.to(`room:${dto.roomId}`).emit('messagesSeen', {
        roomId: dto.roomId,
        userId,
      });

      console.log('✅ messagesSeen emitted');
    } catch (err) {
      console.error('❌ markAsSeen FAILED:', err);
    }
  }

  @SubscribeMessage('messageDelivered')
  async messageDelivered(@MessageBody() dto: UpdateMessageStatusDto) {
    try {
      if (!dto.messageId) {
        console.log('❌ messageDelivered: messageId missing');
        return;
      }

      console.log('📦 Marking delivered:', dto.messageId);

      await this.messageService.markAsDelivered([dto.messageId]);

      console.log('✅ message marked as delivered');
    } catch (err) {
      console.error('❌ messageDelivered FAILED:', err);
    }
  }
}
