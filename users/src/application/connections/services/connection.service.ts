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

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectRepository(Connection)
    private connectionRepository: Repository<Connection>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

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
      throw new BadRequestException('Connection already exists');
    }

    const connection = this.connectionRepository.create({
      sender,
      receiver,
      status: ConnectionStatus.PENDING,
    });

    await this.connectionRepository.save(connection);

    return { message: 'Connection request sent' };
  }

  async acceptRequest(connectionId: string) {
    const connection = await this.connectionRepository.findOne({
      where: { id: connectionId },
    });

    if (!connection) {
      throw new NotFoundException('Connection request not found');
    }

    connection.status = ConnectionStatus.ACCEPTED;

    await this.connectionRepository.save(connection);

    return { message: 'Connection accepted' };
  }

  async rejectRequest(connectionId: string) {
    const connection = await this.connectionRepository.findOne({
      where: { id: connectionId },
    });

    if (!connection) {
      throw new NotFoundException('Connection request not found');
    }

    connection.status = ConnectionStatus.REJECTED;

    await this.connectionRepository.save(connection);

    return { message: 'Connection rejected' };
  }
}
