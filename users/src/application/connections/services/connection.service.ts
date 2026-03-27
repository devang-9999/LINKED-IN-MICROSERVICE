/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Connection,
  ConnectionStatus,
} from 'src/domain/connections/entities/connection.entity';

import { User } from 'src/domain/profile/entities/user.entity';
import { OutboxEvent } from 'src/infrastructure/outbox/outbox.entity';

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectRepository(Connection)
    private connectionRepository: Repository<Connection>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(OutboxEvent)
    private outboxRepository: Repository<OutboxEvent>,
  ) {}

  // 🔥 SEND CONNECTION REQUEST
  async sendRequest(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('Cannot connect with yourself');
    }

    const sender = await this.userRepository.findOne({
      where: { id: currentUserId },
    });

    const receiver = await this.userRepository.findOne({
      where: { id: targetUserId },
    });

    if (!sender || !receiver) {
      throw new NotFoundException('User not found');
    }

    const existing = await this.connectionRepository.findOne({
      where: [
        { sender: { id: currentUserId }, receiver: { id: targetUserId } },
        { sender: { id: targetUserId }, receiver: { id: currentUserId } },
      ],
    });

    if (existing) {
      return { message: 'Connection already exists' };
    }

    const connection = this.connectionRepository.create({
      sender,
      receiver,
      status: ConnectionStatus.PENDING,
    });

    await this.connectionRepository.save(connection);

    // ✅ ENRICHED OUTBOX EVENT
    await this.outboxRepository.save({
      aggregateType: 'connection',
      aggregateId: connection.id,
      eventType: 'connection.requested',
      payload: {
        senderId: sender.id,
        receiverId: receiver.id,
        senderName: `${sender.firstName} ${sender.lastName}`,
        senderAvatar: sender.profilePicture,
      },
    });

    return { message: 'Connection request sent' };
  }

  // 🔥 ACCEPT REQUEST
  async acceptRequest(connectionId: string) {
    const connection = await this.connectionRepository.findOne({
      where: { id: connectionId },
      relations: ['sender', 'receiver'],
    });

    if (!connection) {
      throw new NotFoundException('Connection request not found');
    }

    connection.status = ConnectionStatus.ACCEPTED;

    await this.connectionRepository.save(connection);

    await this.outboxRepository.save({
      aggregateType: 'connection',
      aggregateId: connection.id,
      eventType: 'connection.accepted',
      payload: {
        senderId: connection.receiver.id,
        receiverId: connection.sender.id,
        senderName: `${connection.receiver.firstName} ${connection.receiver.lastName}`,
        senderAvatar: connection.receiver.profilePicture,
      },
    });

    return { message: 'Connection accepted' };
  }

  // 🔥 REJECT REQUEST
  async rejectRequest(connectionId: string) {
    const connection = await this.connectionRepository.findOne({
      where: { id: connectionId },
      relations: ['sender', 'receiver'],
    });

    if (!connection) {
      throw new NotFoundException('Connection request not found');
    }

    connection.status = ConnectionStatus.REJECTED;

    await this.connectionRepository.save(connection);

    await this.outboxRepository.save({
      aggregateType: 'connection',
      aggregateId: connection.id,
      eventType: 'connection.rejected',
      payload: {
        senderId: connection.sender.id,
        receiverId: connection.receiver.id,
        senderName: `${connection.receiver.firstName} ${connection.receiver.lastName}`,
      },
    });

    return { message: 'Connection rejected' };
  }

  // 🔥 CANCEL REQUEST
  async cancelRequest(currentUserId: string, targetUserId: string) {
    const connection = await this.connectionRepository.findOne({
      where: {
        sender: { id: currentUserId },
        receiver: { id: targetUserId },
        status: ConnectionStatus.PENDING,
      },
    });

    if (!connection) {
      throw new NotFoundException('Pending request not found');
    }

    await this.connectionRepository.remove(connection);

    return { message: 'Connection request cancelled' };
  }

  // 🔥 GET CONNECTION STATUS
  async getConnectionStatus(currentUserId: string, targetUserId: string) {
    const connection = await this.connectionRepository.findOne({
      where: [
        { sender: { id: currentUserId }, receiver: { id: targetUserId } },
        { sender: { id: targetUserId }, receiver: { id: currentUserId } },
      ],
      relations: ['sender'],
    });

    if (!connection) {
      return { status: null };
    }

    return {
      status: connection.status,
      isSender: connection.sender.id === currentUserId,
    };
  }

  // 🔥 RECEIVED REQUESTS
  async getReceivedRequests(currentUserId: string) {
    const requests = await this.connectionRepository.find({
      where: {
        receiver: { id: currentUserId },
        status: ConnectionStatus.PENDING,
      },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
    });

    return requests.map((req) => ({
      id: req.id,
      status: req.status,
      createdAt: req.createdAt,

      sender: {
        id: req.sender.id,
        firstName: req.sender.firstName,
        lastName: req.sender.lastName,
        headline: req.sender.headline,
        profilePicture: req.sender.profilePicture,
      },
    }));
  }

  // 🔥 SENT REQUESTS
  async getSentRequests(currentUserId: string) {
    const requests = await this.connectionRepository.find({
      where: {
        sender: { id: currentUserId },
        status: ConnectionStatus.PENDING,
      },
      relations: ['receiver'],
      order: { createdAt: 'DESC' },
    });

    return requests.map((req) => ({
      id: req.id,
      status: req.status,
      createdAt: req.createdAt,

      receiver: {
        id: req.receiver.id,
        firstName: req.receiver.firstName,
        lastName: req.receiver.lastName,
        headline: req.receiver.headline,
        profilePicture: req.receiver.profilePicture,
      },
    }));
  }
}
