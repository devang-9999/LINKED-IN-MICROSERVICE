import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/domain/profile/entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private async findUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['educations', 'experiences', 'skills'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getMyProfile(userId: string) {
    return this.findUser(userId);
  }

  async getPublicProfile(userId: string) {
    return this.findUser(userId);
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.findUser(userId);

    Object.assign(user, dto);

    return this.userRepository.save(user);
  }

  async updateProfilePicture(userId: string, filename: string) {
    const user = await this.findUser(userId);

    user.profilePicture = filename;

    return this.userRepository.save(user);
  }

  async updateCoverPicture(userId: string, filename: string) {
    const user = await this.findUser(userId);

    user.coverPicture = filename;

    return this.userRepository.save(user);
  }
}
